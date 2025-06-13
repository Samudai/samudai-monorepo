package member

import (
	"encoding/json"
	"time"
)

// Member represents a member
type Member struct {
	MemberID           string  `json:"member_id"`
	Username           *string `json:"username"`
	DID                string  `json:"did"`
	PresentRole        *string `json:"present_role"`
	OpenForOpportunity bool    `json:"open_for_opportunity"`
	Captain            bool    `json:"captain"`
	// Optional
	Name              *string  `json:"name"`
	Email             *string  `json:"email"`
	Phone             *string  `json:"phone"`
	About             *string  `json:"about"`
	DomainTagsForWork []string `json:"domain_tags_for_work"`
	Currency          *string  `json:"currency"`
	HourlyRate        *string  `json:"hourly_rate"`
	Skills            []string `json:"skills"`
	ProfilePicture    *string  `json:"profile_picture"`
	CeramicStream     *string  `json:"ceramic_stream"`

	InviteCode string   `json:"invite_code,omitempty"`
	Tags       []string `json:"tags"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type MemberView struct {
	MemberID           string   `json:"member_id"`
	Username           *string  `json:"username"`
	DID                string   `json:"did"`
	OpenForOpportunity bool     `json:"open_for_opportunity"`
	PresentRole        *string  `json:"present_role"`
	DomainTagsForWork  []string `json:"domain_tags_for_work"`
	Currency           *string  `json:"currency"`
	HourlyRate         *string  `json:"hourly_rate"`
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
	FeaturedProjects     []FeaturedProject `json:"featured_projects"`
	Discord              MemberDiscord     `json:"discord"`
	Wallets              []WalletView      `json:"wallets"`
	DefaultWallet        Wallet            `json:"default_wallet"`
	DefaultWalletAddress string            `json:"default_wallet_address"`

	InviteCode  string   `json:"invite_code,omitempty"`
	InviteCount int      `json:"invite_count"`
	Tags        []string `json:"tags"`

	DaoWorkedProfilePictures []string        `json:"dao_worked_profile_pictures"`
	DaoWorkedCount           int             `json:"dao_worked_count"`
	DaoWorkedWith            []DaoWorkedWith `json:"dao_worked_with"`
	OverDueTasksCount        int             `json:"overdue_tasks_count"`
	OngoingTasksCount        int             `json:"ongoing_tasks_count"`
	TotalTasksTaken          int             `json:"total_tasks_taken"`
	TasksUnderReview         int             `json:"pending_admin_reviews"`
	ClosedTask               int             `json:"closed_task"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type IMember struct {
	MemberID       string  `json:"member_id"`
	Username       *string `json:"username"`
	Name           *string `json:"name"`
	Email          *string `json:"email"`
	ProfilePicture *string `json:"profile_picture"`
}

type Telegram struct {
	TelegramID          string  `json:"telegram_id"`
	MemberID            *string `json:"member_id"`
	ChatID              *string `json:"chat_id"`
	Username            *string `json:"username"`
	FirstName           *string `json:"first_name"`
	LastName            *string `json:"last_name"`
	GeneratedTelegramId string  `json:"generated_telegram_id"`
}

type Mobile struct {
	MobileID     string  `json:"mobile_id"`
	MemberID     *string `json:"member_id"`
	MobileOTP    string  `json:"mobile_otp"`
	LinkedStatus bool    `json:"linked_status"`
}

type Subdomain struct {
	SubdomainID     string  `json:"subdomain_id"`
	MemberID        *string `json:"member_id"`
	Subdomain       *string `json:"subdomain"`
	RedirectionLink string  `json:"redirection_link"`
	Access          bool    `json:"access"`
	WalletAddress   *string `json:"wallet_address"`
	TransactionHash *string `json:"transaction_hash"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
type Privy struct {
	MemberID    *string      `json:"member_id"`
	PrivyDID    *string      `json:"privy_did"`
	PrivyEmail  *string      `json:"privy_email"`
	PrivyGoogle *PrivyGoogle `json:"privy_google"`
	PrivyGithub *PrivyGithub `json:"privy_github"`
}

type PrivyGoogle struct {
	Gmail   *string `json:"gmail"`
	Subject *string `json:"subject"`
	Name    *string `json:"name"`
}
type PrivyGithub struct {
	Email    *string `json:"email"`
	Subject  *string `json:"subject"`
	Name     *string `json:"name"`
	Username *string `json:"username"`
}

type WorkProgress struct {
	OverDueTasksCount int             `json:"overdue_tasks_count"`
	OngoingTasksCount int             `json:"ongoing_tasks_count"`
	TotalTasksTaken   int             `json:"total_tasks_taken"`
	TasksUnderReview  int             `json:"pending_admin_reviews"`
	DaoWorkedWith     []DaoWorkedWith `json:"dao_worked_with"`
}

type DaoWorkedWith struct {
	Name           string  `json:"name"`
	ProfilePicture *string `json:"profile_picture"`
}

type FeaturedProject struct {
	Url      string           `json:"url"`
	About    string           `json:"about"`
	MetaData *json.RawMessage `json:"metadata"`
}

type SubdomainInfo struct {
	MemberID           string  `json:"member_id"`
	SubdomainRequested string  `json:"subdomain_requested"`
	WalletAddress      *string `json:"wallet_address"`
	Approved           bool    `json:"approved"`
}

type CoposterUser struct {
	MemberID        string `json:"member_id"`
	CoposterUserID  string `json:"coposter_user_id"`
	SignerUuid      string `json:"signer_uuid"`
	FID             string `json:"fid"`
	IsAuthenticated bool   `json:"is_authenticated"`
}
type XcasterUser struct {
	MemberID string `json:"member_id"`
}

type XcasterUserInfo struct {
	MemberID         string  `json:"member_id"`
	XUsername        *string `json:"x_username"`
	WarpcastUsername *string `json:"warpcast_username"`
}

type UpdateXUser struct {
	MemberID  string `json:"member_id"`
	XUsername string `json:"x_username"`
}
type UpdateWarpcastUser struct {
	MemberID         string `json:"member_id"`
	WarpcastUsername string `json:"warpcast_username"`
}
type Tweet struct {
	TweetID string `json:"tweet_id"`
	Text    string `json:"text"`
}
type TweetInfo struct {
	MemberID string  `json:"member_id"`
	Tweets   []Tweet `json:"tweets"`
}

type Cast struct {
	CastHash string `json:"cast_hash"`
	Text     string `json:"text"`
}
type CastInfo struct {
	MemberID string `json:"member_id"`
	Casts    []Cast `json:"casts"`
}
