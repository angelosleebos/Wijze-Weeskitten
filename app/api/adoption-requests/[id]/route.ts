import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET single adoption request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
    
    const { id } = await params;
    const result = await pool.query(
      `SELECT ar.*, c.name as cat_name, c.image_url as cat_image, c.breed, c.age, c.gender
       FROM adoption_requests ar
       JOIN cats c ON ar.cat_id = c.id
       WHERE ar.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Adoption request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ request: result.rows[0] });
  } catch (error: any) {
    console.error('Error fetching adoption request:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch adoption request' },
      { status: 500 }
    );
  }
}

// PUT update adoption request status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
    
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;
    
    if (!status || !['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    const result = await pool.query(
      `UPDATE adoption_requests 
       SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, admin_notes, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Adoption request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ request: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating adoption request:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update adoption request' },
      { status: 500 }
    );
  }
}

// DELETE adoption request (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
    
    const { id } = await params;
    await pool.query('DELETE FROM adoption_requests WHERE id = $1', [id]);
    
    return NextResponse.json({ message: 'Adoption request deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting adoption request:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete adoption request' },
      { status: 500 }
    );
  }
}
