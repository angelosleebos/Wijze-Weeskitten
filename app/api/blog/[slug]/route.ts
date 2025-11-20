import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE slug = $1',
      [slug]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT update blog post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verify authentication
    requireAuth(request);
    
    const { slug: paramSlug } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, image_url, published } = body;
    
    const result = await pool.query(
      `UPDATE blog_posts 
       SET title = $1, slug = $2, excerpt = $3, content = $4, 
           image_url = $5, published = $6, updated_at = CURRENT_TIMESTAMP
       WHERE slug = $7 
       RETURNING *`,
      [title, slug, excerpt, content, image_url, published, paramSlug]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verify authentication
    requireAuth(request);
    
    const { slug } = await params;
    await pool.query('DELETE FROM blog_posts WHERE slug = $1', [slug]);
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
