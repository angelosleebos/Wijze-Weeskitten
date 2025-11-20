import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET site settings
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM site_settings');
    
    // Sensitive keys that should never be exposed to public
    const SENSITIVE_KEYS = [
      'smtp_pass',
      'smtp_user', 
      'recaptcha_secret_key'
    ];
    
    const settings: Record<string, string> = {};
    result.rows.forEach(row => {
      // Filter out sensitive settings from public API
      if (!SENSITIVE_KEYS.includes(row.key)) {
        settings[row.key] = row.value;
      }
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
    // Verify authentication
    requireAuth(request);
    
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
  } catch (error: any) {
    console.error('Error updating setting:', error);
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}
