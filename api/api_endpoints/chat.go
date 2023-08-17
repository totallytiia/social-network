package endpoints

import (
	"encoding/json"
	"fmt"
	"net/http"
	"social_network_api/structs"
	"strconv"
)

func SendChat(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
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

	receiverID, errReceiver := strconv.Atoi(r.FormValue("receiver_id"))
	groupID, errGroup := strconv.Atoi(r.FormValue("group_id"))

	if (errReceiver == nil && errGroup == nil) || (errReceiver != nil && errGroup != nil) {
		BadRequest(w, r, "There was an error with your request")
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
		fmt.Println("Error creating chat")
		badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var c = structs.Chat{ID: id, UserID: u.ID, ReceiverID: receiverID, GroupID: groupID, Message: chat.Message, Image: chat.Image}
	err = c.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error getting chat")
		badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	//send message to receiver
	var receiver = structs.User{ID: receiverID}
	if receiverID != 0 {
		err = receiver.Get(nil)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error getting receiver")
			badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}

		err = receiver.AddNotification(u.ID, "chat", "You have a new message")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error adding notification")
			badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
	}
	var group = structs.Group{GroupID: groupID}
	if groupID != 0 {
		err = group.Get()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error getting group")
			badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		var members = group.GroupMembers
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error getting group members")
			badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		for id := range members {
			if id != u.ID {
				var member = structs.User{ID: id}
				err = member.Get(nil)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					fmt.Println("Error getting group member")
					badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
					w.Write(badReqJSON)
					return
				}
				err = member.AddNotification(u.ID, "chat", "You have a new message")
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					fmt.Println("Error adding notification")
					badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
					w.Write(badReqJSON)
					return
				}
			}
		}
	}

	w.WriteHeader(http.StatusCreated)
	var respJSON, _ = json.Marshal(c)
	w.Write(respJSON)
}

func GetChat(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	if r.Method != "GET" {
		BadRequest(w, r, "Bad Request")
		return
	}
	receiverIDStr := r.FormValue("receiver_id")
	groupIDStr := r.FormValue("group_id")

	receiverID, errReceiver := strconv.Atoi(receiverIDStr)
	groupID, errGroup := strconv.Atoi(groupIDStr)

	if (errReceiver == nil && errGroup == nil) || (errReceiver != nil && errGroup != nil) {
		BadRequest(w, r, "There was an error with your request")
		return
	}

	var chat []structs.Chat
	var err error
	if (receiverID != 0 && groupID != 0) || (receiverID == 0 && groupID == 0) {
		BadRequest(w, r, "Either receiver or group ID is required but not both")
		return
	}
	if receiverID != 0 {
		chat, err = structs.GetChats(u.ID, receiverID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
	}
	if groupID != 0 {
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

func GetChats(w http.ResponseWriter, r *http.Request) {
	v, u := ValidateCookie(w, r)
	if !v {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	if r.Method != "GET" {
		BadRequest(w, r, "Bad Request")
		return
	}

	chats, err := structs.GetLastChats(u.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(structs.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if len(chats) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	var respJSON, _ = json.Marshal(chats)
	w.Write(respJSON)
}
