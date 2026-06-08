package point

import "time"

type Point struct {
	PointID string  `json:"point_id"`
	Name    *string `json:"name"`
	GuildID *string `json:"guild_id"`
	Email   *string `json:"email"`
}

type PointView struct {
	ID         int     `json:"id"`
	PointID    string  `json:"point_id"`
	Name       *string `json:"name"`
	GuildID    *string `json:"guild_id"`
	Email      *string `json:"email"`
	ServerName *string `json:"server_name"`
}

type Role struct {
	PointID       string `json:"point_id,omitempty"`
	RoleID        string `json:"role_id"`
	Name          string `json:"name"`
	DiscordRoleID string `json:"discord_role_id,omitempty"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

// MemberRole represents a DAO member's role.
type MemberRole struct {
	PointID  string `json:"point_id,omitempty"`
	MemberID string `json:"member_id"`
	RoleID   string `json:"role_id"`
}

type MemberRoleDiscord struct {
	PointID        string   `json:"point_id"`
	MemberID       string   `json:"member_id"`
	DiscordRoleIDs []string `json:"discord_role_id"`
}

type PointMember struct {
	PointID  string  `json:"point_id"`
	MemberID string  `json:"member_id"`
	Points   float64 `json:"points"`

	CreatedAt *time.Time `json:"created_at"`
}

type ProductMember struct {
	PointID      string `json:"point_id"`
	MemberID     string `json:"member_id"`
	ProductID    string `json:"product_id"`
	UniqueUserID string `json:"unique_user_id"`

	CreatedAt *time.Time `json:"created_at"`
}

type MapDiscordParams struct {
	MemberID string      `json:"member_id"`
	Guilds   []GuildInfo `json:"guild_info"`
}

type GuildInfo struct {
	GuildID      string     `json:"guild_id"`
	DiscordRoles []string   `json:"discord_roles"`
	PointsNum    float64    `json:"points_num"`
	JoinedAt     *time.Time `json:"joined_at"`
}

type UpdatePointsNumParams struct {
	Point    float64 `json:"points"`
	PointID  string  `json:"point_id"`
	MemberID string  `json:"member_id"`
}

type ActivityGuild struct {
	RequestType     string     `json:"requestType" bson:"requestType"`
	IsMember        bool       `json:"isMember" bson:"isMember"`
	MemberID        *string    `json:"member_id" bson:"member_id"`
	ContractAddress *string    `json:"contract_address" bson:"contract_address"`
	WalletAddress   *string    `json:"wallet_address" bson:"wallet_address"`
	Topic           *string    `json:"topic" bson:"topic"`
	GuildID         *string    `json:"guild_id" bson:"guild_id"`
	GuildName       *string    `json:"guild_name" bson:"guild_name"`
	From            *string    `json:"from" bson:"from"`
	FromUsername    *string    `json:"from_username"`
	To              *string    `json:"to" bson:"to"`
	ToUsername      *string    `json:"to_username"`
	Points          float64    `json:"points" bson:"points"`
	Description     string     `json:"description" bson:"description"`
	PointId         string     `json:"point_id" bson:"point_id"`
	PointName       *string    `json:"point_name" bson:"point_name"`
	CreatedAt       *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

type ActivityWallet struct {
	RequestType     string     `json:"requestType" bson:"requestType"`
	ContractAddress string     `json:"contract_address" bson:"contract_address"`
	WalletAddress   string     `json:"wallet_address" bson:"wallet_address"`
	Points          float64    `json:"points" bson:"points"`
	Description     string     `json:"description" bson:"description"`
	Topic           string     `json:"topic" bson:"topic"`
	PointId         string     `json:"point_id" bson:"point_id"`
	PointName       *string    `json:"point_name" bson:"point_name"`
	IsMember        bool       `json:"isMember" bson:"isMember"`
	MemberId        *string    `json:"member_id" bson:"member_id"`
	CreatedAt       *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

type ActivityCustom struct {
	RequestType         string     `json:"requestType" bson:"requestType"`
	Points              float64    `json:"points" bson:"points"`
	PointId             string     `json:"point_id" bson:"point_id"`
	ProductId           string     `json:"product_id" bson:"product_id"`
	EventName           string     `json:"event_name" bson:"event_name"`
	PointName           *string    `json:"point_name" bson:"point_name"`
	ProductName         *string    `json:"product_name" bson:"product_name"`
	UniqueUserId        string     `json:"unique_user_id" bson:"unique_user_id"`
	ReferreUniqueUserId *string    `json:"refree_unique_user_id" bson:"refree_unique_user_id"`
	IsMember            bool       `json:"isMember" bson:"isMember"`
	MemberId            *string    `json:"member_id" bson:"member_id"`
	CreatedAt           *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

type ActivityTelegram struct {
	RequestType        string     `json:"requestType" bson:"requestType"`
	Points             *float64   `json:"points" bson:"points"`
	PointId            *string    `json:"point_id" bson:"point_id"`
	EventName          string     `json:"event_name" bson:"event_name"`
	GroupChatId        string     `json:"group_chat_id" bson:"group_chat_id"`
	ChatType           string     `json:"chat_type" bson:"chat_type"`
	ChatName           string     `json:"chat_name" bson:"chat_name"`
	JoineeChatId       *string    `json:"joinee_chat_id" bson:"joinee_chat_id"`
	JoineeFirstName    *string    `json:"joinee_first_name" bson:"joinee_first_name"`
	ToTelegramUsername *string    `json:"to_telegram_username" bson:"to_telegram_username"`
	IsMember           bool       `json:"isMember" bson:"isMember"`
	MemberId           *string    `json:"member_id" bson:"member_id"`
	CreatedAt          *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

type ActivityTwitter struct {
	RequestType         string     `json:"requestType" bson:"requestType"`
	Points              float64    `json:"points" bson:"points"`
	PointId             string     `json:"point_id" bson:"point_id"`
	PointName           *string    `json:"point_name" bson:"point_name"`
	Description         string     `json:"description" bson:"description"`
	TweetId             string     `json:"tweet_id" bson:"tweet_id"`
	FromTwitterUserId   string     `json:"from_twitter_user_id" bson:"from_twitter_user_id"`
	FromTwitterUsername string     `json:"from_twitter_username" bson:"from_twitter_username"`
	ToTwitterUserId     string     `json:"to_twitter_user_id" bson:"to_twitter_user_id"`
	ToTwitterUsername   string     `json:"to_twitter_username" bson:"to_twitter_username"`
	ToTwitterName       string     `json:"to_twitter_name" bson:"to_twitter_name"`
	IsMember            bool       `json:"isMember" bson:"isMember"`
	MemberId            *string    `json:"member_id" bson:"member_id"`
	CreatedAt           *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}
