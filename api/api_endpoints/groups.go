package endpoints

import (
	"encoding/json"
	"fmt"
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
	IDs := make(map[string]any)
	IDs["group_id"] = g.GroupID
	posts, err := s.GetPosts(IDs, 0, u.ID)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	g.GroupPosts = posts
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
		if err.Error() == "no groups found" {
			w.WriteHeader(http.StatusNoContent)
			okJSON, _ := json.Marshal(s.OKResponse{Message: "No groups found"})
			w.Write(okJSON)
			return
		}
		BadRequest(w, r, err.Error())
		return
	}
	if len(groups) == 0 {
		w.WriteHeader(http.StatusNoContent)
		okJSON, _ := json.Marshal(s.OKResponse{Message: "No groups found"})
		w.Write(okJSON)
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
	var groupOwner = s.User{ID: g.GroupOwner}
	err = groupOwner.Get()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	err = groupOwner.AddNotification(u.ID, "groupJoinReq", fmt.Sprintf("%s %s has requested to join your group %s", u.FName, u.LName, g.GroupName))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	WSSendToUser(groupOwner.ID, fmt.Sprintf(`{"type": "groupJoinReq", "message": "%s %s has requested to join your group %s", "group_id": %d}`, u.FName, u.LName, g.GroupName, g.GroupID))
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Join request sent successfully"})
	w.Write(okJSON)
}

func RespondToGroupRequest(w http.ResponseWriter, r *http.Request) {
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
	userID, err := strconv.Atoi(r.FormValue("user_id"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	accept, err := strconv.ParseBool(r.FormValue("accept"))
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	if accept {
		err = g.AcceptRequest(userID)
		if err != nil {
			BadRequest(w, r, err.Error())
			return
		}
		var user = s.User{ID: userID}
		err = user.Get()
		if err != nil {
			BadRequest(w, r, err.Error())
			return
		}
		err = g.RemoveRequest(userID)
		if err != nil {
			BadRequest(w, r, err.Error())
			return
		}
		err = user.AddNotification(g.GroupOwner, "groupJoinAccept", fmt.Sprintf("Your request to join %s's group %s has been accepted", user.FName, g.GroupName))
		if err != nil {
			BadRequest(w, r, err.Error())
			return
		}
		WSSendToUser(user.ID, fmt.Sprintf(`{"type": "groupJoinAccept", "message": "Your request to join %s's group %s has been accepted", "group_id": %d}`, user.FName, g.GroupName, g.GroupID))
	} else {
		err = g.RejectRequest(userID)
		if err != nil {
			BadRequest(w, r, err.Error())
			return
		}
		var user = s.User{ID: userID}
		err = user.Get()
		if err != nil {
			BadRequest(w, r, err.Error())
			return
		}
		err = user.AddNotification(g.GroupOwner, "groupJoinReject", fmt.Sprintf("Your request to join %s's group %s has been rejected", user.FName, g.GroupName))
		if err != nil {
			BadRequest(w, r, err.Error())
			return
		}
		WSSendToUser(user.ID, fmt.Sprintf(`{"type": "groupJoinReject", "message": "Your request to join %s's group %s has been rejected", "group_id": %d}`, user.FName, g.GroupName, g.GroupID))
	}
	w.WriteHeader(http.StatusOK)
	okJSON, _ := json.Marshal(s.OKResponse{Message: "Request responded to successfully"})
	w.Write(okJSON)
}
