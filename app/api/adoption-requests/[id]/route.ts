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
    
    // Start a transaction to update both the request and the cat status
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update the adoption request
      const result = await client.query(
        `UPDATE adoption_requests 
         SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status, admin_notes, id]
      );
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Adoption request not found' },
          { status: 404 }
        );
      }
      
      const adoptionRequest = result.rows[0];
      
      // If status is approved or completed, mark the cat as adopted
      if (status === 'approved' || status === 'completed') {
        await client.query(
          `UPDATE cats 
           SET status = 'adopted'
           WHERE id = $1`,
          [adoptionRequest.cat_id]
        );
      }
      // If status is rejected, mark the cat as available again
      else if (status === 'rejected') {
        await client.query(
          `UPDATE cats 
           SET status = 'available'
           WHERE id = $1`,
          [adoptionRequest.cat_id]
        );
      }
      
      await client.query('COMMIT');
      
      return NextResponse.json({ request: adoptionRequest });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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
