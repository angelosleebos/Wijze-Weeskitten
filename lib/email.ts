import { Resend } from 'resend';

// Lazy-initialize Resend to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export interface DonationEmailData {
  donorName: string;
  donorEmail: string;
  amount: number;
  donationId: string;
  date: Date;
}

export async function sendDonationConfirmation(data: DonationEmailData) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend not configured, skipping email');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const { donorName, donorEmail, amount, donationId, date } = data;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ee6fa0; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #eeeeee; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #ee6fa0; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .amount { font-size: 32px; font-weight: bold; color: #ee6fa0; margin: 20px 0; }
            .details { background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐱 Bedankt voor je donatie!</h1>
            </div>
            <div class="content">
              <p>Beste ${donorName},</p>
              
              <p>Hartelijk dank voor je genereuze donatie aan Stichting het Wijze Weeskitten!</p>
              
              <div class="amount">€${amount.toFixed(2)}</div>
              
              <p>Jouw bijdrage helpt ons om zwerfkatten en weeskatten op te vangen, te verzorgen en een nieuw thuis te vinden. Zonder de steun van mensen zoals jij zouden we dit belangrijke werk niet kunnen doen.</p>
              
              <div class="details">
                <strong>Donatie details:</strong><br>
                Donatie ID: ${donationId}<br>
                Datum: ${date.toLocaleDateString('nl-NL', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}<br>
                Bedrag: €${amount.toFixed(2)}
              </div>
              
              <p>Je kunt deze e-mail bewaren als bevestiging van je donatie.</p>
              
              <p>Namens alle katten die we helpen: <strong>dank je wel!</strong> 💕</p>
              
              <a href="https://kattenstichting.nl" class="button">Bezoek onze website</a>
              
              <p>Met vriendelijke groet,<br>
              Het team van Stichting het Wijze Weeskitten</p>
            </div>
            <div class="footer">
              <p>Stichting het Wijze Weeskitten<br>
              Contact: info@kattenstichting.nl<br>
              © ${new Date().getFullYear()} Stichting het Wijze Weeskitten</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Kattenstichting <noreply@kattenstichting.nl>',
      to: donorEmail,
      subject: `Bedankt voor je donatie van €${amount.toFixed(2)}!`,
      html: emailHtml,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending donation confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend not configured, skipping email');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ee6fa0; color: white; padding: 20px; text-align: center; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #eeeeee; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nieuw contactformulier bericht</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Van:</div>
                <div>${data.name} (${data.email})</div>
              </div>
              <div class="field">
                <div class="label">Onderwerp:</div>
                <div>${data.subject}</div>
              </div>
              <div class="field">
                <div class="label">Bericht:</div>
                <div>${data.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Kattenstichting <noreply@kattenstichting.nl>',
      to: process.env.CONTACT_EMAIL || 'info@kattenstichting.nl',
      replyTo: data.email,
      subject: `Contact: ${data.subject}`,
      html: emailHtml,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, error };
  }
}
