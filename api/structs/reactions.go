package structs

import (
	"errors"
	db "social_network_api/db"
	"strconv"
)

type Reaction struct {
	PostID    interface{} `json:"post_id"`
	CommentID interface{} `json:"comment_id"`
	UserID    int         `json:"user_id"`
	Value     int         `json:"value"`
}

func (r *Reaction) Validate() error {
	var err error
	if r.PostID == "" && r.CommentID == "" {
		return errors.New("you must provide a post id or a comment id")
	}
	if r.PostID != "" && r.CommentID != "" {
		return errors.New("you must provide a post id or a comment id, not both")
	}
	if r.Value != 1 && r.Value != -1 {
		return errors.New("invalid value")
	}
	if r.PostID != "" {
		var p Post
		p.ID, err = strconv.Atoi(r.PostID.(string))
		if err != nil {
			return errors.New("invalid post id")
		}
		r.PostID = p.ID
		err := p.Get()
		if err != nil {
			return errors.New("post does not exist")
		}
		if p.UserID == r.UserID {
			return errors.New("you cannot react to your own post")
		}
	}
	if r.CommentID != "" {
		var c Comment
		var err error
		c.ID, err = strconv.Atoi(r.CommentID.(string))
		if err != nil {
			return errors.New("invalid comment id")
		}
		r.CommentID = c.ID
		err = c.Get()
		if err != nil {
			return errors.New("comment does not exist")
		}
		if c.UserID == r.UserID {
			return errors.New("you cannot react to your own comment")
		}
	}
	return nil
}

// Returns the value of the reaction if it exists, otherwise 0
func (r Reaction) Exists() int {
	if r.PostID != nil {
		return r.PostExists()
	}
	return r.CommentExists()
}

func (r Reaction) CommentExists() int {
	var value int
	db.DB.QueryRow("SELECT value FROM reactions WHERE comment_id = ? AND user_id = ?", r.CommentID, r.UserID, r.Value).Scan(&value)
	return value
}

func (r Reaction) PostExists() int {
	var value int
	db.DB.QueryRow("SELECT value FROM reactions WHERE post_id = ? AND user_id = ?", r.PostID, r.UserID, r.Value).Scan(&value)
	return value
}

func (r Reaction) Create() error {
	_, err := db.DB.Exec("INSERT INTO reactions (post_id, comment_id, user_id, value) VALUES (?, ?, ?, ?)", r.PostID, r.CommentID, r.UserID, r.Value)
	if err != nil {
		return err
	}
	return nil
}

func (r Reaction) Update() error {
	if r.PostID != "" {
		return r.PostUpdate()
	}
	return r.CommentUpdate()
}

func (r Reaction) PostUpdate() error {
	_, err := db.DB.Exec("UPDATE reactions SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE post_id = ? AND user_id = ?", r.Value, r.PostID, r.UserID)
	if err != nil {
		return err
	}
	return nil
}

func (r Reaction) CommentUpdate() error {
	_, err := db.DB.Exec("UPDATE reactions SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE comment_id = ? AND user_id = ?", r.Value, r.CommentID, r.UserID)
	if err != nil {
		return err
	}
	return nil
}

func (r Reaction) Remove() error {
	if r.PostID != "" {
		return r.PostRemove()
	}
	return r.CommentRemove()
}

func (r Reaction) CommentRemove() error {
	_, err := db.DB.Exec("DELETE FROM reactions WHERE comment_id = ? AND user_id = ?", r.CommentID, r.UserID)
	if err != nil {
		return err
	}
	return nil
}

func (r Reaction) PostRemove() error {
	_, err := db.DB.Exec("DELETE FROM reactions WHERE post_id = ? AND user_id = ?", r.PostID, r.UserID)
	if err != nil {
		return err
	}
	return nil
}
