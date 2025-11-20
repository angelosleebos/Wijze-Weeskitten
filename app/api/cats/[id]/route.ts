import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET single cat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query(
      'SELECT * FROM cats WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ cat: result.rows[0] });
  } catch (error) {
    console.error('Error fetching cat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cat' },
      { status: 500 }
    );
  }
}

// PUT update cat (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, age, gender, breed, description, image_url, is_adopted } = body;
    
    const result = await pool.query(
      `UPDATE cats 
       SET name = $1, age = $2, gender = $3, breed = $4, 
           description = $5, image_url = $6, is_adopted = $7, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [name, age, gender, breed, description, image_url, is_adopted, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ cat: result.rows[0] });
  } catch (error) {
    console.error('Error updating cat:', error);
    return NextResponse.json(
      { error: 'Failed to update cat' },
      { status: 500 }
    );
  }
}

// DELETE cat (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM cats WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Cat deleted successfully' });
  } catch (error) {
    console.error('Error deleting cat:', error);
    return NextResponse.json(
      { error: 'Failed to delete cat' },
      { status: 500 }
    );
  }
}
