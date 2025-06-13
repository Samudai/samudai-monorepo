package member

import "time"

type SearchMemberResponse struct {
	MemberID           string   `json:"member_id"`
	Username           *string  `json:"username"`
	DID                string   `json:"did"`
	PresentRole        *string  `json:"present_role"`
	DomainTagsForWork  []string `json:"domain_tags_for_work"`
	Currency           *string  `json:"currency"`
	HourlyRate         *string  `json:"hourly_rate"`
	OpenForOpportunity bool     `json:"open_for_opportunity"`
	Captain            bool     `json:"captain"`
	// Optional
	Name           *string  `json:"name"`
	Email          *string  `json:"email"`
	Phone          *string  `json:"phone"`
	About          *string  `json:"about"`
	Skills         []string `json:"skills"`
	ProfilePicture *string  `json:"profile_picture"`
	CeramicStream  *string  `json:"ceramic_stream"`
	Subdomain      *string  `json:"subdomain"`
	// Extras
	Discord              MemberDiscord `json:"discord"`
	Wallets              []WalletView  `json:"wallets"`
	DefaultWallet        Wallet        `json:"default_wallet"`
	DefaultWalletAddress string        `json:"default_wallet_address"`

	InviteCode  string   `json:"invite_code,omitempty"`
	InviteCount int      `json:"invite_count"`
	Tags        []string `json:"tags"`

	DaoWorkedProfilePictures []string        `json:"dao_worked_profile_pictures"`
	DaoWorkedCount           int             `json:"dao_worked_count"`
	DaoWorkedWith            []DaoWorkedWith `json:"dao_worked_with"`
	OverDueTasksCount        int             `json:"overdue_tasks_count"`
	OngoingTasksCount        int             `json:"ongoing_tasks_count"`
	TotalTasksTaken          int             `json:"total_tasks_taken"`
	TasksUnderReview         int             `json:"tasks_under_review"`

	CreatedAt    *time.Time `json:"created_at"`
	UpdatedAt    *time.Time `json:"updated_at"`
	IsConnection *string     `json:"isconnection"`
}
