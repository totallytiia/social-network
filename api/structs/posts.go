package structs

import (
	"errors"
	"regexp"
	db "social_network_api/db"
	"strconv"
	"strings"
)

// PrivacySettings is a comma separated list of user ids for the users that can see the post
type NewPost struct {
	Content         string      `json:"content"`
	Image           string      `json:"image"`
	Privacy         int         `json:"privacy"`
	PrivacySettings string      `json:"privacy_settings"`
	CreatedAt       string      `json:"created_at"`
	UserID          int         `json:"user_id"`
	GroupID         interface{} `json:"group_id"`
}

type Post struct {
	ID              int         `json:"id"`
	UserID          int         `json:"user_id"`
	UserFName       string      `json:"user_fname"`
	UserLName       string      `json:"user_lname"`
	UserNickname    string      `json:"user_nickname"`
	UserAvatar      string      `json:"user_avatar"`
	GroupID         interface{} `json:"group_id"`
	Content         string      `json:"content"`
	Image           string      `json:"image"`
	Privacy         string      `json:"privacy"`
	PrivacySettings string      `json:"privacy_settings"`
	CreatedAt       string      `json:"created_at"`
	UpdatedAt       string      `json:"updated_at"`
	Comments        []Comment   `json:"comments"`
	Likes           int         `json:"likes"`
	Dislikes        int         `json:"dislikes"`
	Liked           int         `json:"liked"`
}

type Posts struct {
	Posts []Post `json:"posts"`
}

func (p *NewPost) Validate() error {
	if p.Content == "" {
		return errors.New("post content cannot be empty")
	}
	if len(p.Content) > 1000 {
		return errors.New("post content cannot be longer than 1000 characters")
	}
	if p.Privacy != 0 && p.Privacy != 1 && p.Privacy != 2 {
		return errors.New("invalid privacy setting")
	}
	if p.Privacy == 2 && p.PrivacySettings == "" {
		return errors.New("privacy settings cannot be empty")
	}
	if p.Privacy == 2 {
		var privacySettings = strings.Split(p.PrivacySettings, ",")
		for _, v := range privacySettings {
			var _, err = strconv.Atoi(v)
			if err != nil {
				return errors.New("invalid privacy settings")
			}
		}
	}
	var imageRegEx = regexp.MustCompile(`^data:image\/(png|jpg|jpeg);base64,([a-zA-Z0-9+/=]+)$`)
	if !imageRegEx.MatchString(p.Image) && p.Image != "" {
		return errors.New("invalid image")
	}
	return nil
}

func (p *NewPost) Create() (int, error) {
	var res, err = db.DB.Exec("INSERT INTO posts (user_id, group_id, content, image, privacy, privacy_settings) VALUES (?, ?, ?, ?, ?, ?)", p.UserID, p.GroupID, p.Content, p.Image, p.Privacy, p.PrivacySettings)
	if err != nil {
		return 0, err
	}
	var id, _ = res.LastInsertId()
	return int(id), nil
}

func (p *Post) Update() error {
	var _, err = db.DB.Exec("UPDATE posts SET, content = ?, image = ?, privacy = ?, privacy_settings = ? WHERE id = ?", p.Content, p.Image, p.Privacy, p.PrivacySettings, p.ID)
	if err != nil {
		return err
	}
	return nil
}

func (p *Post) Get(userFetching int) error {
	var err = db.DB.QueryRow(`
	WITH const(ufetching)  AS (SELECT ?)
	SELECT user_id, group_id, content, image, privacy, privacy_settings, created_at, updated_at, 
	(SELECT COUNT(*) FROM reactions r WHERE r.post_id = id AND r.value = 1) AS likes, 
	(SELECT COUNT(*) FROM reactions r WHERE r.post_id = id AND r.value = -1) AS dislikes, 
	IIF((SELECT value FROM reactions r WHERE id = r.post_id) NOT NULL, (SELECT value FROM reactions r WHERE id = r.post_id), 0) AS liked 
	FROM posts 
	CROSS JOIN const 
	WHERE id = ?
	`, userFetching, p.ID).Scan(&p.UserID, &p.GroupID, &p.Content, &p.Image, &p.Privacy, &p.PrivacySettings, &p.CreatedAt, &p.UpdatedAt, &p.Likes, &p.Dislikes, &p.Liked)
	if err != nil {
		return err
	}
	return nil
}

func (p *Post) Delete() error {
	var _, err = db.DB.Exec("DELETE FROM posts WHERE id = ?", p.ID)
	if err != nil {
		return err
	}
	return nil
}

func GetPosts(IDs map[string]any, index, userFetching int) (Posts, error) {
	if IDs["user_id"] != nil && IDs["group_id"] != nil {
		return Posts{}, errors.New("invalid input")
	}
	if IDs["user_id"] == nil {
		IDs["user_id"] = -1
	}
	if IDs["group_id"] == nil {
		IDs["group_id"] = -1
	}
	var rows, err = db.DB.Query(`
	WITH const(ind, uid, gid, ufetching)  AS (SELECT ?, ?, ?, ?)
	SELECT p.id, p.user_id, u.fname, u.nickname, u.lname, u.avatar, p.group_id, p.content, p.image, 
	p.privacy, p.privacy_settings, p.created_at, p.updated_at, 
	(SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.value = 1) AS likes, 
	(SELECT COUNT(*) FROM reactions r WHERE r.post_id = p.id AND r.value = -1) AS dislikes, 
	IIF((SELECT value FROM reactions r WHERE post_id = r.post_id) NOT NULL, (SELECT value FROM reactions r WHERE post_id = r.post_id), 0) AS liked
	FROM posts p 
	INNER JOIN users u on p.user_id = u.id 
	CROSS JOIN const
	WHERE ((user_id = const.uid OR group_id = const.gid OR IIF(const.uid == -1 AND const.gid == -1, true, false)) AND ((p.privacy = '0') OR (p.privacy = '1' AND p.user_id IN (SELECT f.friend_id FROM friends f where f.user_id = const.ufetching)) OR (p.privacy = '2' AND p.privacy_settings LIKE '%'||const.ufetching||'%'))) OR (p.user_id = const.ufetching AND IIF(const.uid == -1 AND const.gid == -1, true, false))
	ORDER BY p.created_at DESC LIMIT 20 OFFSET 20*(SELECT ind FROM const)
	`, index, IDs["user_id"], IDs["group_id"], userFetching)
	if err != nil {
		return Posts{}, err
	}
	var posts Posts
	for rows.Next() {
		var post Post
		err = rows.Scan(&post.ID, &post.UserID, &post.UserFName, &post.UserNickname, &post.UserLName, &post.UserAvatar, &post.GroupID, &post.Content, &post.Image, &post.Privacy, &post.PrivacySettings, &post.CreatedAt, &post.UpdatedAt, &post.Likes, &post.Dislikes, &post.Liked)
		if err != nil {
			return Posts{}, err
		}
		posts.Posts = append(posts.Posts, post)
	}
	return posts, nil
}
