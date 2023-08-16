package endpoints

import (
	"encoding/json"
	"net/http"
	"social_network_api/structs"
	"strconv"
)

func SendChat(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "POST" {
		BadRequest(w, r, "Bad Request")
		return
	}
	// Extract the Form data from the request
	var err = r.ParseMultipartForm(4000)
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	receiverID, err := strconv.Atoi(r.FormValue("receiver_id"))
	if err != nil {
		BadRequest(w, r, "Invalid receiver ID")
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, "Invalid group ID")
		return
	}
	if (receiverID != 0 && groupID != 0) || (receiverID == 0 && groupID == 0) {
		BadRequest(w, r, "Invalid receiver")
		return
	}

	var chat = structs.NewChat{
		UserID:     u.ID,
		ReceiverID: receiverID,
		GroupID:    groupID,
		Message:    r.FormValue("message"),
		Image:      r.FormValue("image"),
	}
	err = chat.Validate()
	if err != nil {
		BadRequest(w, r, err.Error())
		return
	}
	id, err := chat.Create()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var c = structs.Chat{ID: id, UserID: u.ID, ReceiverID: receiverID, GroupID: groupID, Message: chat.Message, Image: chat.Image}
	err = c.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	//send message to receiver
	var receiver = structs.User{ID: receiverID}
	err = receiver.Get(nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}

	err = receiver.AddNotification(u.ID, "chat", "You have a new message")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}

	w.WriteHeader(http.StatusCreated)
	var respJSON, _ = json.Marshal(c)
	w.Write(respJSON)
}

func GetChat(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	}
	if r.Method != "GET" {
		BadRequest(w, r, "Bad Request")
		return
	}

	receiverID, err := strconv.Atoi(r.FormValue("receiver_id"))
	if err != nil {
		BadRequest(w, r, "Invalid receiver ID")
		return
	}
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		BadRequest(w, r, "Invalid group ID")
		return
	}
	var chat []structs.Chat
	if (receiverID != 0 && groupID != 0) || (receiverID == 0 && groupID == 0) {
		BadRequest(w, r, "Invalid receiver")
		return
	} else if receiverID != 0 {
		chat, err = structs.GetChats(u.ID, receiverID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
	} else if groupID != 0 {
		chat, err = structs.GetChats(u.ID, groupID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
	}
	if len(chat) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	var respJSON, _ = json.Marshal(chat)
	w.Write(respJSON)
}
