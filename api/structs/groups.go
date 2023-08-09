package structs

import (
	"errors"
	db "social_network_api/db"
	"strconv"
	"strings"
)

type Group struct {
	GroupID          int    `json:"group_id"`
	GroupName        string `json:"group_name"`
	GroupDescription string `json:"group_description"`
	GroupOwner       int    `json:"group_owner"`
	GroupMembers     []int  `json:"group_members"`
	GroupPosts       Posts  `json:"group_posts"`
}

type Groups []Group

type NewGroup struct {
	GroupName        string `json:"group_name"`
	GroupDescription string `json:"group_description"`
	GroupOwner       int    `json:"group_owner"`
}

func (g *NewGroup) Validate() error {
	if g.GroupName == "" {
		return errors.New("group name cannot be empty")
	}
	if len(g.GroupName) > 50 {
		return errors.New("group name cannot be longer than 50 characters")
	}
	if g.GroupDescription == "" {
		return errors.New("group description cannot be empty")
	}
	if len(g.GroupDescription) > 1000 {
		return errors.New("group description cannot be longer than 1000 characters")
	}
	if g.GroupOwner == 0 {
		return errors.New("group owner cannot be empty")
	}
	return nil
}

func (g NewGroup) Create() (Group, error) {
	var group Group
	err := db.DB.QueryRow("INSERT INTO groups(group_name, group_description, user_id) VALUES(?, ?, ?) RETURNING id", g.GroupName, g.GroupDescription, g.GroupOwner).Scan(&group.GroupID)
	if err != nil {
		return group, err
	}
	group.GroupName = g.GroupName
	group.GroupDescription = g.GroupDescription
	group.GroupOwner = g.GroupOwner
	return group, nil
}

func (g *Group) Get() error {
	row := db.DB.QueryRow(`SELECT group_name, group_description, user_id, group_concat((SELECT user_id FROM group_members WHERE id = ?), ", ") AS members FROM groups WHERE id = ?`, g.GroupID, g.GroupID)
	var members string
	err := row.Scan(&g.GroupName, &g.GroupDescription, &g.GroupOwner, &members)
	if err != nil {
		return err
	}
	g.GroupMembers = func(s string) []int {
		var intSlice []int
		for _, v := range strings.Split(s, ", ") {
			i, _ := strconv.Atoi(v)
			intSlice = append(intSlice, i)
		}
		return intSlice
	}(members)
	return nil
}

func GetGroups() (Groups, error) {
	rows, err := db.DB.Query(`
	SELECT *, (SELECT GROUP_CONCAT(gm.user_id) FROM group_members gm WHERE gm.group_id = g.id) AS members FROM groups g
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups Groups
	for rows.Next() {
		var group Group
		var members string
		err := rows.Scan(&group.GroupID, &group.GroupName, &group.GroupDescription, &group.GroupOwner, &members)
		if err != nil {
			if group.GroupID == 0 {
				return nil, errors.New("no groups found")
			}
			return nil, err
		}
		group.GroupMembers = func(s string) []int {
			var intSlice []int
			for _, v := range strings.Split(s, ", ") {
				i, _ := strconv.Atoi(v)
				intSlice = append(intSlice, i)
			}
			return intSlice
		}(members)
		groups = append(groups, group)
	}
	return groups, nil
}

func (g Group) InsertMember(userID int) error {
	_, err := db.DB.Exec("INSERT INTO group_members(group_id, user_id) VALUES(?, ?)", g.GroupID, userID)
	return err
}

func (g Group) RemoveMember(userID int) error {
	_, err := db.DB.Exec("DELETE FROM group_members WHERE group_id = ? AND user_id = ?", g.GroupID, userID)
	return err
}

func (g Group) Delete() error {
	err := g.DeletePosts()
	if err != nil {
		return err
	}
	_, err = db.DB.Exec("DELETE FROM groups WHERE id = ?", g.GroupID)
	return err
}

func (g *Group) DeletePosts() error {
	var err error
	g.GroupPosts, err = GetPosts(map[string]any{"GroupID": g.GroupID}, 0, g.GroupOwner)
	if err != nil {
		return err
	}
	for _, v := range g.GroupPosts {
		err = v.Delete()
		if err != nil {
			return err
		}
	}
	g.GroupPosts = nil
	return nil
}

func (g Group) IsMember(user int) bool {
	for _, v := range g.GroupMembers {
		if v == user {
			return true
		}
	}
	return false
}

func (g *Group) Update(group NewGroup) error {
	_, err := db.DB.Exec("UPDATE groups SET group_name = ?, group_description = ? WHERE id = ?", group.GroupName, group.GroupDescription, g.GroupID)
	if err != nil {
		return err
	}
	g.GroupName = group.GroupName
	g.GroupDescription = group.GroupDescription
	return nil
}

func (g Group) JoinRequest(userID int) error {
	_, err := db.DB.Exec("INSERT INTO group_requests(group_id, user_id) VALUES(?, ?)", g.GroupID, userID)
	return err
}
