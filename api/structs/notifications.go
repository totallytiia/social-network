package structs

import (
	db "social_network_api/db"
	"time"
)

type Notification struct {
	ID         int    `json:"id"`
	UserID     int    `json:"user_id"`
	FollowerID int    `json:"follower_id"`
	Message    string `json:"message"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

type Notifications []Notification

func (u *User) GetNotifications() (Notifications, error) {
	var notifications Notifications
	rows, err := db.DB.Query("SELECT * FROM notifications WHERE user_id = ?", u.ID)
	if err != nil {
		return notifications, err
	}
	defer rows.Close()
	for rows.Next() {
		var n Notification
		err := rows.Scan(&n.ID, &n.UserID, &n.FollowerID, &n.Message, &n.CreatedAt, &n.UpdatedAt)
		if err != nil {
			return notifications, err
		}
		createdAt, err := time.Parse(time.RFC3339, n.CreatedAt)
		if err != nil {
			return notifications, err
		}
		if time.Since(createdAt).Hours() > 24*7 {
			_, err := db.DB.Exec("DELETE FROM notifications WHERE id = ?", n.ID)
			if err != nil {
				return notifications, err
			}
		}
		if err != nil {
			return notifications, err
		}
		notifications = append(notifications, n)
	}
	return notifications, nil
}
