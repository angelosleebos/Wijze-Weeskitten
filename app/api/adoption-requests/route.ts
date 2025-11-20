import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

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
    } = body;

    // Validation
    if (!cat_id || !name || !email || !motivation) {
      return NextResponse.json(
        { error: 'Cat, name, email and motivation are required' },
        { status: 400 }
      );
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

    return NextResponse.json({ request: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating adoption request:', error);
    return NextResponse.json(
      { error: 'Failed to create adoption request' },
      { status: 500 }
    );
  }
}
