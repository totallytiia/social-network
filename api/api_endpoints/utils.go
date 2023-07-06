package endpoints

import (
	"net/http"
	s "social_network_api/structs"
	"time"
)

func ValidateCookie(w http.ResponseWriter, r *http.Request) (bool, s.User) {
	var cookie, err = r.Cookie("session")
	if cookie.Expires.Before(time.Now()) {
		return false, s.User{}
	}
	if err != nil {
		return false, s.User{}
	}
	user, err := s.UserFromSession(cookie.Value)
	if err != nil {
		return false, s.User{}
	}
	return true, user
}
