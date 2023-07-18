package endpoints

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
	"time"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(1000)
	if err != nil {
		BadRequest(w, r, err.Error())
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
	user.Private, err = strconv.ParseBool(r.FormValue("private"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = user.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = user.Register()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error registering the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var userLogin s.User
	userLogin.Email = user.Email
	err = userLogin.Login(user.Password)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error logging in the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.Header().Add("access-control-expose-headers", "Set-Cookie")
	cookie := http.Cookie{Name: "session", Value: userLogin.Session.SessionID, Path: "/", Expires: time.Now().Add(24 * time.Hour * 7), HttpOnly: false}
	http.SetCookie(w, &cookie)
	w.WriteHeader(http.StatusOK)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "User registered successfully", Details: userLogin.ID})
	w.Write(okJSON)
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(512)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var user s.User
	user.Email = r.FormValue("email")
	pass := r.FormValue("password")
	// Base64 decode the password
	decodedPass, err := base64.StdEncoding.DecodeString(pass)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = user.Login(string(decodedPass))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error logging in the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	// Set the cookie
	w.Header().Add("access-control-expose-headers", "Set-Cookie")
	cookie := http.Cookie{Name: "session", Value: user.Session.SessionID, Path: "/", Domain: "localhost", Expires: time.Now().Add(24 * time.Hour * 7), HttpOnly: false}
	http.SetCookie(w, &cookie)
	w.WriteHeader(http.StatusOK)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "User logged in successfully", Details: user.ID})
	w.Write(okJSON)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		w.WriteHeader(http.StatusUnauthorized)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Invalid session"})
		w.Write(badReqJSON)
		return
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(1000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var testUser s.NewUser
	testUser.Nickname = r.FormValue("nickname")
	testUser.FName = r.FormValue("fname")
	testUser.LName = r.FormValue("lname")
	testUser.Email = r.FormValue("email")
	testUser.DoB = r.FormValue("date_of_birth")
	testUser.Avatar = r.FormValue("avatar")
	testUser.AboutMe = r.FormValue("about_me")
	testUser.Private, err = strconv.ParseBool(r.FormValue("private"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = testUser.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	u.Nickname = testUser.Nickname
	u.FName = testUser.FName
	u.LName = testUser.LName
	u.Email = testUser.Email
	u.DoB = testUser.DoB
	u.Avatar = testUser.Avatar
	u.AboutMe = testUser.AboutMe
	u.Private = testUser.Private
	err = u.Update()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error updating the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "User updated successfully"})
	w.Write(okJSON)
}

func LogoutUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	var sessionCookie, err = r.Cookie("session")
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	user, err := s.UserFromSession(sessionCookie.Value)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = user.Logout()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error logging out the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	// Set the cookie
	cookie := http.Cookie{Name: "session", Value: "", Path: "/"}
	http.SetCookie(w, &cookie)
	w.WriteHeader(http.StatusOK)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "User logged out successfully"})
	w.Write(okJSON)
}
