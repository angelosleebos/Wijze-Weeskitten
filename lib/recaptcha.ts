/**
 * reCAPTCHA v3 Verification
 * Verifies reCAPTCHA tokens server-side
 */

export async function verifyRecaptcha(token: string, secretKey: string): Promise<{ success: boolean; score?: number; error?: string }> {
  if (!secretKey || !token) {
    return { success: false, error: 'Missing reCAPTCHA configuration' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return { 
        success: false, 
        error: data['error-codes']?.join(', ') || 'Verification failed' 
      };
    }

    // reCAPTCHA v3 returns a score between 0 and 1
    // 0 = likely a bot, 1 = likely a human
    // Typically, scores above 0.5 are considered human
    return { 
      success: data.score >= 0.5, 
      score: data.score,
      error: data.score < 0.5 ? `Score too low: ${data.score}` : undefined
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Verification request failed' };
  }
}
