--Remove privacy field from table posts
ALTER TABLE posts DROP COLUMN privacy;
ALTER TABLE posts DROP COLUMN privacy_settings;