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
		Comment: r.FormValue("comment"),
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
	var c = s.Comment{ID: id, UserID: u.ID, PostID: postID, Comment: comment.Comment}
	err = c.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var p = s.Post{ID: postID}
	err = p.Get(u.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var postOwner = s.User{ID: p.UserID}
	err = postOwner.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	err = postOwner.AddNotification(u.ID, "comment", "Someone just commented on your post")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusCreated)
	var respJSON, _ = json.Marshal(c)
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
	if len(comments) == 0 {
		w.WriteHeader(http.StatusNoContent)
		w.Write([]byte("{}"))
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(s.Comments{Comments: comments})
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
		Comment: r.FormValue("comment"),
	}
	err = testComment.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var comment = s.Comment{
		ID:      commentID,
		UserID:  u.ID,
		Comment: r.FormValue("comment"),
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
