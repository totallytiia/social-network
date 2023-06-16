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
	var srv http.Server
	srv.Addr = ":8080"

	// Initialize the database
	db.InitDB()
	http.HandleFunc("/api/", api)
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Printf("listen: %s\n", err)
		}
	}()
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c
	fmt.Println()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	srv.Shutdown(ctx)
}
