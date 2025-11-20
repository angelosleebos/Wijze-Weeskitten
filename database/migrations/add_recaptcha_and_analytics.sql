-- Migration: Add reCAPTCHA and Google Analytics settings
-- Date: 2024
-- Description: Adds configuration fields for reCAPTCHA v3 spam protection and Google Analytics 4 tracking

-- Add reCAPTCHA settings if they don't exist
INSERT INTO site_settings (key, value) 
VALUES ('recaptcha_site_key', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value) 
VALUES ('recaptcha_secret_key', '')
ON CONFLICT (key) DO NOTHING;

-- Add Google Analytics setting if it doesn't exist
INSERT INTO site_settings (key, value) 
VALUES ('google_analytics_id', '')
ON CONFLICT (key) DO NOTHING;

-- Verify migration
SELECT key, value FROM site_settings WHERE key IN ('recaptcha_site_key', 'recaptcha_secret_key', 'google_analytics_id');
