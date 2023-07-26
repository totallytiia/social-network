package structs

import (
	"errors"
	db "social_network_api/db"
)

type Comment struct {
	ID           int    `json:"id"`
	UserID       int    `json:"user_id"`
	UserFName    string `json:"user_fname"`
	UserLName    string `json:"user_lname"`
	UserNickname string `json:"user_nickname"`
	UserAvatar   string `json:"user_avatar"`
	PostID       int    `json:"post_id"`
	Comment      string `json:"comment"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
}

type NewComment struct {
	UserID  int    `json:"user_id"`
	PostID  int    `json:"post_id"`
	Comment string `json:"comment"`
}

type Comments struct {
	Comments []Comment `json:"comments"`
}

func (c *NewComment) Validate() error {
	if c.Comment == "" {
		return errors.New("comment comment cannot be empty")
	}
	if len(c.Comment) > 1000 {
		return errors.New("comment comment cannot be longer than 1000 characters")
	}
	return nil
}

func (c *NewComment) Create() (int, error) {
	var res, err = db.DB.Exec("INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)", c.UserID, c.PostID, c.Comment)
	if err != nil {
		return 0, err
	}
	var id, _ = res.LastInsertId()
	return int(id), nil
}

func GetComments(postID int) ([]Comment, error) {
	var rows, err = db.DB.Query("SELECT c.id, c.user_id, u.fname, u.lname, u.nickname, u.avatar c.post_id, c.comment, c.created_at, c.updated_at FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE c.post_id = ?", postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var comments []Comment
	for rows.Next() {
		var comment Comment
		err = rows.Scan(&comment.ID, &comment.UserID, &comment.UserFName, &comment.UserLName, &comment.UserNickname, &comment.UserAvatar, &comment.PostID, &comment.Comment, &comment.CreatedAt, &comment.UpdatedAt)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}

func (c *Comment) Get() error {
	var err = db.DB.QueryRow("SELECT id, user_id, post_id, comment, created_at, updated_at FROM comments WHERE id = ?", c.ID).Scan(&c.ID, &c.UserID, &c.PostID, &c.Comment, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (c *Comment) Update() error {
	var _, err = db.DB.Exec("UPDATE comments SET comment = ? WHERE id = ?", c.Comment, c.ID)
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
