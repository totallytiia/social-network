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
