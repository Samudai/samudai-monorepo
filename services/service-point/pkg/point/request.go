package point

type Pagination struct {
	Offset *int `json:"offset"`
	Limit  *int `json:"limit"`
}