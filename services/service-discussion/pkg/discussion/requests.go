package discussion

// Pagination is the pagination param
type Pagination struct {
	Offset *int `json:"offset"`
	Limit  *int `json:"limit"`
}
