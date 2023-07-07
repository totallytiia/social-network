package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func CreatePost(w http.ResponseWriter, r *http.Request) {
	if v, _ := ValidateCookie(w, r); !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		var badReqMethodJSON, _ = json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Method not allowed"})
		w.Write(badReqMethodJSON)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var post s.NewPost
	post.Title = r.FormValue("title")
	post.Content = r.FormValue("content")
	post.Image = r.FormValue("image")
	post.Privacy, err = strconv.Atoi(r.FormValue("privacy"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Invalid privacy setting"})
		w.Write(badReqJSON)
		return
	}
	post.PrivacySettings = r.FormValue("privacy_settings")
	// Extract the user from the session
	userPosting, err := s.UserFromSession(r.FormValue("session"))
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "Unauthorized request", Details: "Invalid session"})
		w.Write(badReqJSON)
		return
	}
	post.UserID = userPosting.ID
	post.GroupID, err = strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Invlaid group ID"})
		w.Write(badReqJSON)
		return
	}
	err = post.Validate()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	id, err := post.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error creating the post", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var postJSON, _ = json.Marshal(s.Post{ID: id})
	w.WriteHeader(http.StatusCreated)
	w.Write(postJSON)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	v, user := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		var badReqMethodJSON, _ = json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Method not allowed"})
		w.Write(badReqMethodJSON)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var post s.Post
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Invalid post ID"})
		w.Write(badReqJSON)
		return
	}
	post.ID = postID
	err = post.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error deleting the post", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if post.UserID != user.ID {
		w.WriteHeader(http.StatusUnauthorized)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error deleting the post", Details: "Unauthorized"})
		w.Write(badReqJSON)
		return
	}
	err = post.Delete()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error deleting the post", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Post deleted"))
}
