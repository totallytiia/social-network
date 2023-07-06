package structs

import (
	"errors"
	"log"
	"regexp"
	db "social_network_api/db"
	"strconv"
	"strings"
	"time"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

var Users = map[int]User{}

// Used when creating/registering a new user
type NewUser struct {
	Email    string `json:"email"`
	FName    string `json:"fname"`
	LName    string `json:"lname"`
	Password string `json:"password"`
	DoB      string `json:"date_of_birth"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
	AboutMe  string `json:"about_me"`
	Private  bool   `json:"private"`
}

// Used when getting a user
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
	Private   bool   `json:"private"`
	Session   Session
}

type Session struct {
	ID        int
	UserID    int
	SessionID string
}

func (s *Session) Generate() error {
	suuid, err := uuid.NewV4()
	if err != nil {
		log.Println("Failed to generate UUID", err)
		return err
	}
	s.SessionID = suuid.String()
	return nil
}

func UserFromSession(session string) (User, error) {
	for _, user := range Users {
		if user.Session.SessionID == session {
			return user, nil
		}
	}
	return User{}, errors.New("invalid session")
}

// Validate the input data when creating/registering a new user
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
	if !avatarReqEx.MatchString(u.Avatar) && u.Avatar != "" {
		return errors.New("invalid avatar")
	}
	// Validate the about me using regex
	// Preferred RegEx = ^((?!(<script)|(on.*=))[a-zA-Z0-9.,!?<>_%:+\- \n]){0,255}$ but golang regex doesn't support lookaheads
	var aboutMeReqEx = regexp.MustCompile(`^[a-zA-Z0-9.,!?="'€$#_%+\-]{0,255}$`)
	if !aboutMeReqEx.MatchString(u.AboutMe) {
		return errors.New("invalid about me")
	}
	return nil
}

func (u User) Exists() bool {
	var query = "SELECT id FROM users WHERE email = ?"
	db.DB.QueryRow(query, u.Email).Scan(&u.ID)
	// Check if the user exists
	return u.ID != 0
}

// Register a new user (insert into the database)
func (u NewUser) Register() error {
	var usr = User{Email: u.Email}
	if usr.Exists() {
		return errors.New("an account using this email already exists")
	}
	// Hash the password using bcrypt
	var hashedPassword, err = bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	var query = "INSERT INTO users (email, fname, lname, password, dob, nickname, avatar, about, private) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
	_, err = db.DB.Exec(query, u.Email, u.FName, u.LName, hashedPassword, u.DoB, u.Nickname, u.Avatar, u.AboutMe, u.Private)
	if err != nil {
		return err
	}
	return nil
}

func (u User) Login(password string) error {
	var query = "SELECT id, password FROM users WHERE email = ?"
	var hashedPassword string
	db.DB.QueryRow(query, u.Email).Scan(&u.ID, &hashedPassword)
	if u.ID == 0 {
		return errors.New("an account using this email doesn't exist")
	}
	// Compare the passwords
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return errors.New("invalid password")
	}
	err = u.Get()
	if err != nil {
		return err
	}
	// Generate a new session
	var session = Session{ID: len(Users), UserID: u.ID}
	err = session.Generate()
	if err != nil {
		return err
	}
	// Add the user to the list of logged in users
	Users[u.ID] = u
	return nil
}

func (u User) Logout() error {
	delete(Users, u.ID)
	return nil
}

// Get a user from the database
func (u User) Get() error {
	var query = "SELECT id, email, fname, lname, dob, nickname, avatar, about, created_at, updated_at, private FROM users WHERE id = ?"
	err := db.DB.QueryRow(query, u.ID).Scan(&u.ID, &u.Email, &u.FName, &u.LName, &u.DoB, &u.Nickname, &u.Avatar, &u.AboutMe, &u.CreatedAt, &u.UpdatedAt, &u.Private)
	if err != nil {
		return err
	}
	return nil
}

// Update a user in the database
func (u User) Update() error {
	var query = "UPDATE users SET fname = ?, lname = ?, dob = ?, nickname = ?, avatar = ?, about = ?, private = ? WHERE id = ?"
	_, err := db.DB.Exec(query, u.FName, u.LName, u.DoB, u.Nickname, u.Avatar, u.AboutMe, u.Private, u.ID)
	if err != nil {
		return err
	}
	return nil
}

// Delete a user from the database
func (u User) Delete() error {
	var query = "DELETE FROM users WHERE id = ?"
	_, err := db.DB.Exec(query, u.ID)
	if err != nil {
		return err
	}
	return nil
}

// Get all the users from the database
func GetAllUsers() ([]User, error) {
	var query = "SELECT id, email, fname, lname, dob, nickname, avatar, about, created_at, updated_at, private FROM users"
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	var users []User
	defer rows.Close()
	for rows.Next() {
		var u User
		err := rows.Scan(&u.ID, &u.Email, &u.FName, &u.LName, &u.DoB, &u.Nickname, &u.Avatar, &u.AboutMe, &u.CreatedAt, &u.UpdatedAt, &u.Private)
		if err != nil {
			return users, err
		}
		users = append(users, u)
	}
	return users, nil
}
