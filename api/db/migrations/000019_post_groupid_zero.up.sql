-- Update all posts to be group_id 0
UPDATE posts SET group_id = 0 WHERE group_id IS NULL;
