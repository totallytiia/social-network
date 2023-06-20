package main

import (
	"os"
	"time"
)

func findOldestFile(dir string) (oldestFile os.FileInfo, err error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return
	}

	oldestTime := time.Now()
	for _, file := range files {
		fileInfo, _ := file.Info()
		if file.Type().IsRegular() && fileInfo.ModTime().Before(oldestTime) {
			oldestFile = fileInfo
			oldestTime = fileInfo.ModTime()
		}
	}

	if oldestFile == nil {
		err = os.ErrNotExist
	}
	return
}

func checkLog() *os.File {
	//Checking if logfile exists.
	dir := "./logs/"
	filename := "forum.log"

	if _, err := os.Stat("logs"); os.IsNotExist(err) {
		// "logs" directory does not exist, so create it
		if err := os.Mkdir("logs", 0755); err != nil {
			// Failed to create "logs" directory
			panic(err)
		}
	}

	// Check to see if the log file forum.log exist. If it doesn't create it. If it does rename old file with date and create a new one.
	if _, err := os.Stat(dir + filename); os.IsNotExist(err) {
		// Create new file
		file, err := os.Create(dir + filename)
		if err != nil {
			panic(err)
		}
		defer file.Close()
	} else {
		// Rename existing file with timestamp in filename
		timestamp := time.Now().Format("2006-01-02_15-04-05")
		newFilename := "forum_" + timestamp + ".log"
		err := os.Rename(dir+filename, dir+newFilename)
		if err != nil {
			panic(err)
		}
		// Create new file
		file, err := os.Create(dir + filename)
		if err != nil {
			panic(err)
		}
		defer file.Close()
	}

	files, _ := os.ReadDir(dir)
	if len(files) > 10 {
		if file, err := findOldestFile(dir); err == nil {
			os.Remove(dir + file.Name())
		} else {
			panic(err)
		}
	}
	// Open the file for appending and defer close
	logFile, err := os.OpenFile(dir+filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	return logFile
}
