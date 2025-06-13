package notion

type GetDatabaseParam struct {
	MemberID   string `json:"member_id" binding:"required"`
	DatabaseID string `json:"database_id" binding:"required"`
}
