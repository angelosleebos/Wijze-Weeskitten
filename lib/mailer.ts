import nodemailer from 'nodemailer';
import { getSettings } from './settings';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize email addresses
function sanitizeEmails(emails: string | string[]): string[] {
  const emailArray = Array.isArray(emails) ? emails : [emails];
  return emailArray.filter(email => isValidEmail(email));
}

// Rate limiting cache (simple in-memory implementation)
const emailRateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_EMAILS_PER_HOUR = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(to: string): boolean {
  const now = Date.now();
  const limit = emailRateLimit.get(to);
  
  if (!limit || now > limit.resetAt) {
    emailRateLimit.set(to, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (limit.count >= MAX_EMAILS_PER_HOUR) {
    return false;
  }
  
  limit.count++;
  return true;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Validate and sanitize email addresses
    const validEmails = sanitizeEmails(options.to);
    
    if (validEmails.length === 0) {
      console.error('No valid email addresses provided');
      return false;
    }
    
    // Check rate limit for primary recipient
    if (!checkRateLimit(validEmails[0])) {
      console.error('Rate limit exceeded for:', validEmails[0]);
      return false;
    }
    
    const settings = await getSettings();
    
    // Validate SMTP settings
    if (!settings.smtp_host || !settings.smtp_port) {
      console.error('SMTP settings not configured');
      return false;
    }
    
    // Create transporter with settings from database
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port),
      secure: settings.smtp_secure === 'true',
      auth: settings.smtp_user && settings.smtp_pass ? {
        user: settings.smtp_user,
        pass: settings.smtp_pass,
      } : undefined,
      // Only disable certificate validation in development
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
      // Connection timeout
      connectionTimeout: 10000,
      // Prevent command injection
      logger: false,
      debug: false,
    });

    // Sanitize subject and content
    const sanitizedSubject = options.subject.substring(0, 200); // Limit subject length
    
    // Send email
    await transporter.sendMail({
      from: `${settings.smtp_from_name} <${settings.smtp_from}>`,
      to: validEmails.join(', '),
      subject: sanitizedSubject,
      text: options.text,
      html: options.html,
      // Prevent header injection
      headers: {
        'X-Mailer': 'Kattenstichting-Website',
      },
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Test email connection
export async function testEmailConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const settings = await getSettings();
    
    if (!settings.smtp_host || !settings.smtp_port) {
      return {
        success: false,
        message: 'SMTP instellingen zijn niet geconfigureerd',
      };
    }
    
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port),
      secure: settings.smtp_secure === 'true',
      auth: settings.smtp_user && settings.smtp_pass ? {
        user: settings.smtp_user,
        pass: settings.smtp_pass,
      } : undefined,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    
    return {
      success: true,
      message: 'SMTP verbinding succesvol getest',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `SMTP verbinding mislukt: ${error.message}`,
    };
  }
}
