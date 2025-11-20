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
