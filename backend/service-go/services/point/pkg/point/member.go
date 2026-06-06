package point

import "time"

type Member struct {
	MemberID              string  `json:"member_id"`
	Name                  *string `json:"name"`
	Email                 *string `json:"email"`
	ChainID               *string `json:"chain_id"`
	WalletAddress         *string `json:"wallet_address"`
	EmailVerified         bool    `json:"email_verified"`
	EmailVerificationCode *string `json:"email_verification_code"`
	IsOnboarded           bool    `json:"is_onboarded"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type FetchMemberType string

const (
	FetchMemberTypeMemberID FetchMemberType = "member_id"
	FetchMemberTypeDiscord  FetchMemberType = "discord_user_id"
	FetchMemberTypeWallet   FetchMemberType = "wallet_address"
)

type FetchMemberParams struct {
	Type          FetchMemberType `json:"type" binding:"required"`
	MemberID      *string         `json:"member_id"`
	DiscordUserID *string         `json:"discord_user_id"`
	WalletAddress *string         `json:"wallet_address"`
}

type MapDiscordBulkParams struct {
	Members            []PointMember       `json:"members"`
	DiscordMemberRoles []MemberRoleDiscord `json:"dao_member_roles"`
}

type MemberPoint struct {
	ID       int     `json:"id"`
	MemberID string  `json:"member_id"`
	PointID  string  `json:"point_id"`
	Name     *string `json:"name"`
	GuildID  *string `json:"guild_id"`
	Email    *string `json:"email"`
	Points   float64 `json:"points"`

	Roles      []Role   `json:"roles"`
	Access     []string `json:"access"`
	ServerName *string  `json:"server_name"`

	PointCreatedAt *time.Time `json:"point_created"`
	PointUpdatedAt *time.Time `json:"point_updated"`
	MemberJoinedAt *time.Time `json:"member_joined"`
}

type MemberView struct {
	ID       int     `json:"id,omitempty"`
	MemberID string  `json:"member_id"`
	PointID  string  `json:"point_id"`
	Name     *string `json:"name,omitempty"`
	GuildID  *string `json:"guild_id,omitempty"`
	Email    *string `json:"email,omitempty"`
	Points   float64 `json:"points,omitempty"`
	Member   IMember `json:"member,omitempty"`

	Roles  []Role   `json:"roles"`
	Access []string `json:"access"`

	PointCreatedAt *time.Time `json:"point_created,omitempty"`
	PointUpdatedAt *time.Time `json:"point_updated,omitempty"`
	MemberJoinedAt *time.Time `json:"member_joined,omitempty"`
}

type Telegram struct {
	TelegramID string  `json:"telegram_id"`
	MemberID   *string `json:"member_id,omitempty"`
	PointID    *string `json:"point_id,omitempty"`
	ChatID     *string `json:"chat_id"`
	ChatType   *string `json:"chat_type"`
	Username   *string `json:"username"`
	FirstName  *string `json:"first_name"`
	LastName   *string `json:"last_name"`
	OTP        string  `json:"otp,omitempty"`
}

type TelegramEvent struct {
	PointID   string    `json:"point_id"`
	PointsNum []float64 `json:"points_num"`
	EventName []string  `json:"event_name"`
}

type TelegramEventView struct {
	PointID   string  `json:"point_id"`
	PointsNum float64 `json:"points_num"`
	EventName string  `json:"event_name"`
}
