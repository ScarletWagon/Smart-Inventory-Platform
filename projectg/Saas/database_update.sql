-- Add discontinued column to product table
ALTER TABLE product ADD COLUMN IF NOT EXISTS discontinued BOOLEAN DEFAULT FALSE;

-- Update all existing products to be active (not discontinued)
UPDATE product SET discontinued = FALSE WHERE discontinued IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'product' AND column_name = 'discontinued';
