package endpoints

import (
	"encoding/json"
	"fmt"
	"net/http"
	s "social_network_api/structs"
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

	var chat = s.NewChat{
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
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	var c = s.Message{ID: id, UserID: u.ID, ReceiverID: receiverID, GroupID: groupID, Message: chat.Message, Image: chat.Image}
	err = c.Get()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Error getting chat")
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	//send message to receiver
	var receiver = s.User{ID: receiverID}
	if receiverID != 0 {
		err = receiver.Get(nil)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error getting receiver")
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}

		err = receiver.AddNotification(u.ID, "chat", "sent you a message")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error adding notification")
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		messagesJson, _ := json.Marshal(c)
		WSSendToUser(receiver.ID, fmt.Sprintf(`{"type":"chat", "message":%s}`, messagesJson))
	}
	var group = s.Group{GroupID: groupID}
	if groupID != 0 {
		err = group.Get()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error getting group")
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		var members = group.GroupMembers
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("Error getting group members")
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		for id := range members {
			if id != u.ID {
				var member = s.User{ID: id}
				err = member.Get(nil)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					fmt.Println("Error getting group member")
					badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
					w.Write(badReqJSON)
					return
				}
				err = member.AddNotification(u.ID, "chat", fmt.Sprintf("sent a message in %s", group.GroupName))
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					fmt.Println("Error adding notification")
					badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
					w.Write(badReqJSON)
					return
				}
				messagesJson, _ := json.Marshal(c.Message)
				WSSendToUser(member.ID, fmt.Sprintf(`{"type":"chat", "message":%s}`, messagesJson))
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

	var chat s.Chat
	var err error
	if (receiverID != 0 && groupID != 0) || (receiverID == 0 && groupID == 0) {
		BadRequest(w, r, "Either receiver or group ID is required but not both")
		return
	}
	if receiverID != 0 {
		chat.Messages, err = u.GetChats(receiverID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		var receiver = s.User{ID: receiverID}
		err = receiver.Get(nil)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		chat.Receiver = receiver
	}
	if groupID != 0 {
		chat.Messages, err = u.GetChats(groupID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		var group = s.Group{GroupID: groupID}
		err = group.Get()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
			w.Write(badReqJSON)
			return
		}
		chat.Group = group
	}
	var respJSON, _ = json.Marshal(chat)
	if len(chat.Messages) == 0 {
		w.WriteHeader(http.StatusOK)
		w.Write(respJSON)
		return
	}
	w.WriteHeader(http.StatusOK)
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

	chats, err := s.GetLastChats(u.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		badReqJSON, _ := json.Marshal(s.ErrorResponse{Errors: "There was an error with your request", Details: err.Error()})
		w.Write(badReqJSON)
		return
	}
	if len(chats) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	w.WriteHeader(http.StatusOK)
	var respJSON, _ = json.Marshal(chats)
	w.Write(respJSON)
}
