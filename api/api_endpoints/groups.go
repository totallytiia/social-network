package endpoints

import (
	"encoding/json"
	"net/http"
	s "social_network_api/structs"
	"strconv"
)

func CreateGroup(w http.ResponseWriter, r *http.Request) {
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
	var group = s.NewGroup{
		GroupName:        r.FormValue("group_name"),
		GroupDescription: r.FormValue("group_description"),
		GroupOwner:       u.ID,
	}
	err = group.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	g, err := group.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	err = g.InsertMember(u.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	w.WriteHeader(http.StatusCreated)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Group created successfully"})
	w.Write(okJSON)
}

func GetGroup(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var g = s.Group{GroupID: groupID}
	err = g.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	if !g.IsMember(u.ID) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(g)
	w.Write(okJSON)
}

func GetGroups(w http.ResponseWriter, r *http.Request) {
	v, _ := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "GET" {
		MethodNotAllowed(w, r)
		return
	}
	groups, err := s.GetGroups()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(groups)
	w.Write(okJSON)
}

func UpdateGroup(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "PUT" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(2000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var g = s.Group{GroupID: groupID}
	err = g.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	if g.GroupOwner != u.ID {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var group = s.NewGroup{
		GroupName:        r.FormValue("group_name"),
		GroupDescription: r.FormValue("group_description"),
		GroupOwner:       u.ID,
	}
	err = group.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = g.Update(group)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Group updated successfully"})
	w.Write(okJSON)
}

func DeleteGroup(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(128)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var g = s.Group{GroupID: groupID}
	err = g.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	if g.GroupOwner != u.ID {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	err = g.Delete()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Group deleted successfully"})
	w.Write(okJSON)
}

func AddGroupMember(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(128)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var g = s.Group{GroupID: groupID}
	err = g.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	if g.GroupOwner != u.ID {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	err = g.InsertMember(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Member added successfully"})
	w.Write(okJSON)
}

func RemoveGroupMember(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(128)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var g = s.Group{GroupID: groupID}
	err = g.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	if g.GroupOwner != u.ID {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	err = g.RemoveMember(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Member removed successfully"})
	w.Write(okJSON)
}

func GroupJoinRequest(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		MethodNotAllowed(w, r)
		return
	}
	var err = r.ParseMultipartForm(128)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	var g = s.Group{GroupID: groupID}
	err = g.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = g.JoinRequest(u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Join request sent successfully"})
	w.Write(okJSON)
}
