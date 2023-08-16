package structs

import (
	"errors"
	"fmt"
	db "social_network_api/db"
	"strconv"
	"strings"
)

type Group struct {
	GroupID          int              `json:"id"`
	GroupName        string           `json:"name"`
	GroupDescription string           `json:"description"`
	GroupOwner       int              `json:"owner"`
	GroupMembers     []map[int]string `json:"members"`
	GroupPosts       Posts            `json:"posts"`
	GroupEvents      Events           `json:"events"`
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
		if !(err.Error() == "sql: Scan error on column index 3: name \"members\"") {
			return err
		}
	}
	rows, err := db.DB.Query(`SELECT id, fname, lname FROM users`)
	if err != nil {
		return err
	}
	var users []User
	defer rows.Close()

	for rows.Next() {
		var user User
		//       ⬇️ stupid s, s is stupid cuz wasn't there and was making Viktor very confuse
		err = rows.Scan(&user.ID, &user.FName, &user.LName)
		if err != nil {
			if err.Error() == "sql: no rows in result set" {
				break
			}
			return err
		}
		users = append(users, user)
	}
	g.GroupMembers = func(s string) []map[int]string {
		var intSlice []map[int]string
		for _, v := range strings.Split(s, ", ") {
			i, _ := strconv.Atoi(v)
			for _, u := range users {
				if u.ID == i {
					intSlice = append(intSlice, map[int]string{i: u.FName + " " + u.LName})
				}
			}
		}
		return intSlice
	}(members)
	rows, err = db.DB.Query(`SELECT e.id, e.group_id, e.start_date_time, e.end_date_time, e.description, e.location, e.created_at, e.updated_at, GROUP_CONCAT((SELECT eug.user_id FROM event_users eug WHERE going = 1 AND eug.event_id = e.id), ", ") AS going, GROUP_CONCAT((SELECT eung.user_id FROM event_users eung WHERE eung.going = 0 AND eung.event_id = e.id), ", ") AS not_going FROM events e INNER JOIN event_users eu ON e.id = eu.event_id WHERE group_id = ?`, g.GroupID)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var event Event
		var going, notGoing string
		err = rows.Scan(&event.ID, &event.GroupID, &event.StartDateTime, &event.EndDateTime, &event.Description, &event.Location, &event.CreatedAt, &event.UpdatedAt, &going, &notGoing)
		if err != nil {
			fmt.Println(err.Error())
			return err
		}
		event.UserGoing = func(s string) []int {
			var intSlice []int
			for _, v := range strings.Split(s, ", ") {
				i, _ := strconv.Atoi(v)
				intSlice = append(intSlice, i)
			}
			return intSlice
		}(going)
		event.UserNotGoing = func(s string) []int {
			var intSlice []int
			for _, v := range strings.Split(s, ", ") {
				i, _ := strconv.Atoi(v)
				intSlice = append(intSlice, i)
			}
			return intSlice
		}(notGoing)
		g.GroupEvents = append(g.GroupEvents, event)
	}
	return nil
}

func GetGroups() (Groups, error) {
	groupRows, err := db.DB.Query(`
	SELECT g.id, g.group_name, g.group_description, g.user_id, (SELECT GROUP_CONCAT(gm.user_id, ", ") FROM group_members gm WHERE gm.group_id = g.id) AS members FROM groups g;
	`)
	if err != nil {
		return nil, err
	}
	defer groupRows.Close()

	var groups Groups
	for groupRows.Next() {
		var group Group
		var members string
		err := groupRows.Scan(&group.GroupID, &group.GroupName, &group.GroupDescription, &group.GroupOwner, &members)
		if err != nil {
			if group.GroupID == 0 {
				return nil, errors.New("no groups found")
			}
			if strings.Contains(err.Error(), "Scan error on column index 4") {
				members = ""
			} else {
				return nil, err
			}
		}
		rows, _ := db.DB.Query(`SELECT id, fname, lname FROM users`)
		var users []User
		for rows.Next() {
			var user User
			rows.Scan(&user.ID, &user.FName, &user.LName)
			users = append(users, user)
		}
		group.GroupMembers = func(s string) []map[int]string {
			var intSlice []map[int]string
			for _, v := range strings.Split(s, ", ") {
				i, _ := strconv.Atoi(v)
				for _, u := range users {
					if u.ID == i {
						intSlice = append(intSlice, map[int]string{i: u.FName + " " + u.LName})
					}
				}
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
		for k := range v {
			if k == user {
				return true
			}
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

func (g Group) AcceptRequest(userID int) error {
	_, err := db.DB.Exec("INSERT INTO group_members(group_id, user_id) VALUES(?, ?)", g.GroupID, userID)
	return err
}

func (g Group) RemoveRequest(userID int) error {
	_, err := db.DB.Exec("DELETE FROM group_requests WHERE group_id = ? AND user_id = ?", g.GroupID, userID)
	return err
}

func (g Group) InviteMember(userID int) error {
	_, err := db.DB.Exec("INSERT INTO group_invites(group_id, user_id) VALUES(?, ?)", g.GroupID, userID)
	return err
}

func (g Group) InviteExists(userID int) bool {
	var id int
	err := db.DB.QueryRow("SELECT id FROM group_invites WHERE group_id = ? AND user_id = ?", g.GroupID, userID).Scan(&id)
	return err == nil
}

func (g Group) AcceptInvite(userID int) error {
	_, err := db.DB.Exec("INSERT INTO group_members(group_id, user_id) VALUES(?, ?)", g.GroupID, userID)
	return err
}

func (g Group) RemoveInvite(userID int) error {
	_, err := db.DB.Exec("DELETE FROM group_invites WHERE group_id = ? AND user_id = ?", g.GroupID, userID)
	return err
}
