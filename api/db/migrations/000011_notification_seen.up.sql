-- Add column seen to notifications table
ALTER TABLE notifications ADD seen BOOLEAN NOT NULL DEFAULT FALSE;