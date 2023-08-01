-- Add column type to table notifications
ALTER TABLE notifications ADD COLUMN type TEXT NOT NULL DEFAULT 'info';