package db

import (
	"database/sql"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

// Initializes the database by making sure there is a database file and
// running the migrations
func InitDB() {
	var err error
	// Create the database file if it doesn't exist
	_, err = os.Stat("./db/social_network.db")
	if os.IsNotExist(err) {
		var file, err = os.Create("./db/social_network.db")
		if err != nil {
			panic(err)
		}
		file.Close()
	}

	// Open the database
	DB, err = sql.Open("sqlite3", "./db/social_network.db")
	if err != nil {
		panic(err)
	}

	initMigrations()
}

func initMigrations() {
	driver, err := sqlite.WithInstance(DB, &sqlite.Config{})
	if err != nil {
		panic(err)
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://./db/migrations",
		"sqlite3", driver)
	if err != nil {
		panic(err)
	}
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		panic(err)
	}
}
