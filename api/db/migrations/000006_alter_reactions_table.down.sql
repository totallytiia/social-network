-- Remove value column from reactions table and change name back to likes
ALTER TABLE reactions DROP COLUMN value;
ALTER TABLE reactions RENAME TO likes;