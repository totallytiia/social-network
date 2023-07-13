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

func GetComments(postID int) ([]Comment, error) {
	var rows, err = db.DB.Query("SELECT id, user_id, post_id, content, created_at, updated_at FROM comments WHERE post_id = ?", postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var comments []Comment
	for rows.Next() {
		var comment Comment
		err = rows.Scan(&comment.ID, &comment.UserID, &comment.PostID, &comment.Content, &comment.CreatedAt, &comment.UpdatedAt)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}

func (c *Comment) Get() error {
	var err = db.DB.QueryRow("SELECT id, user_id, post_id, content, created_at, updated_at FROM comments WHERE id = ?", c.ID).Scan(&c.ID, &c.UserID, &c.PostID, &c.Content, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (c *Comment) Update() error {
	var _, err = db.DB.Exec("UPDATE comments SET content = ? WHERE id = ?", c.Content, c.ID)
	if err != nil {
		return err
	}
	return nil
}

func (c *Comment) Delete() error {
	var _, err = db.DB.Exec("DELETE FROM comments WHERE id = ?", c.ID)
	if err != nil {
		return err
	}
	return nil
}
