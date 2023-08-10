package endpoints

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	s "social_network_api/structs"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}
var clients = make(map[s.User]*websocket.Conn)

func WS(w http.ResponseWriter, r *http.Request) {
	// Upgrade the connection to a websocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	var user s.User
	log.Printf("WS Client connected: %s\n", conn.RemoteAddr())
	// Listen for messages
	for {
		// Read message from client
		_, msg, err := conn.ReadMessage()
		if strings.Contains(string(msg), "user_id") {
			var connectJSON map[string]int
			err = json.Unmarshal(msg, &connectJSON)
			if err != nil {
				log.Println(err)
				continue
			}
			uID := connectJSON["user_id"]
			if uID == 0 {
				conn.WriteMessage(websocket.TextMessage, []byte("Invalid user_id"))
				conn.Close()
				return
			}
			user, ok := s.Users[uID]
			if !ok {
				continue
			}
			clients[user] = conn
			continue
		}
		if err != nil {
			log.Println(err)
			log.Printf("WS Client disconnected: %s\n", conn.RemoteAddr())
			// Remove client from clients map
			delete(clients, user)
			return
		}
		log.Printf("Message received: %s; from %s\n", msg, conn.RemoteAddr())
	}
}

func WSBroadcast(msg string) {
	for _, conn := range clients {
		conn.WriteMessage(websocket.TextMessage, []byte(msg))
	}
}

func WSSendToUser(uID int, msg string) {
	user, online := s.Users[uID]
	if !online {
		return
	}
	conn, ok := clients[user]
	if !ok {
		return
	}
	conn.WriteMessage(websocket.TextMessage, []byte(msg))
}
