-- Add column group_id to table notifications
ALTER TABLE notifications ADD COLUMN group_id INTEGER REFERENCES groups(id);