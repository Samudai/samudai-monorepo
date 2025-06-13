package point

import "time"

// AccessType represents the type of access a DAO has to a member.
type AccessType string

const (
	AccessTypeMember AccessType = "member"
	AccessTypeAdmin  AccessType = "admin"
	AccessTypeOwner  AccessType = "owner"
)

// Access represents a permission for a user to access a DAO.
type Access struct {
	AccessID string     `json:"id"`
	PointID  string     `json:"point_id"`
	Access   AccessType `json:"access"`
	Members  []string   `json:"members"`
	Roles    []string   `json:"roles"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type AccessView struct {
	AccessID string     `json:"id"`
	PointID  string     `json:"point_id"`
	Access   AccessType `json:"access"`
	Members  []IMember  `json:"members"`
	Roles    []string   `json:"roles"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type IMember struct {
	MemberID string `json:"member_id,omitempty"`
	Name     string `json:"name"`
	Email    string `json:"email"`
}

type CreateAccessesParam struct {
	Admin   []string `json:"admin"`
	View    []string `json:"view"`
	PointID string   `json:"point_id"`
}

type AddRoleMemberParam struct {
	PointID  string     `json:"point_id"`
	Access   AccessType `json:"access"`
	MemberID string     `json:"member_id"`
}
type AddRoleDiscordParam struct {
	PointID       string `json:"point_id"`
	Access        string `json:"access"`
	DiscordRoleID string `json:"discord_role_id"`
}
