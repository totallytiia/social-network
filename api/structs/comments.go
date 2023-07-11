package structs

import (
	"errors"
	db "social_network_api/db"
)

type Comment struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	PostID    int    `json:"post_id"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type NewComment struct {
	UserID  int    `json:"user_id"`
	PostID  int    `json:"post_id"`
	Content string `json:"content"`
}

func (c *NewComment) Validate() error {
	if c.Content == "" {
		return errors.New("comment content cannot be empty")
	}
	if len(c.Content) > 1000 {
		return errors.New("comment content cannot be longer than 1000 characters")
	}
	return nil
}

func (c *NewComment) Create() (int, error) {
	var res, err = db.DB.Exec("INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)", c.UserID, c.PostID, c.Content)
	if err != nil {
		return 0, err
	}
	var id, _ = res.LastInsertId()
	return int(id), nil
}
