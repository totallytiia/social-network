package structs

import (
	"errors"
	db "social_network_api/db"
)

type Event struct {
	ID            int    `json:"id"`
	GroupID       int    `json:"group_id"`
	StartDateTime string `json:"start_date_time"`
	EndDateTime   string `json:"end_date_time"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	UserGoing     int    `json:"user_going"`
	UserNotGoing  int    `json:"user_not_going"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

type NewEvent struct {
	GroupID       int    `json:"group_id"`
	StartDateTime string `json:"start_date_time"`
	EndDateTime   string `json:"end_date_time"`
	Title         string `json:"title"`
	Description   string `json:"description"`
}

type Events []Event

func (e *NewEvent) Validate() error {
	if e.GroupID == 0 {
		return errors.New("event group_id cannot be empty")
	}
	if e.StartDateTime == "" {
		return errors.New("event start_date_time cannot be empty")
	}
	if e.EndDateTime == "" {
		return errors.New("event end_date_time cannot be empty")
	}
	if e.Description == "" {
		return errors.New("event description cannot be empty")
	}
	if e.Title == "" {
		return errors.New("event title cannot be empty")
	}
	if len(e.Title) > 50 {
		return errors.New("event title cannot be longer than 100 characters")
	}
	return nil
}

func (e *NewEvent) Create() (int, error) {
	var res, err = db.DB.Exec("INSERT INTO events (group_id, start_date_time, end_date_time, description, title) VALUES (?, ?, ?, ?, ?)", e.GroupID, e.StartDateTime, e.EndDateTime, e.Description, e.Title)
	if err != nil {
		return 0, err
	}
	var id, _ = res.LastInsertId()
	return int(id), nil
}

func (g Group) GetEvents() ([]Event, error) {
	var rows, err = db.DB.Query(`
	SELECT e.id, e.group_id, e.start_date_time, e.end_date_time, e.description, e.title, (SELECT COUNT(*) FROM event_users eu WHERE eu.event_id = e.id AND eu.going = 1) AS user_going, (SELECT COUNT(*) FROM event_users eu WHERE eu.event_id = e.id AND eu.going = 0) AS user_not_going
	FROM events e
	WHERE e.group_id = ?`, g.GroupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var events []Event
	for rows.Next() {
		var e Event
		rows.Scan(&e.ID, &e.GroupID, &e.StartDateTime, &e.EndDateTime, &e.Description, &e.Title, &e.UserGoing, &e.UserNotGoing)
		events = append(events, e)
	}
	return events, nil
}

func (e *Event) Get(uFetching int) error {
	var err = db.DB.QueryRow(`
	SELECT e.id, e.group_id, e.start_date_time, e.end_date_time, e.description, e.title, (SELECT COUNT(*) FROM event_users eu WHERE eu.event_id = e.id AND eu.going = 1 AND eu.user_id = ?) AS user_going, (SELECT COUNT(*) FROM event_users eu WHERE eu.event_id = e.id AND eu.going = 0 AND eu.user_id = ?) AS user_not_going
	FROM events e
	WHERE e.id = ?`, uFetching, uFetching, e.ID).Scan(&e.ID, &e.GroupID, &e.StartDateTime, &e.EndDateTime, &e.Description, &e.Title, &e.UserGoing, &e.UserNotGoing)
	if err != nil {
		return err
	}
	return nil
}

func (e *Event) Update() error {
	var _, err = db.DB.Exec("UPDATE events SET start_date_time = ?, end_date_time = ?, description = ?, title = ? WHERE id = ?", e.StartDateTime, e.EndDateTime, e.Description, e.Title, e.ID)
	if err != nil {
		return err
	}
	return nil
}

func (e *Event) Delete() error {
	var _, err = db.DB.Exec("DELETE FROM events WHERE id = ?", e.ID)
	if err != nil {
		return err
	}
	return nil
}

func (e *Event) RespondToEvent(userID int, going bool) error {
	var err error
	if going {
		_, err = db.DB.Exec("INSERT INTO event_users (event_id, user_id, going, status) VALUES (?, ?, ?, ?)", e.ID, userID, 1, 1)
	} else {
		_, err = db.DB.Exec("INSERT INTO event_users (event_id, user_id, notgoing, status) VALUES (?, ?, ?, ?)", e.ID, userID, 1, 1)

	}
	return err
}
