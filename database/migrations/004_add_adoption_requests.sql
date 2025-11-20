-- Migration: Add adoption requests table
-- This allows visitors to submit adoption requests for cats

CREATE TABLE IF NOT EXISTS adoption_requests (
  id SERIAL PRIMARY KEY,
  cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
  
  -- Applicant information
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  
  -- Household information
  household_type VARCHAR(50), -- e.g., 'apartment', 'house', 'farm'
  has_garden BOOLEAN DEFAULT FALSE,
  has_other_pets BOOLEAN DEFAULT FALSE,
  other_pets_description TEXT,
  has_children BOOLEAN DEFAULT FALSE,
  children_ages TEXT,
  
  -- Experience and motivation
  cat_experience TEXT,
  motivation TEXT NOT NULL,
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_adoption_requests_status ON adoption_requests(status);
CREATE INDEX IF NOT EXISTS idx_adoption_requests_cat_id ON adoption_requests(cat_id);
CREATE INDEX IF NOT EXISTS idx_adoption_requests_created_at ON adoption_requests(created_at DESC);
