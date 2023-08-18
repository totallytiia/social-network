-- Update all posts to have group_id null
UPDATE posts SET group_id = NULL WHERE group_id = 0;