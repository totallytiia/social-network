package main

import (
	"context"
	"fmt"
	"log"
	http "net/http"
	"os"
	"os/signal"
	db "social_network_api/db"
	"time"
)

func main() {
	// Logs initialization
	logfile := checkLog()
	defer logfile.Close()
	log.SetOutput(logfile)

	var srv http.Server
	srv.Addr = ":8080"

	// Database initialization
	log.Println("Initializing database")
	db.InitDB()

	// Routes definition
	http.HandleFunc("/api/", api)

	log.Println("Starting server at", srv.Addr)
	fmt.Println("Starting server at", srv.Addr)
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	// Block until a signal is received.
	// Graceful shutdown
	<-c
	fmt.Println()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	srv.Shutdown(ctx)
	log.Println("Server shut down")
	fmt.Println("Server shut down")
}
