package member

import "time"

type Social struct {
	ID       int    `json:"id"`
	MemberID string `json:"member_id"`
	Type     string `json:"type"`
	URL      string `json:"url"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type Onboarding struct {
	MemberID    string `json:"member_id"`
	Admin       bool   `json:"admin"`
	Contributor bool   `json:"contributor"`

	InviteCode *string `json:"invite_code"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type Review struct {
	ReviewID   string `json:"id"`
	MemberID   string `json:"member_id"`
	ReviewerID string `json:"reviewer_id"`
	Content    string `json:"content"`
	Rating     int    `json:"rating"`

	CreatedAt *time.Time `json:"created_at"`
}

type MemberReviewReponse struct {
	ReviewID   string `json:"id"`
	MemberID   string `json:"member_id"`
	ReviewerID string `json:"reviewer_id"`
	Content    string `json:"content"`
	Rating     int    `json:"rating"`

	CreatedAt *time.Time `json:"created_at"`

	Name           string  `json:"name"`
	Username       *string `json:"username"`
	ProfilePicture *string `json:"profile_picture"`
}

type RewardEarned struct {
	MemberID string  `json:"member_id"`
	DAOID    string  `json:"dao_id"`
	LinkID   string  `json:"link_id"`
	Type     string  `json:"type"`
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
}

type MemberReward struct {
	MemberID string  `json:"member_id"`
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
}
