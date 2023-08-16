package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func AddReaction(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
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
	var reaction s.Reaction
	reaction.PostID = r.FormValue("post_id")
	reaction.CommentID = r.FormValue("comment_id")
	reaction.Value, err = strconv.Atoi(r.FormValue("value"))
	if err != nil {
		BadRequest(w, r, "Invalid value")
		return
	}
	reaction.UserID = u.ID
	err = reaction.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var val int
	if val = reaction.Exists(); val == reaction.Value {
		BadRequest(w, r, "Reaction already exists")
		return
	}
	if val != reaction.Value && val != 0 {
		err = reaction.Update()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error removing the reaction", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("{}"))
		return
	}
	err = reaction.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error creating the reaction", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if reaction.PostID != "" {
		var p s.Post
		p.ID = reaction.PostID.(int)
		p.Get(u.ID)
		var postOwner = s.User{ID: p.UserID}
		postOwner.Get(nil)
		err = postOwner.AddNotification(u.ID, "reaction", "Someone reacted on your post")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error creating the notification", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		WSSendToUser(postOwner.ID, `{"type": "reaction", "post_id": "`+strconv.Itoa(p.ID)+`", "value": `+strconv.Itoa(reaction.Value)+`}`)
	}
	if reaction.CommentID != "" {
		var c s.Comment
		c.ID = reaction.CommentID.(int)
		c.Get()
		WSSendToUser(c.UserID, `{"type": "reaction", "comment_id": "`+strconv.Itoa(c.ID)+`", "value": `+strconv.Itoa(reaction.Value)+`}`)
	}
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("{}"))
}

func RemoveReaction(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
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
	var reaction s.Reaction
	reaction.PostID = r.FormValue("post_id")
	reaction.CommentID = r.FormValue("comment_id")
	reaction.UserID = u.ID
	reaction.Value = 1
	err = reaction.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = reaction.Remove()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error removing the reaction", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{}"))
}
