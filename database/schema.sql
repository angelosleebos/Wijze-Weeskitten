-- Database schema voor Kattenstichting website

-- Table: admins (voor CMS toegang)
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: cats (katten die onderdak zoeken)
CREATE TABLE cats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  breed VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  is_adopted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: blog_posts (blogs om aandacht te trekken)
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  author_id INTEGER REFERENCES admins(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: volunteers (vrijwilligers voor contact pagina)
CREATE TABLE volunteers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  bio TEXT,
  image_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: donations (donaties via iDEAL)
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  payment_id VARCHAR(255) UNIQUE,
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: site_settings (voor CMS configuratie)
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes voor betere performance
CREATE INDEX idx_cats_is_adopted ON cats(is_adopted);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_donations_payment_status ON donations(payment_status);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES 
  ('site_name', 'Stichting het Wijze Weeskitten'),
  ('site_description', 'Onvoorwaardelijke hulp aan katten in noodsituaties'),
  ('contact_email', 'info@wijzeweeskitten.nl'),
  ('donation_goal', '5000'),
  ('hero_title', 'Stichting het Wijze Weeskitten'),
  ('hero_subtitle', 'Onvoorwaardelijke hulp aan katten in noodsituaties'),
  ('donation_account', 'NL10 INGB 0005 9680 56');
