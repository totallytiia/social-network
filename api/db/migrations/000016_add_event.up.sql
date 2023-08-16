--Create the events table
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL,
  event_name TEXT NOT NULL,
  event_description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);