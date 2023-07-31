package endpoints

import (
	"encoding/json"
	"net/http"
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
	notificationsJson, err := json.Marshal(notifications)
	if err != nil {
		BadRequest(w, r, "Bad Request")
		return
	}
	w.Write(notificationsJson)
}
