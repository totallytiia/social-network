-- Undo renaming of the follows table and its columns
ALTER TABLE follows RENAME COLUMN follow_id TO friend_id;
ALTER TABLE follows RENAME TO friends;
-- Undo notifications table follow_id column
ALTER TABLE notifications RENAME COLUMN follow_id TO friend_id;