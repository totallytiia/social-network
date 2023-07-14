package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	ep "social_network_api/api_endpoints"
	s "social_network_api/structs"
	"strings"
)

func api(w http.ResponseWriter, r *http.Request) {
	var badReqJSON, _ = json.Marshal(s.ErrorResponse{Errors: "Bad request"})
	reqUrl := strings.Split(r.URL.Path[len("/api/"):], "/")
	if len(reqUrl) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(badReqJSON)
		return
	}
	fmt.Println(reqUrl)
	// Write CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, X-Requested-With, Cookie")
	// Switch on first part after /api/
	switch reqUrl[0] {
	case "users":
		if len(reqUrl) == 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(badReqJSON)
			return
		}
		switch reqUrl[1] {
		case "register":
			ep.RegisterUser(w, r)
		case "login":
			ep.LoginUser(w, r)
		case "update":
			ep.UpdateUser(w, r)
		case "logout":
			ep.LogoutUser(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "posts":
		if len(reqUrl) == 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(badReqJSON)
			return
		}
		switch reqUrl[1] {
		case "create":
			ep.CreatePost(w, r)
		case "update":
			ep.UpdatePost(w, r)
		case "delete":
			ep.DeletePost(w, r)
		case "get":
			ep.GetPosts(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "groups":
		if len(reqUrl) == 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(badReqJSON)
			return
		}
		switch reqUrl[1] {
		case "create":
			// createGroup(w, r)
		case "update":
			// updateGroup(w, r)
		case "delete":
			// deleteGroup(w, r)
		case "get":
			// getGroup(w, r)
		case "getall":
			// getAllGroups(w, r)
		case "join":
			// joinGroup(w, r)
		case "leave":
			// leaveGroup(w, r)
		case "invite":
			// inviteToGroup(w, r)
		case "accept":
			// acceptGroupInvite(w, r)
		case "decline":
			// declineGroupInvite(w, r)
		case "members":
			// getGroupMembers(w, r)
		case "posts":
			// getGroupPosts(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "comments":
		if len(reqUrl) == 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(badReqJSON)
			return
		}
		switch reqUrl[1] {
		case "create":
			ep.CreateComment(w, r)
		case "update":
			ep.UpdateComment(w, r)
		case "delete":
			ep.DeleteComment(w, r)
		case "getall":
			ep.GetComments(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "likes":
		if len(reqUrl) == 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(badReqJSON)
			return
		}
		switch reqUrl[1] {
		case "like":
			// like(w, r)
		case "unlike":
			// unlike(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "validate":
		ep.ValidateSession(w, r)
	default:
		http.NotFound(w, r)
		return
	}
}
