-- Change boolean to tiny int on users table column private
ALTER TABLE users RENAME TO users_old;
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  nickname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  fname TEXT NOT NULL,
  lname TEXT NOT NULL,
  password TEXT NOT NULL,
  dob DATE NOT NULL,
  about TEXT NOT NULL,
  avatar BLOB NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  private TINYINT NOT NULL
);
INSERT INTO users SELECT * FROM users_old;
DROP TABLE users_old;