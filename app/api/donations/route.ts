import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import createMollieClient, { PaymentMethod } from '@mollie/api-client';

function getMollieClient() {
  return createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY || '',
  });
}

// POST create donation and payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donor_name, donor_email, amount, message } = body;

    // Create donation record
    const donationResult = await pool.query(
      `INSERT INTO donations (donor_name, donor_email, amount, message, payment_status) 
       VALUES ($1, $2, $3, $4, 'pending') 
       RETURNING *`,
      [donor_name, donor_email, amount, message]
    );

    const donation = donationResult.rows[0];

    // Create Mollie payment
    const mollieClient = getMollieClient();
    
    // Configureer payment options
    const paymentData: any = {
      amount: {
        currency: 'EUR',
        value: parseFloat(amount).toFixed(2),
      },
      description: `Donatie aan Kattenstichting`,
      redirectUrl: `${process.env.NEXT_PUBLIC_API_URL}/donatie/bedankt?donation_id=${donation.id}`,
      metadata: {
        donation_id: donation.id.toString(),
      },
      method: PaymentMethod.ideal,
    };
    
    // Alleen webhook toevoegen als het een publiek bereikbare URL is (productie)
    if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
      paymentData.webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/donations/webhook`;
    }
    
    const payment = await mollieClient.payments.create(paymentData);

    // Update donation with payment ID
    await pool.query(
      'UPDATE donations SET payment_id = $1 WHERE id = $2',
      [payment.id, donation.id]
    );

    return NextResponse.json({
      donation_id: donation.id,
      checkout_url: payment.getCheckoutUrl(),
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}

// GET all donations (admin only)
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM donations ORDER BY created_at DESC'
    );
    
    return NextResponse.json({ donations: result.rows });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
