-- Rename table friends to follows and column friend_id to follow_id
ALTER TABLE friends RENAME TO follows;
ALTER TABLE follows RENAME COLUMN friend_id TO follow_id;
-- Rename notifications table column friend_id to follow_id
ALTER TABLE notifications RENAME COLUMN friend_id TO follow_id;