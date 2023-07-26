package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func CreatePost(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var post s.NewPost
	post.Title = r.FormValue("title")
	post.Content = r.FormValue("content")
	post.Image = r.FormValue("image")
	post.Privacy, err = strconv.Atoi(r.FormValue("privacy"))
	post.CreatedAt = r.FormValue("created_at")
	if err != nil {
		BadRequest(w, r, "Invalid privacy setting")
		return
	}
	post.PrivacySettings = r.FormValue("privacy_settings")
	// Extract the user from the session
	post.UserID = u.ID
	if r.FormValue("group_id") != "" {
		post.GroupID, err = strconv.Atoi(r.FormValue("group_id"))
		if err != nil {
			BadRequest(w, r, "Invalid group ID")
			return
		}
	} else {
		post.GroupID = nil
	}
	err = post.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	id, err := post.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error creating the post", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var postJSON, _ = json.Marshal(s.Post{ID: id, Title: post.Title, Content: post.Content, Image: post.Image, PrivacySettings: post.PrivacySettings, CreatedAt: post.CreatedAt, UserID: post.UserID, GroupID: post.GroupID})
	w.WriteHeader(http.StatusCreated)
	w.Write(postJSON)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	v, user := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var post s.Post
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		BadRequest(w, r, "Invalid post ID")
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
	successJSON, _ := json.Marshal(s.OKResponse{Message: "Post deleted"})
	w.Write(successJSON)
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
	v, user := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var post s.Post
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		BadRequest(w, r, "Invalid post ID")
		return
	}
	post.ID = postID
	err = post.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error updating the post", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if post.UserID != user.ID {
		w.WriteHeader(http.StatusUnauthorized)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error updating the post", Details: "Unauthorized"})
		w.Write(badReqJSON)
		return
	}
	post.Title = r.FormValue("title")
	post.Content = r.FormValue("content")
	err = post.Update()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error updating the post", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
	successJSON, _ := json.Marshal(s.OKResponse{Message: "Post updated"})
	w.Write(successJSON)
}

// 	v, _ := ValidateCookie(w, r)
// 	if !v {
// 		http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 	}
// 	if r.Method != "GET" {
// 		w.WriteHeader(http.StatusMethodNotAllowed)
// 		var badReqMethodJSON, _ = json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Method not allowed"})
// 		w.Write(badReqMethodJSON)
// 		return
// 	}
// 	var post s.Post
// 	if r.FormValue("group_id") != "" {
// 		groupID, err := strconv.Atoi(r.FormValue("group_id"))
// 		if err != nil {
// 			w.WriteHeader(http.StatusBadRequest)
// 			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Invalid group ID"})
// 			w.Write(badReqJSON)
// 			return
// 		}
// 		post.GroupID = groupID
// 	}
// 	if r.FormValue("user_id") != "" {
// 		userID, err := strconv.Atoi(r.FormValue("user_id"))
// 		if err != nil {
// 			w.WriteHeader(http.StatusBadRequest)
// 			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: "Invalid user ID"})
// 			w.Write(badReqJSON)
// 			return
// 		}
// 		post.UserID = userID
// 	}
// 	posts, err := post.GetPosts()
// 	if err != nil {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error getting the posts", Details: err.Error()})
// 		w.Write(badReqJSON)
// 		return
// 	}
// 	var postsJSON, _ = json.Marshal(posts)
// 	w.WriteHeader(http.StatusOK)
// 	w.Write(postsJSON)
// }

func GetPosts(w http.ResponseWriter, r *http.Request) {
	v, _ := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	var post s.Post
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err == nil {
		post.ID = postID
		err = post.Get()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error getting the post", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		post.Comments, err = s.GetComments(post.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error getting the comments", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		var postJSON, _ = json.Marshal(post)
		w.WriteHeader(http.StatusOK)
		w.Write(postJSON)
		return
	}
	// TODO: Add pagination
	// TODO: Make empty request possible, fetch posts from useres you follow
	if len(r.FormValue("group_id")) == 0 && len(r.FormValue("user_id")) == 0 {
		BadRequest(w, r, "You must provide a group ID or a user ID")
		return
	}
	if len(r.FormValue("group_id")) > 0 && len(r.FormValue("user_id")) > 0 {
		BadRequest(w, r, "You must provide a group ID or a user ID, not both")
		return
	}
	IDs := make(map[string]any)
	if r.FormValue("group_id") != "" {
		groupID, err := strconv.Atoi(r.FormValue("group_id"))
		if err != nil {
			BadRequest(w, r, "Invalid group ID")
			return
		}
		IDs["group_id"] = groupID
	}
	if r.FormValue("user_id") != "" {
		userID, err := strconv.Atoi(r.FormValue("user_id"))
		if err != nil {
			BadRequest(w, r, "Invalid user ID")
			return
		}
		IDs["user_id"] = userID
	}
	posts, err := s.GetPosts(IDs)
	if err != nil {
		if err.Error() == "invalid input" {
			BadRequest(w, r, "Invalid user ID or group ID")
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error getting the posts", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if (len(posts.Posts)) == 0 {
		w.Write([]byte("{}"))
		w.WriteHeader(http.StatusNoContent)
		return
	}
	for post := range posts.Posts {
		posts.Posts[post].Comments, err = s.GetComments(posts.Posts[post].ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error getting the comments", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
	}
	var postsJSON, _ = json.Marshal(posts)
	w.WriteHeader(http.StatusOK)
	w.Write(postsJSON)
}
