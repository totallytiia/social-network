package endpoints

import (
	"encoding/json"
	"fmt"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func CreateEvent(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, "Invalid group_id")
		return
	}
	var group = s.Group{GroupID: groupID}
	err = group.Get(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var event = s.NewEvent{
		GroupID:       groupID,
		StartDateTime: r.FormValue("start_date_time"),
		EndDateTime:   r.FormValue("end_date_time"),
		Description:   r.FormValue("description"),
		Title:         r.FormValue("title"),
	}
	err = event.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	id, err := event.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var e = s.Event{ID: id}
	err = e.Get(0)
	if err != nil {
		fmt.Println("Could not get event")
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	fmt.Println(group.GroupMembers)
	for _, member := range group.GroupMembers {
		// extract key (user id)
		var userID int
		for key := range member {
			userID = key
		}
		var user = s.User{ID: userID}
		err = user.Get(nil)
		if err != nil {
			fmt.Println("Could not get user")
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		if user.ID == u.ID {
			err = user.AddNotification(u.ID, "newEvent", fmt.Sprintf(`%s %s created a new event in %s`, u.FName, u.LName, group.GroupName), groupID)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
				w.Write(badReqJSON)
				return
			}
		}
		WSSendToUser(user.ID, `{"type": "newEvent", "message": "You have a new event in group `+group.GroupName+`", "event_id": `+strconv.Itoa(id)+`, "group_id": `+strconv.Itoa(groupID)+`}`)
	}
	w.WriteHeader(http.StatusCreated)
	eventJSON, _ := json.Marshal(e)
	w.Write(eventJSON)
}

func GetEvents(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	groupID, err := strconv.Atoi(r.URL.Query().Get("group_id"))
	if err != nil {
		BadRequest(w, r, "Invalid group_id")
		return
	}
	var group = s.Group{GroupID: groupID}
	err = group.Get(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var events, err2 = group.GetEvents()
	if err2 != nil {
		BadRequest(w, r, err2.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	eventsJSON, _ := json.Marshal(events)
	w.Write(eventsJSON)
}

func GetEvent(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	eventID, err := strconv.Atoi(r.URL.Query().Get("event_id"))
	if err != nil {
		BadRequest(w, r, "Invalid event_id")
		return
	}
	var e = s.Event{ID: eventID}
	err = e.Get(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	eventJSON, _ := json.Marshal(e)
	w.Write(eventJSON)
}

func UpdateEvent(w http.ResponseWriter, r *http.Request) {
	v, _ := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	eventID, err := strconv.Atoi(r.FormValue("event_id"))
	if err != nil {
		BadRequest(w, r, "Invalid event_id")
		return
	}
	var event = s.Event{
		ID:            eventID,
		StartDateTime: r.FormValue("start_date_time"),
		EndDateTime:   r.FormValue("end_date_time"),
		Description:   r.FormValue("description"),
		Title:         r.FormValue("title"),
	}
	err = event.Update()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Event updated", Details: eventID})
	w.Write(respJSON)
}

func DeleteEvent(w http.ResponseWriter, r *http.Request) {
	v, _ := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	eventID, err := strconv.Atoi(r.FormValue("event_id"))
	if err != nil {
		BadRequest(w, r, "Invalid event_id")
		return
	}
	var event = s.Event{
		ID: eventID,
	}
	err = event.Delete()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Event deleted", Details: eventID})
	w.Write(respJSON)
}

func RespondToEvent(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	eventID, err := strconv.Atoi(r.FormValue("event_id"))
	if err != nil {
		BadRequest(w, r, "Invalid event_id")
		return
	}
	var event = s.Event{
		ID: eventID,
	}
	response, err := strconv.ParseBool(r.FormValue("response"))
	if err != nil {
		BadRequest(w, r, "Invalid response")
		return
	}
	err = event.RespondToEvent(u.ID, response)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Responded to event invite", Details: eventID})
	w.Write(respJSON)
}
