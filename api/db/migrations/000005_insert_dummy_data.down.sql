-- Delete inserted data

-- Users
DELETE FROM users WHERE nickname = 'October';
DELETE FROM users WHERE nickname = 'tiial';
DELETE FROM users WHERE nickname = 'wegenfelt';
DELETE FROM users WHERE nickname = 'johndoe';
DELETE FROM users WHERE nickname = 'janedoe';
DELETE FROM users WHERE nickname = 'bobsmith';

-- Posts
DELETE FROM posts WHERE title = 'Hello world!';
DELETE FROM posts WHERE title = 'My favorite book';
DELETE FROM posts WHERE title = 'My new hobby';
DELETE FROM posts WHERE title = 'My travel bucket list';
DELETE FROM posts WHERE title = 'My favorite recipe';
DELETE FROM posts WHERE title = 'My workout routine';