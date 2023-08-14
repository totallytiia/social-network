package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func GetNotifications(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		BadRequest(w, r, "Bad Request")
		return
	}
	if r.Method != "GET" {
		BadRequest(w, r, "Bad Request")
		return
	}
	notifications, err := u.GetNotifications()
	if err != nil {
		BadRequest(w, r, "Bad Request")
		return
	}
	if len(notifications) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	notificationsJson, err := json.Marshal(notifications)
	if err != nil {
		BadRequest(w, r, "Bad Request")
		return
	}
	w.Write(notificationsJson)
}

func MarkNotificationsSeen(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		BadRequest(w, r, "Bad Request")
		return
	}
	notificationID, err := strconv.Atoi(r.FormValue("id"))
	if err != nil {
		BadRequest(w, r, "Bad Request")
		return
	}
	var notification s.Notification
	notification.ID = notificationID
	err = u.MarkNotificationsSeen()
	if err != nil {
		BadRequest(w, r, "Bad Request")
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "OK", Details: "Notification marked as seen"})
	w.Write(okJSON)
}
