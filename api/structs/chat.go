package structs

import (
	"errors"
	"regexp"
	db "social_network_api/db"
)

type Chat struct {
	ID         int    `json:"id"`
	UserID     int    `json:"user_id"`
	ReceiverID int    `json:"receiver_id"`
	GroupID    int    `json:"group_id"`
	Message    string `json:"message"`
	Image      string `json:"image"`
	SentAt     string `json:"sent_at"`
}

type NewChat struct {
	UserID     int    `json:"user_id"`
	ReceiverID int    `json:"receiver_id"`
	GroupID    int    `json:"group_id"`
	Message    string `json:"message"`
	Image      string `json:"image"`
}

func (c *NewChat) Validate() error {
	if c.Message == "" {
		return errors.New("chat message cannot be empty")
	}
	if len(c.Message) > 500 {
		return errors.New("chat message cannot be longer than 1000 characters")
	}
	var imageRegEx = regexp.MustCompile(`^data:image\/(png|jpg|jpeg);base64,([a-zA-Z0-9+/=]+)$`)
	if !imageRegEx.MatchString(c.Image) && c.Image != "" {
		return errors.New("invalid image")
	}
	return nil
}

func (c *NewChat) Create() (int, error) {
	var res, err = db.DB.Exec("INSERT INTO chat (user_id, receiver_id, group_id, message, image) VALUES (?, ?, ?, ?, ?)", c.UserID, c.ReceiverID, c.GroupID, c.Message, c.Image)
	if err != nil {
		return 0, err
	}
	var id, _ = res.LastInsertId()
	return int(id), nil
}

func (c *Chat) Get() error {
	var err = db.DB.QueryRow("SELECT c.id, c.user_id, c.receiver_id, c.group_id, c.message, c.image, c.sent_at FROM chat c WHERE c.id = ?", c.ID).Scan(&c.ID, &c.UserID, &c.ReceiverID, &c.GroupID, &c.Message, &c.Image, &c.SentAt)
	if err != nil {
		return err
	}
	return nil
}

func GetChats(userID, receiverID int) ([]Chat, error) {
	//sqlite query to get chats between a sender and receiver, or a sender and a group
	var rows, err = db.DB.Query(`
	SELECT c.id, c.user_id, c.receiver_id, c.group_id, c.message, c.image, c.sent_at
	FROM chat c
	WHERE (c.user_id = ? AND c.receiver_id = ?) OR (c.user_id = ? AND c.group_id = ?)`, userID, receiverID, receiverID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var chats []Chat
	for rows.Next() {
		var chat Chat
		err = rows.Scan(&chat.ID, &chat.UserID, &chat.ReceiverID, &chat.GroupID, &chat.Message, &chat.Image, &chat.SentAt)
		if err != nil {
			return nil, err
		}
		chats = append(chats, chat)
	}
	return chats, nil
}

func GetLastChats(userId int) ([]Chat, error) {
	//sqlite query to get last chats between a user and all other users and groups
	var rows, err = db.DB.Query(`
	SELECT c.id, c.user_id, c.receiver_id, c.group_id, c.message, c.image, c.sent_at
	FROM chat c
	WHERE c.id IN (
		SELECT MAX(c.id)
		FROM chat c
		WHERE c.user_id = ?
		GROUP BY c.receiver_id, c.group_id
	)`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var chats []Chat
	for rows.Next() {
		var chat Chat
		err = rows.Scan(&chat.ID, &chat.UserID, &chat.ReceiverID, &chat.GroupID, &chat.Message, &chat.Image, &chat.SentAt)
		if err != nil {
			return nil, err
		}
		chats = append(chats, chat)
	}
	return chats, nil
}
