package structs

import (
	"errors"
	"regexp"
	db "social_network_api/db"
)

type Message struct {
	ID             int    `json:"id"`
	UserID         int    `json:"user_id"`
	ReceiverID     int    `json:"receiver_id"`
	GroupID        int    `json:"group_id"`
	GroupName      string `json:"group_name,omitempty"`
	Message        string `json:"message"`
	Image          string `json:"image"`
	SentAt         string `json:"sent_at"`
	ReceiverAvatar string `json:"receiver_avatar,omitempty"`
	ReceiverFname  string `json:"receiver_fname,omitempty"`
	ReceiverLname  string `json:"receiver_lname,omitempty"`
}

type NewChat struct {
	UserID     int    `json:"user_id"`
	ReceiverID int    `json:"receiver_id"`
	GroupID    int    `json:"group_id"`
	Message    string `json:"message"`
	Image      string `json:"image"`
}

type Chat struct {
	Messages []Message `json:"messages"`
	Receiver User      `json:"receiver,omitempty"`
	Group    Group     `json:"group,omitempty"`
}

func (c *NewChat) Validate() error {
	if c.Message == "" {
		return errors.New("chat message cannot be empty")
	}
	if len(c.Message) > 500 {
		return errors.New("chat message cannot be longer than 1000 characters")
	}
	var imageRegEx = regexp.MustCompile(`^data:image\/(png|jpg|jpeg|gif);base64,([a-zA-Z0-9+/=]+)$`)
	if !imageRegEx.MatchString(c.Image) && c.Image != "" {
		return errors.New("invalid image")
	}
	if c.ReceiverID == 0 && c.GroupID == 0 {
		return errors.New("receiver_id or group_id must be set")
	}
	if c.ReceiverID != 0 && c.GroupID != 0 {
		return errors.New("receiver_id and group_id cannot both be set")
	}
	if c.ReceiverID != 0 {
		var user = User{ID: c.ReceiverID}
		err := user.Get(nil)
		if err != nil {
			return errors.New("invalid receiver_id")
		}
	}
	if c.GroupID != 0 {
		var group = Group{GroupID: c.GroupID}
		err := group.Get(0)
		if err != nil {
			return errors.New("invalid group_id")
		}
	}
	//check if receiver_id or group_id is set a
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

func (c *Message) Get() error {
	var err = db.DB.QueryRow("SELECT c.id, c.user_id, c.receiver_id, c.group_id, c.message, c.image, c.sent_at FROM chat c WHERE c.id = ?", c.ID).Scan(&c.ID, &c.UserID, &c.ReceiverID, &c.GroupID, &c.Message, &c.Image, &c.SentAt)
	if err != nil {
		return err
	}
	return nil
}

func (u User) GetChats(IDs []int) ([]Message, error) {
	//sqlite query to get chats between a sender and receiver, or a sender and a group
	var rows, err = db.DB.Query(`
	SELECT c.id, c.user_id, c.receiver_id, c.group_id, c.message, c.image, c.sent_at
	FROM chat c
	WHERE (c.user_id = ? AND c.receiver_id = ?) OR (c.user_id = ? AND c.receiver_id = ?) OR (c.group_id = ?)`, u.ID, IDs[0], IDs[0], u.ID, IDs[1])
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var chats []Message
	for rows.Next() {
		var chat Message
		err = rows.Scan(&chat.ID, &chat.UserID, &chat.ReceiverID, &chat.GroupID, &chat.Message, &chat.Image, &chat.SentAt)
		if err != nil {
			return nil, err
		}
		chats = append(chats, chat)
	}
	return chats, nil
}

func GetLastChats(userId int) ([]Message, error) {
	//sqlite query to get last chats between a user and all other users and groups
	var rows, _ = db.DB.Query(`
	SELECT sub.id, sub.user_id, sub.receiver_id, sub.group_id, sub.message, sub.image, sub.sent_at, sub.avatar, sub.fname, sub.lname
		FROM (
			SELECT c.id, c.user_id, c.receiver_id, c.group_id, c.message, c.image, c.sent_at, u.avatar, u.fname, u.lname, u.avatar,
				ROW_NUMBER() OVER (PARTITION BY CASE WHEN c.user_id = $1 THEN c.receiver_id ELSE c.user_id END, c.group_id ORDER BY c.sent_at DESC) AS rn
			FROM chat c
			INNER JOIN users u ON IIF(($1 = c.receiver_id), c.user_id, c.receiver_id) = u.id
			WHERE (c.user_id = $1 OR c.receiver_id = $1)
		) sub
	WHERE sub.rn = 1;`, userId)
	defer rows.Close()
	var chats []Message
	var err error
	for rows.Next() {
		var chat Message
		err = rows.Scan(&chat.ID, &chat.UserID, &chat.ReceiverID, &chat.GroupID, &chat.Message, &chat.Image, &chat.SentAt, &chat.ReceiverAvatar, &chat.ReceiverFname, &chat.ReceiverLname)
		if err != nil {
			return nil, err
		}
		chats = append(chats, chat)
	}
	rows, err = db.DB.Query(`SELECT sub.id, sub.user_id, sub.receiver_id, sub.group_id, sub.message, sub.image, sub.sent_at, sub.group_name
	FROM (
		SELECT c.id, c.user_id, c.receiver_id, c.group_id, c.message, c.image, c.sent_at, g.group_name,
			   ROW_NUMBER() OVER (PARTITION BY c.group_id ORDER BY c.sent_at DESC) AS rn
		FROM chat c
		INNER JOIN groups g ON c.group_id = g.id
		INNER JOIN group_members gm ON c.group_id = gm.group_id
		WHERE gm.user_id = 4
	) sub
	WHERE sub.rn = 1;`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var chat Message
		err = rows.Scan(&chat.ID, &chat.UserID, &chat.ReceiverID, &chat.GroupID, &chat.Message, &chat.Image, &chat.SentAt, &chat.GroupName)
		if err != nil {
			return nil, err
		}
		chats = append(chats, chat)
	}
	return chats, nil
}
