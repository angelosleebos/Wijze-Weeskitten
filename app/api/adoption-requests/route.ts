import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/mailer';
import { getSettings } from '@/lib/settings';
import { verifyRecaptcha } from '@/lib/recaptcha';

// GET all adoption requests (admin only) or by email (visitor)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      // Public endpoint: get requests by email
      const result = await pool.query(
        `SELECT ar.*, c.name as cat_name, c.image_url as cat_image 
         FROM adoption_requests ar
         JOIN cats c ON ar.cat_id = c.id
         WHERE ar.email = $1
         ORDER BY ar.created_at DESC`,
        [email]
      );
      return NextResponse.json({ requests: result.rows });
    }
    
    // Admin endpoint: get all requests
    requireAuth(request);
    
    const status = searchParams.get('status');
    let query = `
      SELECT ar.*, c.name as cat_name, c.image_url as cat_image 
      FROM adoption_requests ar
      JOIN cats c ON ar.cat_id = c.id
    `;
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE ar.status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY ar.created_at DESC';
    
    const result = await pool.query(query, params);
    return NextResponse.json({ requests: result.rows });
  } catch (error: any) {
    console.error('Error fetching adoption requests:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch adoption requests' },
      { status: 500 }
    );
  }
}

// POST new adoption request (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cat_id,
      name,
      email,
      phone,
      address,
      city,
      postal_code,
      household_type,
      has_garden,
      has_other_pets,
      other_pets_description,
      has_children,
      children_ages,
      cat_experience,
      motivation,
      recaptcha_token,
    } = body;

    // Validation
    if (!cat_id || !name || !email || !motivation) {
      return NextResponse.json(
        { error: 'Cat, name, email and motivation are required' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA if configured
    const settings = await getSettings();
    if (settings.recaptcha_secret_key && recaptcha_token) {
      const recaptchaResult = await verifyRecaptcha(recaptcha_token, settings.recaptcha_secret_key);
      
      if (!recaptchaResult.success) {
        console.error('reCAPTCHA verification failed:', recaptchaResult.error);
        return NextResponse.json(
          { error: 'Spam verificatie mislukt. Probeer het opnieuw.' },
          { status: 400 }
        );
      }
      
      // Log score for monitoring (optional)
      if (recaptchaResult.score !== undefined) {
        console.log(`reCAPTCHA score for adoption request: ${recaptchaResult.score}`);
      }
    }

    // Check if cat exists and is available
    const catCheck = await pool.query(
      'SELECT status FROM cats WHERE id = $1',
      [cat_id]
    );
    
    if (catCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cat not found' },
        { status: 404 }
      );
    }

    const result = await pool.query(
      `INSERT INTO adoption_requests (
        cat_id, name, email, phone, address, city, postal_code,
        household_type, has_garden, has_other_pets, other_pets_description,
        has_children, children_ages, cat_experience, motivation, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'pending')
      RETURNING *`,
      [
        cat_id, name, email, phone, address, city, postal_code,
        household_type, has_garden, has_other_pets, other_pets_description,
        has_children, children_ages, cat_experience, motivation
      ]
    );

    const newRequest = result.rows[0];
    
    // Send email notification to admin
    try {
      const catName = await pool.query('SELECT name FROM cats WHERE id = $1', [cat_id]);
      
      await sendEmail({
        to: settings.contact_email,
        subject: `Nieuwe adoptie-aanvraag: ${catName.rows[0].name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ee6fa0;">Nieuwe Adoptie-aanvraag</h1>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Kat: ${catName.rows[0].name}</h2>
              <p><strong>Aanvrager:</strong> ${name}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <p><strong>Telefoon:</strong> ${phone || 'Niet opgegeven'}</p>
              <p><strong>Adres:</strong> ${address || ''} ${postal_code || ''} ${city || ''}</p>
            </div>
            
            <h3>Woonsituatie</h3>
            <ul>
              <li><strong>Type huishouden:</strong> ${household_type || 'Niet opgegeven'}</li>
              <li><strong>Tuin:</strong> ${has_garden ? 'Ja' : 'Nee'}</li>
              <li><strong>Andere huisdieren:</strong> ${has_other_pets ? `Ja - ${other_pets_description}` : 'Nee'}</li>
              <li><strong>Kinderen:</strong> ${has_children ? `Ja - ${children_ages}` : 'Nee'}</li>
            </ul>
            
            <h3>Ervaring & Motivatie</h3>
            <p><strong>Eerdere ervaring:</strong> ${cat_experience ? 'Ja' : 'Nee'}</p>
            <p><strong>Motivatie:</strong></p>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${motivation}</p>
            
            <p style="margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_API_URL}/admin/adoptie-aanvragen" 
                 style="background: #ee6fa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Bekijk in Admin Panel
              </a>
            </p>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Aanvraag ontvangen op: ${new Date().toLocaleString('nl-NL')}<br>
              Aanvraag ID: #${newRequest.id}
            </p>
          </div>
        `,
        text: `
Nieuwe Adoptie-aanvraag

Kat: ${catName.rows[0].name}
Aanvrager: ${name}
E-mail: ${email}
Telefoon: ${phone || 'Niet opgegeven'}

Woonsituatie:
- Type huishouden: ${household_type || 'Niet opgegeven'}
- Tuin: ${has_garden ? 'Ja' : 'Nee'}
- Andere huisdieren: ${has_other_pets ? `Ja - ${other_pets_description}` : 'Nee'}
- Kinderen: ${has_children ? `Ja - ${children_ages}` : 'Nee'}

Eerdere ervaring: ${cat_experience ? 'Ja' : 'Nee'}

Motivatie:
${motivation}

Bekijk in admin panel: ${process.env.NEXT_PUBLIC_API_URL}/admin/adoptie-aanvragen
Aanvraag ID: #${newRequest.id}
        `
      });
      
      // Send confirmation email to applicant
      await sendEmail({
        to: email,
        subject: `Bevestiging adoptie-aanvraag: ${catName.rows[0].name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ee6fa0;">Bedankt voor je adoptie-aanvraag!</h1>
            
            <p>Beste ${name},</p>
            
            <p>We hebben je aanvraag voor de adoptie van <strong>${catName.rows[0].name}</strong> ontvangen.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ee6fa0;">
              <h3 style="margin-top: 0;">Wat gebeurt er nu?</h3>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Wij bekijken je aanvraag zorgvuldig</li>
                <li>We nemen binnen 2-3 werkdagen contact met je op</li>
                <li>Bij een positieve reactie plannen we een kennismakingsgesprek</li>
              </ol>
            </div>
            
            <p>Je ontvangt een e-mail zodra we je aanvraag hebben beoordeeld.</p>
            
            <p style="margin-top: 30px;">
              Met vriendelijke groet,<br>
              <strong>Stichting het Wijze Weeskitten</strong>
            </p>
            
            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Referentienummer: #${newRequest.id}<br>
              Aanvraag ontvangen: ${new Date().toLocaleString('nl-NL')}
            </p>
          </div>
        `,
        text: `
Bedankt voor je adoptie-aanvraag!

Beste ${name},

We hebben je aanvraag voor de adoptie van ${catName.rows[0].name} ontvangen.

Wat gebeurt er nu?
1. Wij bekijken je aanvraag zorgvuldig
2. We nemen binnen 2-3 werkdagen contact met je op
3. Bij een positieve reactie plannen we een kennismakingsgesprek

Je ontvangt een e-mail zodra we je aanvraag hebben beoordeeld.

Met vriendelijke groet,
Stichting het Wijze Weeskitten

Referentienummer: #${newRequest.id}
        `
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating adoption request:', error);
    return NextResponse.json(
      { error: 'Failed to create adoption request' },
      { status: 500 }
    );
  }
}
