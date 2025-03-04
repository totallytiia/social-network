package structs

import (
	"fmt"
	db "social_network_api/db"
	"time"
)

type Notification struct {
	ID         int         `json:"id"`
	UserID     int         `json:"user_id"`
	UserFName  string      `json:"fname"`
	UserLName  string      `json:"lname"`
	FollowerID int         `json:"follower_id"`
	GroupID    interface{} `json:"group_id,omitempty"`
	Message    string      `json:"message"`
	Type       string      `json:"type"`
	Seen       bool        `json:"seen"`
	CreatedAt  string      `json:"created_at"`
	UpdatedAt  string      `json:"updated_at"`
}

type Notifications []Notification

func (u *User) GetNotifications() (Notifications, error) {
	var notifications Notifications
	rows, err := db.DB.Query("SELECT n.*, u.fname, u.lname FROM notifications n INNER JOIN users u ON u.id = n.follow_id WHERE user_id = ? ORDER BY n.id DESC", u.ID)
	if err != nil {
		fmt.Println(err)
		return notifications, err
	}
	defer rows.Close()
	for rows.Next() {
		var n Notification
		err := rows.Scan(&n.ID, &n.UserID, &n.FollowerID, &n.Message, &n.CreatedAt, &n.UpdatedAt, &n.Type, &n.Seen, &n.GroupID, &n.UserFName, &n.UserLName)
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

func (u *User) AddNotification(followerID int, nType, message string, groupID interface{}) error {
	_, err := db.DB.Exec("INSERT INTO notifications (user_id, follow_id, message, type, group_id) VALUES (?, ?, ?, ?, ?)", u.ID, followerID, message, nType, groupID)
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

func (u *User) MarkNotificationsSeen() error {
	_, err := db.DB.Exec("UPDATE notifications SET seen = 1 WHERE user_id = ?", u.ID)
	if err != nil {
		return err
	}
	return nil
}

func FindNotification(user, follower int, notiType string) (Notification, error) {
	var notification Notification
	err := db.DB.QueryRow("SELECT * FROM notifications WHERE user_id = ? AND follow_id = ? AND type = ?", user, follower, notiType).Scan(&notification.ID, &notification.UserID, &notification.FollowerID, &notification.Message, &notification.CreatedAt, &notification.UpdatedAt, &notification.Type, &notification.Seen, &notification.GroupID)
	if err != nil {
		fmt.Println(err)
		return notification, err
	}
	return notification, nil
}

func (n *Notification) ChangeType(newType string) error {
	_, err := db.DB.Exec("UPDATE notifications SET type = ? WHERE id = ?", newType, n.ID)
	if err != nil {
		return err
	}
	return nil
}
