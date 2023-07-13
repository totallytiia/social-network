package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func CreateComment(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		BadRequest(w, r, "Invalid post_id")
		return
	}
	var comment = s.NewComment{
		UserID:  u.ID,
		PostID:  postID,
		Content: r.FormValue("content"),
	}
	err = comment.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	id, err := comment.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusCreated)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Comment created", Details: id})
	w.Write(respJSON)
}

func GetComments(w http.ResponseWriter, r *http.Request) {
	v, _ := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		BadRequest(w, r, "Invalid post_id")
		return
	}
	comments, err := s.GetComments(postID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Comments retrieved", Details: comments})
	w.Write(respJSON)
}

func UpdateComment(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	commentID, err := strconv.Atoi(r.FormValue("comment_id"))
	if err != nil {
		BadRequest(w, r, "Invalid comment_id")
		return
	}
	var testComment = s.NewComment{
		Content: r.FormValue("content"),
	}
	err = testComment.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var comment = s.Comment{
		ID:      commentID,
		UserID:  u.ID,
		Content: r.FormValue("content"),
	}
	err = comment.Update()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Comment updated", Details: commentID})
	w.Write(respJSON)
}

func DeleteComment(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	commentID, err := strconv.Atoi(r.FormValue("comment_id"))
	if err != nil {
		BadRequest(w, r, "Invalid comment_id")
		return
	}
	var comment = s.Comment{
		ID: commentID,
	}
	err = comment.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	if comment.UserID != u.ID {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	err = comment.Delete()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.OKResponse{Message: "Comment deleted", Details: commentID})
	w.Write(respJSON)
}
