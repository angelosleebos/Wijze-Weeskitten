import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import createMollieClient from '@mollie/api-client';

function getMollieClient() {
  return createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY || '',
  });
}

// POST webhook for payment status updates from Mollie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body.id;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    // Get payment status from Mollie
    const mollieClient = getMollieClient();
    const payment = await mollieClient.payments.get(paymentId);

    // Update donation status in database
    await pool.query(
      `UPDATE donations 
       SET payment_status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE payment_id = $2`,
      [payment.status, paymentId]
    );

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
