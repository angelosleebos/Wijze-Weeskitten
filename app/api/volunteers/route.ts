import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET all volunteers
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM volunteers ORDER BY display_order ASC, name ASC'
    );
    
    return NextResponse.json({ volunteers: result.rows });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}

// POST new volunteer (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    requireAuth(request);
    
    const body = await request.json();
    const { name, role, email, phone, bio, image_url, display_order } = body;
    
    const result = await pool.query(
      `INSERT INTO volunteers (name, role, email, phone, bio, image_url, display_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, role, email, phone, bio, image_url, display_order || 0]
    );
    
    return NextResponse.json({ volunteer: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating volunteer:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create volunteer' },
      { status: 500 }
    );
  }
}
