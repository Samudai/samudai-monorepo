package member

import "time"

type Clan struct {
	ClanID     string `json:"clan_id"`
	Name       string `json:"name"`
	Visibility string `json:"visibility"`
	Avatar     string `json:"avatar"`
	CreatedBy  string `json:"created_by"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type ClanRole string

const (
	ClanRoleOwner  ClanRole = "owner"
	ClanRoleMember ClanRole = "member"
)

type ClanMember struct {
	ClanID         string   `json:"clan_id,omitempty"`
	MemberID       string   `json:"member_id"`
	Role           ClanRole `json:"role"`
	Username       string   `json:"username"`
	ProfilePicture *string  `json:"profile_picture"`
	Notification   bool     `json:"notification"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
}

type ClanView struct {
	ClanID     string `json:"clan_id"`
	Name       string `json:"name"`
	Visibility string `json:"visibility"`
	Avatar     string `json:"avatar"`
	CreatedBy  string `json:"created_by"`

	Members []ClanMember `json:"members"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

// InviteStatus represents the status of an invitation.
type InviteStatus string

const (
	InviteStatusRevoked  InviteStatus = "revoked"
	InviteStatusPending  InviteStatus = "pending"
	InviteStatusAccepted InviteStatus = "accepted"
	InviteStatusDeclined InviteStatus = "declined"
)

// ClanInvite represents a clan invite for a user.
type ClanInvite struct {
	ID         int          `json:"id"`
	ClanID     string       `json:"clan_id"`
	SenderID   string       `json:"sender_id"`
	InviteCode string       `json:"invite_code"`
	ReceiverID string       `json:"receiver_id"`
	Status     InviteStatus `json:"status"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
