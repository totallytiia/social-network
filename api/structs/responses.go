package structs

type ErrorResponse struct {
	Errors  string      `json:"errors"`
	Details interface{} `json:"details,omitempty"`
}

type OKResponse struct {
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}
