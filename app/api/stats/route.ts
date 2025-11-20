import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET dashboard statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    requireAuth(request);

    // Get cat statistics
    const catsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
        COUNT(CASE WHEN status = 'reserved' THEN 1 END) as reserved,
        COUNT(CASE WHEN status = 'adopted' THEN 1 END) as adopted
      FROM cats
    `);

    // Get blog statistics
    const blogResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN published = true THEN 1 END) as published,
        COUNT(CASE WHEN published = false THEN 1 END) as drafts
      FROM blog_posts
    `);

    // Get donation statistics
    const donationsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(amount) as total_amount,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as successful,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
      FROM donations
    `);

    // Get recent activity (last 5 activities)
    const recentCatsResult = await pool.query(`
      SELECT 'cat' as type, name as title, created_at as date
      FROM cats
      ORDER BY created_at DESC
      LIMIT 3
    `);

    const recentBlogsResult = await pool.query(`
      SELECT 'blog' as type, title, created_at as date
      FROM blog_posts
      ORDER BY created_at DESC
      LIMIT 3
    `);

    const recentDonationsResult = await pool.query(`
      SELECT 'donation' as type, 
             CONCAT('€', amount::text, ' - ', donor_name) as title,
             created_at as date
      FROM donations
      WHERE status = 'paid'
      ORDER BY created_at DESC
      LIMIT 3
    `);

    // Combine and sort recent activities
    const recentActivity = [
      ...recentCatsResult.rows,
      ...recentBlogsResult.rows,
      ...recentDonationsResult.rows
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        cats: catsResult.rows[0],
        blog: blogResult.rows[0],
        donations: {
          ...donationsResult.rows[0],
          total_amount: parseFloat(donationsResult.rows[0].total_amount || 0)
        }
      },
      recentActivity
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
