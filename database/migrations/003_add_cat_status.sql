-- Migration: Add status field to cats table
-- This replaces the is_adopted boolean with a more flexible status enum

-- Add status column
ALTER TABLE cats ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'available';

-- Migrate existing data
UPDATE cats SET status = CASE 
  WHEN is_adopted = TRUE THEN 'adopted'
  ELSE 'available'
END WHERE status IS NULL OR status = 'available';

-- Add check constraint
ALTER TABLE cats DROP CONSTRAINT IF EXISTS cats_status_check;
ALTER TABLE cats ADD CONSTRAINT cats_status_check 
  CHECK (status IN ('available', 'reserved', 'adopted'));

-- Optional: Keep is_adopted for backwards compatibility or drop it
-- For now we'll keep both and sync them with a trigger

CREATE OR REPLACE FUNCTION sync_cat_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_adopted = (NEW.status = 'adopted');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_cat_status_trigger ON cats;
CREATE TRIGGER sync_cat_status_trigger
  BEFORE INSERT OR UPDATE ON cats
  FOR EACH ROW
  EXECUTE FUNCTION sync_cat_status();

-- Update existing records
UPDATE cats SET is_adopted = (status = 'adopted');
