package endpoints

import (
	"encoding/json"
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
	var event = s.NewEvent{
		GroupID:       groupID,
		StartDateTime: r.FormValue("start_date_time"),
		EndDateTime:   r.FormValue("end_date_time"),
		Location:      r.FormValue("location"),
		Description:   r.FormValue("description"),
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
	var e = s.Event{ID: id, GroupID: groupID, StartDateTime: event.StartDateTime, EndDateTime: event.EndDateTime, Location: event.Location, Description: event.Description}
	err = e.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
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
	var events, err2 = s.GetEvents(groupID)
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
	err = e.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	eventJSON, _ := json.Marshal(e)
	w.Write(eventJSON)
}

func UpdateEvent(w http.ResponseWriter, r *http.Request) {
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
	eventID, err := strconv.Atoi(r.FormValue("event_id"))
	if err != nil {
		BadRequest(w, r, "Invalid event_id")
		return
	}
	var event = s.Event{
		ID:            eventID,
		StartDateTime: r.FormValue("start_date_time"),
		EndDateTime:   r.FormValue("end_date_time"),
		Location:      r.FormValue("location"),
		Description:   r.FormValue("description"),
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
	err = event.Delete()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Event deleted", Details: eventID})
	w.Write(respJSON)
}

func JoinEvent(w http.ResponseWriter, r *http.Request) {
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
	err = event.Join(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Joined event", Details: eventID})
	w.Write(respJSON)
}

func LeaveEvent(w http.ResponseWriter, r *http.Request) {
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
	err = event.Leave(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Left event", Details: eventID})
	w.Write(respJSON)
}
