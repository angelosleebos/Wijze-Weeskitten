import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET all site settings including sensitive ones (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    requireAuth(request);
    
    const result = await pool.query('SELECT * FROM site_settings');
    
    const settings: Record<string, string> = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error fetching admin settings:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
