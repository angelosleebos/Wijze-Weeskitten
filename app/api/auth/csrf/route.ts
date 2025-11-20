import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateCsrfToken } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const csrfToken = generateCsrfToken(user.id);

    return NextResponse.json({ csrfToken });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
