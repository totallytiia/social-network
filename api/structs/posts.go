package structs

import (
	"errors"
	"regexp"
	db "social_network_api/db"
)

// PrivacySettings is a comma separated list of user ids for the users that can see the post
type NewPost struct {
	Title           string `json:"title"`
	Content         string `json:"content"`
	Image           string `json:"image"`
	Privacy         string `json:"privacy"`
	PrivacySettings string `json:"privacy_settings"`
	UserID          int    `json:"user_id"`
	GroupID         int    `json:"group_id"`
}

type Post struct {
	ID              int    `json:"id"`
	UserID          int    `json:"user_id"`
	GroupID         int    `json:"group_id"`
	Title           string `json:"title"`
	Content         string `json:"content"`
	Image           string `json:"image"`
	Privacy         string `json:"privacy"`
	PrivacySettings string `json:"privacy_settings"`
	CreatedAt       string `json:"created_at"`
	UpdatedAt       string `json:"updated_at"`
}

func (p *NewPost) Validate() error {
	if p.Title == "" {
		return errors.New("post title cannot be empty")
	}
	if p.Content == "" {
		return errors.New("post content cannot be empty")
	}
	var imageRegEx = regexp.MustCompile(`^data:image\/(png|jpg|jpeg);base64,([a-zA-Z0-9+/=]+)$`)
	if !imageRegEx.MatchString(p.Image) {
		return errors.New("invalid image")
	}
	return nil
}

func (p *NewPost) Create() (int, error) {
	var res, err = db.DB.Exec("INSERT INTO posts (user_id, group_id, title, content, image, privacy, privacy_settings) VALUES (?, ?, ?, ?, ?, ?, ?)", p.UserID, p.GroupID, p.Title, p.Content, p.Image, p.Privacy, p.PrivacySettings)
	if err != nil {
		return 0, err
	}
	var id, _ = res.LastInsertId()
	return int(id), nil
}
