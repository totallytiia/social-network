package main

import (
	"fmt"
	"net/http"
	"os"
	ep "social_network_api/api_endpoints"
	"strings"
	"time"
)

func api(w http.ResponseWriter, r *http.Request) {
	reqUrl := strings.Split(r.URL.Path[len("/api/"):], "/")
	if len(reqUrl) == 0 {
		ep.BadRequest(w, r, "Bad Request")
	}
	fmt.Println(reqUrl)
	// Write CORS headers
	if os.Getenv("ISDOCKER") == "true" {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost")
	} else {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	}
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, X-Requested-With, Cookie")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	cookie, err := r.Cookie("session")
	if err == nil {
		if len(cookie.Value) != 0 {
			v, u := ep.ValidateCookie(w, r)
			if !v {
				cookie := http.Cookie{Name: "session", Value: "", Path: "/", MaxAge: -1, HttpOnly: false}
				http.SetCookie(w, &cookie)
			} else {
				cookie := http.Cookie{Name: "session", Value: u.Session.SessionID, Path: "/", Expires: time.Now().Add(24 * time.Hour * 7), HttpOnly: false}
				http.SetCookie(w, &cookie)
			}
		}
	}

	// Switch on first part after /api/
	switch reqUrl[0] {
	case "ws":
		ep.WS(w, r)
	case "users":
		if len(reqUrl) == 1 {
			ep.BadRequest(w, r, "Bad Request")
		}
		switch reqUrl[1] {
		case "register":
			ep.RegisterUser(w, r)
		case "login":
			ep.LoginUser(w, r)
		case "private":
			ep.UpdatePrivate(w, r)
		case "logout":
			ep.LogoutUser(w, r)
		case "get":
			ep.GetUser(w, r)
		case "getall":
			ep.GetUsers(w, r)
		case "follow":
			ep.FollowUser(w, r)
		case "unfollow":
			ep.UnfollowUser(w, r)
		case "respond":
			ep.RespondToRequest(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "posts":
		if len(reqUrl) == 1 {
			ep.BadRequest(w, r, "Bad Request")
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
			ep.BadRequest(w, r, "Bad Request")
		}
		switch reqUrl[1] {
		case "create":
			ep.CreateGroup(w, r)
		case "update":
			ep.UpdateGroup(w, r)
		case "delete":
			ep.DeleteGroup(w, r)
		case "get":
			ep.GetGroup(w, r)
		case "getall":
			ep.GetGroups(w, r)
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
		default:
			http.NotFound(w, r)
			return
		}
	case "comments":
		if len(reqUrl) == 1 {
			ep.BadRequest(w, r, "Bad Request")
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
			ep.BadRequest(w, r, "Bad Request")
		}
		switch reqUrl[1] {
		case "like":
			ep.AddReaction(w, r)
		case "unlike":
			ep.RemoveReaction(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "notifications":
		if len(reqUrl) == 1 {
			ep.GetNotifications(w, r)
			return
		}
		switch reqUrl[1] {
		case "seen":
			ep.MarkNotificationsSeen(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	case "validate":
		ep.ValidateSession(w, r)
	case "chat":
		if len(reqUrl) == 1 {
			ep.BadRequest(w, r, "Bad Request")
		}
		switch reqUrl[1] {
		case "sendchat":
			ep.SendChat(w, r)
		case "getall":
			ep.GetChat(w, r)
		default:
			http.NotFound(w, r)
			return
		}
	default:
		http.NotFound(w, r)
		return
	}
}
