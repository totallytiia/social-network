package endpoints

import (
	"encoding/json"
	"fmt"
	"net/http"
	s "social_network_api/structs"
)

func ValidateCookie(w http.ResponseWriter, r *http.Request) (bool, s.User) {
	var cookie, err = r.Cookie("session")
	if err != nil {
		return false, s.User{}
	}
	// fmt.Println(cookie)
	// if cookie.Expires.Before(time.Now()) {
	// 	return false, s.User{}
	// }
	if err != nil {
		return false, s.User{}
	}
	user, err := s.UserFromSession(cookie.Value)
	fmt.Println(user)
	fmt.Println(err)
	if err != nil {
		return false, s.User{}
	}
	return true, user
}

func MethodNotAllowed(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusMethodNotAllowed)
	var badReqMethodJSON, _ = json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Method not allowed"})
	w.Write(badReqMethodJSON)
}

func BadRequest(w http.ResponseWriter, r *http.Request, details string) {
	w.WriteHeader(http.StatusBadRequest)
	var badReqJSON, _ = json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: details})
	w.Write(badReqJSON)
}
