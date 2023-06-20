-- User Privacy

-- Add the "private" column to the "users" table with a default value of FALSE
ALTER TABLE users ADD COLUMN private BOOLEAN NOT NULL DEFAULT FALSE;