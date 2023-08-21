-- Add column location for table events
ALTER TABLE events ADD COLUMN location VARCHAR(255);
-- Populate location column with default value "Online"
UPDATE events SET location = 'Online';
