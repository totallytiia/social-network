--Create the events table
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL,
  start_date_time TEXT NOT NULL,
  end_date_time text NOT NULL,
  description TEXT NOT NULL,
  location text NOT NULL,
  event_users text DEFAULT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--Create the event_users table
CREATE TABLE IF NOT EXISTS event_users (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  going INTEGER DEFAULT 0,
  notgoing INTEGER DEFAULT 0,
  status text NOT NULL
);