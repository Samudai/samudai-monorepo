package notion

import (
	np "github.com/Samudai/go-notion"
)

type MemberData struct {
	np.AuthResponse
	MemberID string `json:"member_id" bson:"_id"`
}
