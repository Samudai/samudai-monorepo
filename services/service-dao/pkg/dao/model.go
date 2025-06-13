package dao

import (
	"encoding/json"
	"time"
)

type MemberDAO struct {
	MemberID   string  `json:"member_id"`
	DAOID      string  `json:"dao_id"`
	Name       string  `json:"name"`
	GuildID    string  `json:"guild_id"`
	Onboarding bool    `json:"onboarding"`
	DAOType    DAOType `json:"dao_type"`

	About          *string `json:"about"`
	ProfilePicture *string `json:"profile_picture"`
	OwnerID        *string `json:"owner_id"`
	Snapshot       *string `json:"snapshot"`

	Roles       []Role   `json:"roles"`
	Access      []string `json:"access"`
	TokenGating bool     `json:"token_gating"`

	DaoCreatedAt        *time.Time `json:"dao_created"`
	DaoUpdatedAt        *time.Time `json:"dao_updated"`
	MemberJoinedAt      *time.Time `json:"member_joined"`
	Tags                []string   `json:"tags"`
	OpenToCollaboration bool       `json:"open_to_collaboration"`
}

type MemberIDAO struct {
	MemberID       string  `json:"member_id"`
	DAOID          string  `json:"dao_id"`
	Name           string  `json:"name"`
	About          *string `json:"about"`
	ProfilePicture *string `json:"profile_picture"`
}

// Social is a social account link for a DAO.
type Social struct {
	ID    int    `json:"id"`
	DAOID string `json:"dao_id"`
	Type  string `json:"type"`
	URL   string `json:"url"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

// Favourite represents a favourite DAO.
type Favourite struct {
	FavouriteID string `json:"favourite_id"`
	MemberID    string `json:"member_id"`
	DAOID       string `json:"dao_id"`

	CreatedAt *time.Time `json:"created_at"`
}

// Department represents a department within a DAO.
type Department struct {
	DepartmentID string `json:"department_id"`
	DAOID        string `json:"dao_id,omitempty"`
	Name         string `json:"name"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

type CollaborationStatus string

const (
	CollaborationStatusPending  CollaborationStatus = "pending"
	CollaborationStatusAccepted CollaborationStatus = "accepted"
	CollaborationStatusRejected CollaborationStatus = "rejected"
)

// Collaboration represents a collaboration between a two DAOs.
type Collaboration struct {
	CollaborationID  string              `json:"collaboration_id"`
	ApplyingMemberID string              `json:"applying_member_id"`
	FromDAOID        string              `json:"from_dao_id"`
	ToDAOID          string              `json:"to_dao_id"`
	Status           CollaborationStatus `json:"status"`
	Title            string              `json:"title"`
	Department       *string             `json:"department"`
	Description      string              `json:"description"`
	Requirements     []string            `json:"requirements"`
	Benefits         string              `json:"benefits"`
	Attachment       *string             `json:"attachment"`
	Scope            string              `json:"scope"`

	ReplyingMemberID *string `json:"replying_member_id"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type CollaborationResponse struct {
	CollaborationID string              `json:"collaboration_id"`
	ApplyingMember  IMember             `json:"applying_member"`
	FromDAOID       string              `json:"from_dao_id"`
	ToDAOID         string              `json:"to_dao_id"`
	Status          CollaborationStatus `json:"status"`
	Title           string              `json:"title"`
	Department      *string             `json:"department"`
	Description     string              `json:"description"`
	Requirements    []string            `json:"requirements"`
	Benefits        string              `json:"benefits"`
	Attachment      *string             `json:"attachment"`
	Scope           string              `json:"scope"`

	ReplyingMember IMember `json:"replying_member"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type CollaborationPass struct {
	CollaborationPassID string     `json:"collaboration_pass_id"`
	DAOID               string     `json:"dao_id"`
	Claimed             bool       `json:"claimed"`
	CreatedAt           *time.Time `json:"created_at"`
	UpdatedAt           *time.Time `json:"updated_at"`
}

type Blog struct {
	BlogID   string           `json:"id"`
	DAOID    string           `json:"dao_id"`
	Link     string           `json:"link"`
	Metadata *json.RawMessage `json:"metadata"`

	CreatedAt *time.Time `json:"created_at"`
}

type Review struct {
	ReviewID string `json:"id"`
	DAOID    string `json:"dao_id"`
	MemberID string `json:"member_id"`
	Content  string `json:"content"`
	Rating   int    `json:"rating"`

	CreatedAt *time.Time `json:"created_at"`
}

type Analytics struct {
	DAOID     string     `json:"dao_id"`
	MemberID  string     `json:"member_id"`
	VisitorIP string     `json:"visitor_ip"`
	Time      *time.Time `json:"time"`
}

type DataPoint struct {
	Date  string `json:"date"`
	Value int    `json:"value"`
}

type Provider struct {
	ID           int    `json:"id"`
	ProviderID   string `json:"provider_id"`
	DAOID        string `json:"dao_id"`
	ProviderType string `json:"provider_type"`
	Address      string `json:"address"`
	CreatedBy    string `json:"created_by"`
	ChainID      int    `json:"chain_id"`
	IsDefault    bool   `json:"is_default"`
	Name         string `json:"name"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
