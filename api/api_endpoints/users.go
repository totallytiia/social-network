package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		var badReqMethodJSON, _ = json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Method not allowed"})
		w.Write(badReqMethodJSON)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(128000)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var user s.NewUser
	user.Nickname = r.FormValue("nickname")
	user.Password = r.FormValue("password")
	user.FName = r.FormValue("fname")
	user.LName = r.FormValue("lname")
	user.Email = r.FormValue("email")
	user.DoB = r.FormValue("date_of_birth")
	user.Avatar = r.FormValue("avatar")
	user.AboutMe = r.FormValue("about_me")
	err = user.Validate()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	err = user.Register()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error registering the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "User registered successfully"})
	w.Write(okJSON)
}
