package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func FollowUser(w http.ResponseWriter, r *http.Request) {
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
	var followUser s.User
	err := r.ParseMultipartForm(512)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	followUser.ID, err = strconv.Atoi(r.FormValue("id"))
	if followUser.ID == 0 {
		BadRequest(w, r, "Invalid user id")
		return
	}
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = followUser.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if followUser.Private {
		err = u.FollowRequest(followUser.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		err = followUser.AddNotification(u.ID, "follow_request", "You have a new follow request")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		WSSendToUser(followUser.ID, `{"type": "follow_request", "message": "You have a new follow request", "user_id": `+strconv.Itoa(u.ID)+`}`)
		w.WriteHeader(http.StatusCreated)
		var okJSON, _ = json.Marshal(s.OKResponse{Message: "User request sent successfully"})
		w.Write(okJSON)
	}
	err = u.Follow(followUser.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	err = followUser.AddNotification(u.ID, "follow", "You have a new follower")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	WSSendToUser(followUser.ID, `{"type": "follow", "message": "You have a new follower", "user_id": `+strconv.Itoa(u.ID)+`}`)
	w.WriteHeader(http.StatusCreated)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "User followed successfully"})
	w.Write(okJSON)
}

func UnfollowUser(w http.ResponseWriter, r *http.Request) {
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
	var unfollowUser s.User
	err := r.ParseMultipartForm(512)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	unfollowUser.ID, err = strconv.Atoi(r.FormValue("id"))
	if unfollowUser.ID == 0 {
		BadRequest(w, r, "Invalid user id")
		return
	}
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = unfollowUser.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error unfollowing the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	err = u.Unfollow(unfollowUser.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error unfollowing the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "User unfollowed successfully"})
	w.Write(okJSON)
}
