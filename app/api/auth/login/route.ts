import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { generateCsrfToken } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Rate limiting: 5 attempts per minute per username
    const rateLimitResult = checkRateLimit(`login:${username}`, {
      maxAttempts: 5,
      windowMs: 60000, // 1 minute
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Te veel login pogingen. Probeer het over een minuut opnieuw.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Find admin user
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const admin = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password_hash);

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate CSRF token
    const csrfToken = generateCsrfToken(admin.id);

    return NextResponse.json({
      token,
      csrfToken,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    }, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
