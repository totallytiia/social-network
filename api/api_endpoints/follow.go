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
	err = followUser.Get(nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if followUser.Private {
		exists, err := u.FollowReqExists(followUser.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		if exists {
			w.WriteHeader(http.StatusBadRequest)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: "Follow request already exists"})
			w.Write(badReqJSON)
			return
		}
		err = u.FollowRequest(followUser.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		err = followUser.AddNotification(u.ID, "followReq", "sent you a new follow request", nil)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		WSSendToUser(followUser.ID, `{"type": "followReq", "message": "You have a new follow request", "user_id": `+strconv.Itoa(u.ID)+`}`)
		w.WriteHeader(http.StatusCreated)
		var okJSON, _ = json.Marshal(s.OKResponse{Message: "User request sent successfully"})
		w.Write(okJSON)
		return
	}
	err = u.Follow(followUser.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error following the user", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	err = followUser.AddNotification(u.ID, "follow", "started following you", nil)
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
	err = unfollowUser.Get(nil)
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

func GetFollowRequests(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		w.WriteHeader(http.StatusUnauthorized)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Invalid session"})
		w.Write(badReqJSON)
		return
	}
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	followRequests, err := u.GetFollowRequests()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error getting the follow requests", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	followRequestsJSON, _ := json.Marshal(followRequests)
	w.Write(followRequestsJSON)
}

func RespondToRequest(w http.ResponseWriter, r *http.Request) {
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
	err = followUser.Get(nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error responding to the follow request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	response, err := strconv.ParseBool(r.FormValue("response"))
	if err != nil {
		BadRequest(w, r, "Invalid response")
		return
	}
	// True = accept, false = reject
	err = u.RespondToRequest(followUser.ID, response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error responding to the follow request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if response {
		err = followUser.AddNotification(u.ID, "followReqRes", "accepted your follow request", nil)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error responding to the follow request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		WSSendToUser(followUser.ID, `{"type": "followReqRes", "message": "You have a new follower", "user_id": `+strconv.Itoa(u.ID)+`}`)
	}
	if !response {
		err = followUser.AddNotification(u.ID, "follow", "rejected your follow request", nil)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error responding to the follow request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		WSSendToUser(followUser.ID, `{"type": "followReqRes", "message": "Your follow request was rejected", "user_id": `+strconv.Itoa(u.ID)+`}`)
	}
	err = u.RemoveRequest(followUser.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error responding to the follow request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	notification, err := s.FindNotification(u.ID, followUser.ID, "followReq")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error responding to the follow request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	err = notification.ChangeType("follow")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error responding to the follow request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var okJSON, _ = json.Marshal(s.OKResponse{Message: "Follow request responded to successfully"})
	w.Write(okJSON)
}
