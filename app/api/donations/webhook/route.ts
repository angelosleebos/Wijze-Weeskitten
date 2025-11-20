import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import createMollieClient from '@mollie/api-client';
import { sendDonationConfirmation } from '@/lib/email';

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

    // Verify the webhook is from Mollie by fetching payment status
    // Mollie recommends fetching payment details rather than trusting webhook data
    const mollieClient = getMollieClient();
    
    let payment;
    try {
      payment = await mollieClient.payments.get(paymentId);
    } catch (error) {
      console.error('Invalid payment ID from webhook:', error);
      return NextResponse.json(
        { error: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    // Update donation status in database
    const updateResult = await pool.query(
      `UPDATE donations 
       SET payment_status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE payment_id = $2
       RETURNING *`,
      [payment.status, paymentId]
    );

    // Send confirmation email if payment is successful
    if (payment.status === 'paid' && updateResult.rows.length > 0) {
      const donation = updateResult.rows[0];
      
      // Only send email if RESEND_API_KEY is configured
      if (process.env.RESEND_API_KEY) {
        await sendDonationConfirmation({
          donorName: donation.donor_name,
          donorEmail: donation.donor_email,
          amount: parseFloat(donation.amount),
          donationId: donation.payment_id,
          date: new Date(donation.created_at),
        });
      } else {
        console.warn('RESEND_API_KEY not configured, skipping email notification');
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
