package structs

import (
	"fmt"
	db "social_network_api/db"
	"time"
)

type Notification struct {
	ID         int    `json:"id"`
	UserID     int    `json:"user_id"`
	FollowerID int    `json:"follower_id"`
	Message    string `json:"message"`
	Type       string `json:"type"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

type Notifications []Notification

func (u *User) GetNotifications() (Notifications, error) {
	var notifications Notifications
	rows, err := db.DB.Query("SELECT * FROM notifications WHERE user_id = ?", u.ID)
	if err != nil {
		fmt.Println(err)
		return notifications, err
	}
	defer rows.Close()
	for rows.Next() {
		var n Notification
		err := rows.Scan(&n.ID, &n.UserID, &n.FollowerID, &n.Message, &n.CreatedAt, &n.UpdatedAt, &n.Type)
		if err != nil {
			fmt.Println(err)
			return notifications, err
		}
		createdAt, err := time.Parse(time.RFC3339, n.CreatedAt)
		if err != nil {
			fmt.Println(err)
			return notifications, err
		}
		if time.Since(createdAt).Hours() > 24*7 {
			DeleteNotification(n.ID)
			if err != nil {
				fmt.Println(err)
				return notifications, err
			}
		}
		if err != nil {
			fmt.Println(err)
			return notifications, err
		}
		notifications = append(notifications, n)
	}
	return notifications, nil
}

func (u *User) AddNotification(followerID int, nType, message string) error {
	_, err := db.DB.Exec("INSERT INTO notifications (user_id, follow_id, message, type) VALUES (?, ?, ?, ?)", u.ID, followerID, message, nType)
	if err != nil {
		return err
	}
	return nil
}

func DeleteNotification(id int) error {
	_, err := db.DB.Exec("DELETE FROM notifications WHERE id = ?", id)
	if err != nil {
		return err
	}
	return nil
}
