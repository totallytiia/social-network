package structs

import db "social_network_api/db"

func (u User) Follow(followingID int) error {
	var query = "INSERT INTO friends (user_id, friend_id) VALUES (?, ?)"
	_, err := db.DB.Exec(query, u.ID, followingID)
	if err != nil {
		return err
	}
	return nil
}

func (u User) Unfollow(followingID int) error {
	var query = "DELETE FROM friends WHERE user_id = ? AND friend_id = ?"
	_, err := db.DB.Exec(query, u.ID, followingID)
	if err != nil {
		return err
	}
	return nil
}

func (u User) GetFollowers() ([]User, error) {
	var query = "SELECT id, email, fname, lname, CAST(dob AS TEXT), nickname, avatar, about, created_at, updated_at, private FROM users WHERE id IN (SELECT user_id FROM friends WHERE friend_id = ?)"
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

func (u User) GetFollowing() ([]User, error) {
	var query = "SELECT id, email, fname, lname, CAST(dob AS TEXT), nickname, avatar, about, created_at, updated_at, private FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = ?)"
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

func (u User) FollowRequest(followingID int) error {
	var query = "INSERT INTO follow_requests (user_id, friend_id) VALUES (?, ?)"
	_, err := db.DB.Exec(query, u.ID, followingID)
	if err != nil {
		return err
	}
	return nil
}
