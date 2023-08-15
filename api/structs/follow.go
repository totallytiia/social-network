package structs

import (
	db "social_network_api/db"
	"strconv"
)

func (u User) Follow(followingID int) error {
	var query = "INSERT INTO follows (user_id, follow_id) VALUES (?, ?)"
	_, err := db.DB.Exec(query, u.ID, followingID)
	if err != nil {
		return err
	}
	return nil
}

func (u User) Unfollow(followingID int) error {
	var query = "DELETE FROM follows WHERE user_id = ? AND follow_id = ?"
	_, err := db.DB.Exec(query, u.ID, followingID)
	if err != nil {
		return err
	}
	return nil
}

func (u *User) GetFollowers() error {
	var query = "SELECT user_id FROM follows WHERE follow_id = ?"
	rows, err := db.DB.Query(query, u.ID)
	if err != nil {
		return err
	}
	var followers []int
	defer rows.Close()
	for rows.Next() {
		var follower int
		err := rows.Scan(&follower)
		if err != nil {
			return err
		}
		followers = append(followers, follower)
	}

	var strFollowers string
	for i, v := range followers {
		stringID := strconv.Itoa(v)
		strFollowers += stringID
		if i != len(followers)-1 {
			strFollowers += ","
		}
	}
	u.Followers = strFollowers
	return nil
}

func (u *User) GetFollowing() error {
	var query = "SELECT follow_id FROM follows WHERE user_id = ?"
	rows, err := db.DB.Query(query, u.ID)
	if err != nil {
		return err
	}
	var following []int
	defer rows.Close()
	for rows.Next() {
		var follow int
		err := rows.Scan(&follow)
		if err != nil {
			return err
		}
		following = append(following, follow)
	}
	var strFollowing string
	for i, v := range following {
		stringID := strconv.Itoa(v)
		strFollowing += stringID
		if i != len(following)-1 {
			strFollowing += ","
		}
	}
	u.Following = strFollowing
	return nil
}

func (u User) FollowRequest(followingID int) error {
	var query = "INSERT INTO follow_requests (user_id, follow_id) VALUES (?, ?)"
	_, err := db.DB.Exec(query, u.ID, followingID)
	if err != nil {
		return err
	}
	return nil
}

func (u User) FollowReqExists(followingID int) (bool, error) {
	var query = "SELECT EXISTS(SELECT * FROM follow_requests WHERE user_id = ? AND follow_id = ?)"
	var exists bool
	err := db.DB.QueryRow(query, u.ID, followingID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (u User) GetFollowRequests() ([]User, error) {
	var query = "SELECT id, email, fname, lname, CAST(dob AS TEXT), nickname, avatar, about, created_at, updated_at, private FROM users WHERE id IN (SELECT user_id FROM follow_requests WHERE follow_id = ?)"
	rows, err := db.DB.Query(query, u.ID)
	if err != nil {
		return nil, err
	}
	var users []User
	defer rows.Close()
	for rows.Next() {
		var u User
		err := rows.Scan(&u.ID, &u.Email, &u.FName, &u.LName, &u.DoB, &u.Nickname, &u.Avatar, &u.AboutMe, &u.CreatedAt, &u.UpdatedAt, &u.Private)
		if err != nil {
			return users, err
		}
		users = append(users, u)
	}
	return users, nil
}

func (u User) RespondToRequest(requesterID int, accept bool) error {
	var query string
	if accept {
		query = "INSERT INTO follows (user_id, follow_id) VALUES (?, ?)"
	} else {
		query = "DELETE FROM follow_requests WHERE user_id = ? AND follow_id = ?"
	}
	_, err := db.DB.Exec(query, requesterID, u.ID)
	if err != nil {
		return err
	}
	return nil
}
