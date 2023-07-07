--Add privacy fields to table posts
ALTER TABLE posts ADD COLUMN privacy INTEGER NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN privacy_settings TEXT;
