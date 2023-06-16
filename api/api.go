package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type ErrorResponse struct {
	Errors   string      `json:"errors"`
	Detaiils interface{} `json:"details,omitempty"`
}

// Create a JSON response for bad requests
var badReqJSON, _ = json.Marshal(ErrorResponse{Errors: "Bad request"})

func api(w http.ResponseWriter, r *http.Request) {
	reqUrl := strings.Split(r.URL.Path[len("/api/"):], "/")
	if len(reqUrl) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(badReqJSON)
		return
	}
	switch reqUrl[0] {
	case "users":
		if len(reqUrl) == 1 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(badReqJSON)
			return
		}
		switch reqUrl[1] {
		case "register":
			// register(w, r)
		case "login":
			// login(w, r)
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
			// createPost(w, r)
		case "update":
			// updatePost(w, r)
		case "delete":
			// deletePost(w, r)
		case "get":
			// getPost(w, r)
		case "getall":
			// getAllPosts(w, r)
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
			// createComment(w, r)
		case "update":
			// updateComment(w, r)
		case "delete":
			// deleteComment(w, r)
		case "get":
			// getComment(w, r)
		case "getall":
			// getAllComments(w, r)
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
	default:
		http.NotFound(w, r)
		return
	}
}
