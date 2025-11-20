import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET site settings
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM site_settings');
    
    const settings: Record<string, string> = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT update setting (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;
    
    const result = await pool.query(
      `INSERT INTO site_settings (key, value) 
       VALUES ($1, $2) 
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [key, value]
    );
    
    return NextResponse.json({ setting: result.rows[0] });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}
