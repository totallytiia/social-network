-- Insert dummy data

-- Users
INSERT INTO users (nickname, email, fname, lname, password, dob, about, avatar, private)
VALUES ('October', 'admin@admin.ax', 'Viktor', 'Thörnroos', '$2a$10$nwEXONEp1LoFAHB9wLrDLO/OhFXhAJyDe6Jj34pwtEuDSqNh27WnK', '27-10-2003', '#Admin and not you', '', 'FALSE');
INSERT INTO users (nickname, email, fname, lname, password, dob, about, avatar, private)
VALUES ('tiial', 'tiial@gmail.com', 'Tiia', 'Laukkanen', '$2a$11$2yn9ebZtDelyd37.a6VYoeXjjiaJhClGcfPsYZfm4tSEwZgFoCP5y', '01-01-2005', 'Levi tiny borker', '', 'FALSE');
INSERT INTO users (nickname, email, fname, lname, password, dob, about, avatar, private)
VALUES ('wegenfelt', 'wegwnfelt@gmail.com', 'William', 'Egenfelt', '$2a$10$nwEXONEp1LoFAHB9wLrDLO/OhFXhAJyDe6Jj34pwtEuDSqNh27WnK', '03-03-2003', 'RTF best project ever', '', 'FALSE');
INSERT INTO users (nickname, email, fname, lname, password, dob, about, avatar, private)
VALUES ('johndoe', 'johndoe@example.com', 'John', 'Doe', '$2a$10$nwEXONEp1LoFAHB9wLrDLO/OhFXhAJyDe6Jj34pwtEuDSqNh27WnK', '01-01-1990', 'Just a regular guy', '', 'TRUE');
INSERT INTO users (nickname, email, fname, lname, password, dob, about, avatar, private)
VALUES ('janedoe', 'janedoe@example.com', 'Jane', 'Doe', '$2a$10$nwEXONEp1LoFAHB9wLrDLO/OhFXhAJyDe6Jj34pwtEuDSqNh27WnK', '01-01-1995', 'Just a regular girl', '', 'FALSE');
INSERT INTO users (nickname, email, fname, lname, password, dob, about, avatar, private)
VALUES ('bobsmith', 'bobsmith@example.com', 'Bob', 'Smith', '$2a$10$nwEXONEp1LoFAHB9wLrDLO/OhFXhAJyDe6Jj34pwtEuDSqNh27WnK', '01-01-1985', 'Just another regular guy', '', 'TRUE');

-- Posts
INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (0, 'Hello world!', 'This is my first post!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (2, 'My favorite book', 'I just finished reading my favorite book and it was amazing!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (4, 'My new hobby', 'I started a new hobby and I am really enjoying it!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (1, 'My travel bucket list', 'I have always wanted to travel to these places on my bucket list!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (0, 'My favorite recipe', 'I made this recipe for dinner last night and it was delicious!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (3, 'My workout routine', 'I have been following this workout routine for a few weeks and I am already seeing results!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (2, 'My favorite book', 'I just finished reading my favorite book and it was amazing! The characters were so well-developed and the plot was so engaging. I couldnt put it down! I highly recommend it to anyone looking for a great read.', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (4, 'My new hobby', 'I started a new hobby recently and it has been so much fun! Ive always been interested in woodworking, so I decided to try my hand at making a coffee table. It was a lot of work, but the end result was so rewarding. I cant wait to start my next project!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (1, 'My travel bucket list', 'I love to travel and I have a long list of places I want to visit. Some of the top destinations on my list include Japan, New Zealand, and Iceland. Ive always been fascinated by Japanese culture and I would love to experience it firsthand. New Zealand and Iceland are both known for their stunning natural beauty, and I would love to explore their landscapes and take in the scenery.', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (0, 'My favorite recipe', 'I love to cook and I have a lot of favorite recipes, but one of my all-time favorites is my grandmothers lasagna recipe. Its a family recipe that has been passed down for generations, and its always a hit at family gatherings. The secret is in the sauce - its made with a blend of ground beef, Italian sausage, and a variety of spices. It takes a bit of time to prepare, but its definitely worth it!', '', '0', '');

INSERT INTO posts (user_id, title, content, image, privacy, privacy_settings)
VALUES (3, 'My workout routine', 'Ive been working out consistently for the past few months and Ive already seen some great results. My routine consists of a mix of weightlifting and cardio, and I try to switch things up every few weeks to keep things interesting. I also make sure to eat a balanced diet and get plenty of rest. It takes a lot of discipline, but its definitely worth it!', '', '0', '');