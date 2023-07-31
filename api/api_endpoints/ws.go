package endpoints

import (
	"log"
	"net/http"

	s "social_network_api/structs"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
var clients = make(map[s.User]*websocket.Conn)

func WS(w http.ResponseWriter, r *http.Request) {
	// Upgrade the connection to a websocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	// Register the client
	v, user := ValidateCookie(w, r)
	if !v {
		log.Println(err)
		// Send an error message to the client
		conn.WriteMessage(websocket.TextMessage, []byte("Unauthorized"))
		conn.Close()
		return
	}
	clients[user] = conn
	log.Printf("WS Client connected: %s\n", conn.RemoteAddr())
	// Listen for messages
	for {
		// Read message from client
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			delete(clients, user)
			log.Printf("WS Client disconnected: %s\n", conn.RemoteAddr())
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
	user := s.Users[uID]
	conn, ok := clients[user]
	if !ok {
		return
	}
	conn.WriteMessage(websocket.TextMessage, []byte(msg))
}
