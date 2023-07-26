-- Change name of likes table to reactions and add value column
ALTER TABLE likes RENAME TO reactions;
ALTER TABLE reactions ADD COLUMN value INTEGER NOT NULL DEFAULT 1;