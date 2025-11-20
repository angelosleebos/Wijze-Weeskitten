-- Add SMTP settings to existing site_settings table
INSERT INTO site_settings (key, value) VALUES 
  ('smtp_host', 'mailhog'),
  ('smtp_port', '1025'),
  ('smtp_secure', 'false'),
  ('smtp_user', ''),
  ('smtp_pass', ''),
  ('smtp_from', 'noreply@wijzeweeskitten.nl'),
  ('smtp_from_name', 'Stichting het Wijze Weeskitten')
ON CONFLICT (key) DO NOTHING;
