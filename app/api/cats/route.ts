import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET all cats (not adopted)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAdopted = searchParams.get('adopted') === 'true';
    
    const query = showAdopted 
      ? 'SELECT * FROM cats ORDER BY created_at DESC'
      : 'SELECT * FROM cats WHERE status != $1 ORDER BY created_at DESC';
    
    const params = showAdopted ? [] : ['adopted'];
    const result = await pool.query(query, params);
    
    return NextResponse.json({ cats: result.rows });
  } catch (error) {
    console.error('Error fetching cats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cats' },
      { status: 500 }
    );
  }
}

// POST new cat (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    requireAuth(request);
    
    const body = await request.json();
    const { name, age, gender, breed, description, image_url, status = 'available' } = body;
    
    const result = await pool.query(
      `INSERT INTO cats (name, age, gender, breed, description, image_url, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, age, gender, breed, description, image_url, status]
    );
    
    return NextResponse.json({ cat: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cat:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create cat' },
      { status: 500 }
    );
  }
}
