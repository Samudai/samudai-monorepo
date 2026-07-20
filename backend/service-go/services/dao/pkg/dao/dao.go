package dao

import "time"

type DAOType string

const (
	DAOTypeGeneral DAOType = "general"
)

// DAO represents a DAO.
type DAO struct {
	DAOID      string  `json:"dao_id"`
	Name       string  `json:"name"`
	GuildID    string  `json:"guild_id"`
	Onboarding bool    `json:"onboarding"`
	OwnerID    *string `json:"owner_id"`
	DAOType    DAOType `json:"dao_type"`

	About           *string `json:"about"`
	ProfilePicture  *string `json:"profile_picture"`
	ContractAddress *string `json:"contract_address"`
	Snapshot        *string `json:"snapshot"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`

	Tags                []string `json:"tags"`
	OpenToCollaboration bool     `json:"open_to_collaboration"`
	POCMemberID         *string  `json:"poc_member_id"`
	JoinDAOLink         *string  `json:"join_dao_link"`
}

// Member represents a DAO member
type Member struct {
	DAOID    string `json:"dao_id"`
	MemberID string `json:"member_id"`

	CreatedAt *time.Time `json:"created_at"`
}

// Role represents a DAO role
type Role struct {
	DAOID         string `json:"dao_id,omitempty"`
	RoleID        string `json:"role_id"`
	Name          string `json:"name"`
	DiscordRoleID string `json:"discord_role_id,omitempty"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

// MemberRole represents a DAO member's role.
type MemberRole struct {
	DAOID    string `json:"dao_id"`
	MemberID string `json:"member_id"`
	RoleID   string `json:"role_id"`
}

// MemberRoleDiscord is a DAOMemberRole with a DiscordRoleID
type MemberRoleDiscord struct {
	DAOID          string   `json:"dao_id"`
	MemberID       string   `json:"member_id"`
	DiscordRoleIDs []string `json:"discord_role_id"`
}

type DAOView struct {
	DAOID      string  `json:"dao_id"`
	GuildID    string  `json:"guild_id"`
	Name       string  `json:"name"`
	Onboarding bool    `json:"onboarding"`
	DAOType    DAOType `json:"dao_type"`

	About           *string `json:"about"`
	OwnerID         *string `json:"owner_id"`
	ProfilePicture  *string `json:"profile_picture"`
	ContractAddress *string `json:"contract_address"`
	Snapshot        *string `json:"snapshot"`

	Members                []IMember               `json:"members"`
	MembersProfilePictures []string                `json:"members_profile_pictures,omitempty"`
	MembersCount           int                     `json:"members_count,omitempty"`
	Roles                  []Role                  `json:"roles"`
	Departments            []Department            `json:"department"`
	Socials                []Social                `json:"socials"`
	Tokens                 []Token                 `json:"tokens"`
	TokenGating            bool                    `json:"token_gating"`
	Subscription           DaoSubscriptionResponse `json:"subscription"`
	SubscriptionCount      int                     `json:"subscription_count"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`

	Tags                 []string             `json:"tags"`
	OpenToCollaboration  bool                 `json:"open_to_collaboration"`
	POCMember            IMember              `json:"poc_member"`
	JoinDAOLink          *string              `json:"join_dao_link"`
	DaoCollaborationPass DaoCollaborationPass `json:"collaboration_pass"`
	Collaborations       []Collaborations     `json:"collaborations"`
}

type DaoCollaborationPass struct {
	CollaborationPassID string `json:"collaboration_pass_id"`
	Claimed             bool   `json:"claimed"`
}

type Collaborations struct {
	CollaborationsID string  `json:"collaboration_id"`
	DAOID            string  `json:"dao_id"`
	Name             string  `json:"name"`
	ProfilePicture   *string `json:"profile_picture"`
}

type SubdomainInfo struct {
	DAOID            string  `json:"dao_id"`
	SubdomainClaimed string  `json:"subdomain_claimed"`
	ProviderAddress  *string `json:"provider_address"`
	Approved         bool    `json:"approved"`
}

type SnapshotInfo struct {
	DAOID    string  `json:"dao_id"`
	Snapshot *string `json:"snapshot"`
}

// Invite represents an invitation to a DAO.
type Invite struct {
	ID         int        `json:"id"`
	DAOID      string     `json:"dao_id"`
	CreatedBy  string     `json:"created_by"`
	InviteCode *string    `json:"invite_code"`
	ValidUntil *time.Time `json:"valid_until"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type Redeem struct {
	ID         int    `json:"id"`
	InviteCode string `json:"invite_code"`
	MemberID   string `json:"member_id"`
	Redeemed   bool   `json:"redeemed"`

	CreatedAt time.Time `json:"created_at"`
}

type Subdomain struct {
	SubdomainID     string  `json:"subdomain_id"`
	DaoID           *string `json:"dao_id"`
	Subdomain       *string `json:"subdomain"`
	RedirectionLink string  `json:"redirection_link"`
	Access          bool    `json:"access"`
	WalletAddress   *string `json:"wallet_address"`
	TransactionHash *string `json:"transaction_hash"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type Subscription struct {
	DaoID              *string    `json:"dao_id"`
	MemberID           *string    `json:"member_id"`
	SubscriptionID     *string    `json:"subscription_id"`
	CustomerID         *string    `json:"customer_id"`
	InvoiveId          []*string  `json:"invoive_ids"`
	SubscriptionStatus *string    `json:"subscription_status"`
	Quantity           int        `json:"quantity"`
	CurrentPeriodEnd   *time.Time `json:"current_period_end"`
	CurrentPeriodStart *time.Time `json:"current_period_start"`
	Plan               Plan       `json:"plan"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type Customer struct {
	CustomerID *string         `json:"customer_id"`
	Name       *string         `json:"name"`
	Email      *string         `json:"email"`
	Address    CustomerAddress `json:"address"`
	Phone      *string         `json:"phone"`
}

type CustomerAddress struct {
	City       *string `json:"city"`
	Country    *string `json:"country"`
	Line1      *string `json:"line1"`
	Line2      *string `json:"line2"`
	PostalCode *string `json:"postal_code"`
	State      *string `json:"state"`
}

type Plan struct {
	PlanID        string  `json:"plan_id"`
	Active        bool    `json:"active"`
	Currency      *string `json:"currency"`
	Interval      *string `json:"interval"`
	IntervalCount int     `json:"interval_count"`
}

type DaoSubscriptionResponse struct {
	SubscriptionStatus string      `json:"subscription_status"`
	Quantity           *int        `json:"quantity"`
	CurrentPlan        CurrentPlan `json:"current_plan"`
	Interval           Interval    `json:"interval"`
}

type CurrentPlan struct {
	PriceTier         *string `json:"price_tier"`
	User              int     `json:"users"`
	Project           int     `json:"projects"`
	Forms             int     `json:"forms"`
	ForumMembers      int     `json:"forum_members"`
	ForumHistory      *string `json:"forum_history"`
	Support           *string `json:"support"`
	ChatsJobsBounties *string `json:"chats_jobs_bounties"`
}

type Interval struct {
	Currency      *string `json:"currency"`
	Interval      *string `json:"interval"`
	IntervalCount int     `json:"interval_count"`
}
