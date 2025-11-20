import pool from './db';

export interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  donation_goal: string;
  hero_title: string;
  hero_subtitle: string;
  donation_account: string;
  primary_color: string;
  hero_image: string;
  smtp_host: string;
  smtp_port: string;
  smtp_secure: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
  smtp_from_name: string;
  recaptcha_site_key: string;
  recaptcha_secret_key: string;
  google_analytics_id: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'Stichting het Wijze Weeskitten',
  site_description: 'Onvoorwaardelijke hulp aan katten in noodsituaties',
  contact_email: 'info@wijzeweeskitten.nl',
  donation_goal: '5000',
  hero_title: 'Stichting het Wijze Weeskitten',
  hero_subtitle: 'Onvoorwaardelijke hulp aan katten in noodsituaties',
  donation_account: '',
  primary_color: '#ee6fa0',
  hero_image: '/images/hero-cats.jpg',
  smtp_host: process.env.SMTP_HOST || 'localhost',
  smtp_port: process.env.SMTP_PORT || '1025',
  smtp_secure: process.env.SMTP_SECURE || 'false',
  smtp_user: process.env.SMTP_USER || '',
  smtp_pass: process.env.SMTP_PASS || '',
  smtp_from: process.env.SMTP_FROM || 'noreply@wijzeweeskitten.nl',
  smtp_from_name: 'Stichting het Wijze Weeskitten',
  recaptcha_site_key: process.env.RECAPTCHA_SITE_KEY || '',
  recaptcha_secret_key: process.env.RECAPTCHA_SECRET_KEY || '',
  google_analytics_id: process.env.GOOGLE_ANALYTICS_ID || '',
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const result = await pool.query('SELECT * FROM site_settings');
    
    const settings: Record<string, string> = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    
    // Merge with defaults
    return {
      ...defaultSettings,
      ...settings,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return defaultSettings;
  }
}
