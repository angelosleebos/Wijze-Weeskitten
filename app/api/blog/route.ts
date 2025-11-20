import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showUnpublished = searchParams.get('unpublished') === 'true';
    
    const query = showUnpublished
      ? 'SELECT * FROM blog_posts ORDER BY created_at DESC'
      : 'SELECT * FROM blog_posts WHERE published = TRUE ORDER BY created_at DESC';
    
    const result = await pool.query(query);
    
    return NextResponse.json({ posts: result.rows });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    requireAuth(request);
    
    const body = await request.json();
    const { title, slug, excerpt, content, image_url, author_id, published } = body;
    
    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author_id, published) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, slug, excerpt, content, image_url, author_id, published]
    );
    
    return NextResponse.json({ post: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
