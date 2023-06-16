package structs

import (
	"errors"
	"regexp"
	db "social_network_api/db"
	"strconv"
	"strings"
	"time"
)

type NewUser struct {
	Email    string `json:"email"`
	FName    string `json:"fname"`
	LName    string `json:"lname"`
	Password string `json:"password"`
	DoB      string `json:"date_of_birth"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
	AboutMe  string `json:"about_me"`
}

type User struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	FName     string `json:"fname"`
	LName     string `json:"lname"`
	DoB       string `json:"date_of_birth"`
	Nickname  string `json:"nickname"`
	Avatar    string `json:"avatar"`
	AboutMe   string `json:"about_me"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

func (u NewUser) Validate() error {
	if u.Email == "" || u.Password == "" || u.FName == "" || u.LName == "" || u.DoB == "" {
		return errors.New("missing required fields")
	}
	// Validate the email using regex
	var emailReqEx = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !emailReqEx.MatchString(u.Email) {
		return errors.New("invalid email address")
	}
	// Should be like this but golang regex doesn't support lookaheads
	// Validate the password using regex
	// var passwordReqEx = regexp.MustCompile(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$`)
	// if !passwordReqEx.MatchString(u.Password) {
	// 	return errors.New("invalid password")
	// }
	if len(u.Password) < 8 {
		return errors.New("invalid password")
	}
	// Validate the date of birth using regex
	var dobReqEx = regexp.MustCompile(`^\d{2}-\d{2}-\d{4}$`)
	if !dobReqEx.MatchString(u.DoB) {
		return errors.New("invalid date of birth")
	}
	// Check if dob is at least 18 years ago
	var dobSplit = strings.Split(u.DoB, "-")
	var dobYear, _ = strconv.Atoi(dobSplit[2])
	var dobMonth, _ = strconv.Atoi(dobSplit[1])
	var dobDay, _ = strconv.Atoi(dobSplit[0])
	var dob = time.Date(dobYear, time.Month(dobMonth), dobDay, 0, 0, 0, 0, time.UTC)
	var eighteenYearsAgo = time.Now().AddDate(-18, 0, 0)
	if dob.After(eighteenYearsAgo) {
		return errors.New("invalid date of birth")
	}
	// Validate the nickname using regex
	var nicknameReqEx = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]{3,}$`)
	if !nicknameReqEx.MatchString(u.Nickname) {
		return errors.New("invalid nickname")
	}
	// Validate the avatar blob using regex
	var avatarReqEx = regexp.MustCompile(`^data:image\/(png|jpg|jpeg);base64,([a-zA-Z0-9+/=]+)$`)
	if !avatarReqEx.MatchString(u.Avatar) {
		return errors.New("invalid avatar")
	}
	// Validate the about me using regex
	var aboutMeReqEx = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]{3,255}$`)
	if !aboutMeReqEx.MatchString(u.AboutMe) {
		return errors.New("invalid about me")
	}
	return nil
}

func (u User) Exists() bool {
	// Check if the user exists in the database
	var user User
	// Create the query
	var query = "SELECT * FROM users WHERE email = ?"
	// Execute the query
	db.DB.QueryRow(query, u.Email).Scan(&user.ID, &user.Email, &user.FName, &user.LName, &user.DoB, &user.Nickname, &user.Avatar, &user.AboutMe, &user.CreatedAt, &user.UpdatedAt)
	// Check if the user exists
	return user.ID != 0
}

func (u NewUser) Register() error {
	var usr = User{Email: u.Email}
	if usr.Exists() {
		return errors.New("user already exists")
	}
	// Create the query
	var query = "INSERT INTO users (email, fname, lname, password, date_of_birth, nickname, avatar, about_me) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	// Execute the query
	_, err := db.DB.Exec(query, u.Email, u.FName, u.LName, u.Password, u.DoB, u.Nickname, u.Avatar, u.AboutMe)
	if err != nil {
		return err
	}
	return nil
}
