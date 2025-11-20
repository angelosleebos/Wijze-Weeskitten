import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all cats (not adopted)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAdopted = searchParams.get('adopted') === 'true';
    
    const query = showAdopted 
      ? 'SELECT * FROM cats ORDER BY created_at DESC'
      : 'SELECT * FROM cats WHERE is_adopted = FALSE ORDER BY created_at DESC';
    
    const result = await pool.query(query);
    
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
    const body = await request.json();
    const { name, age, gender, breed, description, image_url } = body;
    
    const result = await pool.query(
      `INSERT INTO cats (name, age, gender, breed, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, age, gender, breed, description, image_url]
    );
    
    return NextResponse.json({ cat: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating cat:', error);
    return NextResponse.json(
      { error: 'Failed to create cat' },
      { status: 500 }
    );
  }
}
