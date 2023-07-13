package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
)

func ValidateSession(w http.ResponseWriter, r *http.Request) {
	v, _ := ValidateCookie(w, r)
	if v {
		w.WriteHeader(http.StatusOK)
		okJson, _ := json.Marshal(s.OKResponse{Message: "Valid cookie"})
		w.Write(okJson)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		Value:  "",
		MaxAge: -1,
	})
	w.WriteHeader(http.StatusUnauthorized)
	errorJson, _ := json.Marshal(s.ErrorResponse{Errors: "Invalid cookie"})
	w.Write(errorJson)
	return
}
