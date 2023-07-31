package structs

type Notification struct {
	ID         int    `json:"id"`
	UserID     int    `json:"user_id"`
	FollowerID int    `json:"follower_id"`
	Message    string `json:"message"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}
