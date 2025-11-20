import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { sendEmail, testEmailConnection } from '@/lib/mailer';

// POST test email (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    requireAuth(request);
    
    const body = await request.json();
    const { action, to } = body;
    
    if (action === 'test-connection') {
      const result = await testEmailConnection();
      return NextResponse.json(result);
    }
    
    if (action === 'send-test') {
      if (!to) {
        return NextResponse.json(
          { error: 'E-mail adres is verplicht' },
          { status: 400 }
        );
      }
      
      const success = await sendEmail({
        to,
        subject: 'Test E-mail - Kattenstichting',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ee6fa0;">Test E-mail</h1>
            <p>Dit is een test e-mail van de Kattenstichting website.</p>
            <p>Als je deze e-mail ontvangt, werkt de SMTP configuratie correct!</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Verzonden op: ${new Date().toLocaleString('nl-NL')}
            </p>
          </div>
        `,
        text: 'Dit is een test e-mail van de Kattenstichting website. Als je deze e-mail ontvangt, werkt de SMTP configuratie correct!',
      });
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Test e-mail succesvol verzonden',
        });
      } else {
        return NextResponse.json(
          { error: 'Fout bij verzenden test e-mail' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Ongeldige actie' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in email test:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to test email' },
      { status: 500 }
    );
  }
}
