package discord

import (
	"encoding/json"
	"time"
)

const (
	DatabaseDiscord               = "discord"
	DatabasePointDiscord          = "pointdiscord"
	DatabasePointDiscordActivity  = "pointdiscord-activity"
	DatabasePointMemberActivity   = "pointmember-activity"
	DatabasePointWalletActivity   = "pointwallet-activity"
	DatabasePointTelegramActivity = "pointtelegram-activity"
	DatabasePointTwitterActivity  = "pointtwitter-activity"
	DatabasePointCustomActivity   = "pointcustom-activity"
	DatabaseGuildMetrics          = "point-guild-metrics"
	DatabaseMember                = "point-memberID"

	CollectionGuilds  = "guilds"
	CollectionMembers = "members"
	CollectionRoles   = "roles"
	CollectionEvents  = "events"
	CollectionAuth    = "auth"
)

type AuthData struct {
	MemberID string             `json:"member_id" bson:"_id"`
	Token    DiscordAccessToken `json:"token" bson:"token"`
}

type DiscordAccessToken struct {
	Accesstoken  string `json:"access_token" bson:"access_token"`
	TokenType    string `json:"token_type" bson:"token_type"`
	ExpiresIn    int    `json:"expires_in" bson:"expires_in"`
	RefreshToken string `json:"refresh_token" bson:"refresh_token"`
	Scope        string `json:"scope" bson:"scope"`
}

// Guild represents a discord guild
type Guild struct {
	GuildID        string     `json:"id" bson:"_id"`
	ServerName     string     `json:"name" bson:"name"`
	Icon           *string    `json:"icon" bson:"icon"`
	Available      bool       `json:"available" bson:"available"`
	Splash         *string    `json:"splash" bson:"splash"`
	Banner         *string    `json:"banner" bson:"banner"`
	Description    *string    `json:"description" bson:"description"`
	MemberCount    int        `json:"member_count" bson:"member_count"`
	JoinedAt       *time.Time `json:"joined_at" bson:"joined_at"`
	MaximumMembers int        `json:"max_members" bson:"max_members"`
	OwnerID        string     `json:"owner_id" bson:"owner_id"`
	Features       []string   `json:"features" bson:"features"`
}

type ActivityGuild struct {
	RequestType         string     `json:"requestType" bson:"requestType"`
	IsMember            bool       `json:"isMember" bson:"isMember"`
	MemberID            *string    `json:"member_id" bson:"member_id"`
	ContractAddress     *string    `json:"contract_address" bson:"contract_address"`
	WalletAddress       *string    `json:"wallet_address" bson:"wallet_address"`
	Topic               *string    `json:"topic" bson:"topic"`
	GuildID             *string    `json:"guild_id" bson:"guild_id"`
	GuildName           *string    `json:"guild_name" bson:"guild_name"`
	From                *string    `json:"from" bson:"from"`
	FromUsername        *string    `json:"from_username"`
	To                  *string    `json:"to" bson:"to"`
	ToUsername          *string    `json:"to_username"`
	Points              float64    `json:"points" bson:"points"`
	Description         string     `json:"description" bson:"description"`
	PointId             string     `json:"point_id" bson:"point_id"`
	ProductId           *string    `json:"product_id" bson:"product_id"`
	ProductName         *string    `json:"product_name" bson:"product_name"`
	EventName           *string    `json:"event_name" bson:"event_name"`
	UniqueUserId        *string    `json:"unique_user_id" bson:"unique_user_id"`
	PointName           *string    `json:"point_name" bson:"point_name"`
	GroupChatId         *string    `json:"group_chat_id" bson:"group_chat_id"`
	ChatType            *string    `json:"chat_type" bson:"chat_type"`
	ChatName            *string    `json:"chat_name" bson:"chat_name"`
	JoineeChatId        *string    `json:"joinee_chat_id" bson:"joinee_chat_id"`
	JoineeFirstName     *string    `json:"joinee_first_name" bson:"joinee_first_name"`
	TweetId             *string    `json:"tweet_id" bson:"tweet_id"`
	FromTwitterUserId   *string    `json:"from_twitter_user_id" bson:"from_twitter_user_id"`
	FromTwitterUsername *string    `json:"from_twitter_username" bson:"from_twitter_username"`
	ToTwitterUserId     *string    `json:"to_twitter_user_id" bson:"to_twitter_user_id"`
	ToTwitterUsername   *string    `json:"to_twitter_username" bson:"to_twitter_username"`
	ToTwitterName       *string    `json:"to_twitter_name" bson:"to_twitter_name"`
	CreatedAt           *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

type ActivityWallet struct {
	RequestType       string     `json:"requestType" bson:"requestType"`
	ContractAddress   string     `json:"contract_address" bson:"contract_address"`
	WalletAddress     string     `json:"wallet_address" bson:"wallet_address"`
	Points            float64    `json:"points" bson:"points"`
	Description       string     `json:"description" bson:"description"`
	Topic             string     `json:"topic" bson:"topic"`
	PointId           string     `json:"point_id" bson:"point_id"`
	PointName         *string    `json:"point_name" bson:"point_name"`
	IsMember          bool       `json:"isMember" bson:"isMember"`
	MemberId          *string    `json:"member_id" bson:"member_id"`
	ChainId           *string    `json:"chain_id" bson:"chain_id"`
	EventNftAddresses *string    `json:"event_nft_address" bson:"event_nft_address"`
	CreatedAt         *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

type ActivityCustom struct {
	RequestType  string     `json:"requestType" bson:"requestType"`
	Points       float64    `json:"points" bson:"points"`
	PointId      string     `json:"point_id" bson:"point_id"`
	ProductId    string     `json:"product_id" bson:"product_id"`
	EventName    string     `json:"event_name" bson:"event_name"`
	PointName    *string    `json:"point_name" bson:"point_name"`
	ProductName  *string    `json:"product_name" bson:"product_name"`
	UniqueUserId string     `json:"unique_user_id" bson:"unique_user_id"`
	IsMember     bool       `json:"isMember" bson:"isMember"`
	MemberId     *string    `json:"member_id" bson:"member_id"`
	CreatedAt    *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
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

type ActivityTelegram struct {
	RequestType     string     `json:"requestType" bson:"requestType"`
	Points          *float64   `json:"points" bson:"points"`
	PointId         *string    `json:"point_id" bson:"point_id"`
	EventName       string     `json:"event_name" bson:"event_name"`
	GroupChatId     string     `json:"group_chat_id" bson:"group_chat_id"`
	ChatType        string     `json:"chat_type" bson:"chat_type"`
	ChatName        string     `json:"chat_name" bson:"chat_name"`
	JoineeChatId    string     `json:"joinee_chat_id" bson:"joinee_chat_id"`
	JoineeFirstName string     `json:"joinee_first_name" bson:"joinee_first_name"`
	IsMember        bool       `json:"isMember" bson:"isMember"`
	MemberId        *string    `json:"member_id" bson:"member_id"`
	CreatedAt       *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}
type ActivityRes struct {
	Total    int64           `json:"total" bson:"total"`
	Activity []ActivityGuild `json:"activity" bson:"activity"`
}

type LeaderBoard struct {
	PointID         string              `json:"point_id" bson:"point_id"`
	Points          float64             `json:"points_num" bson:"points_num"`
	UserID          string              `json:"id" bson:"discord_user_id"`
	Username        string              `json:"username" bson:"username"`
	WalletAddress   []string            `json:"wallet_address" bson:"walletaddress"`
	CustomProducts  *[]CustomProductObj `json:"custom_products" bson:"custom_products"`
	TwitterUserId   *string             `json:"twitter_user_id" bson:"twitter_user_id"`
	TwitterUserName *string             `json:"twitter_user_name" bson:"twitter_user_name"`
	MemberId        string              `json:"member_id" bson:"memberid"`
	MemberName      string              `json:"member_name" bson:"membername"`
	ChatName        *string             `json:"chat_name" bson:"chat_name"`
	JoineeFirstName *string             `json:"joinee_first_name" bson:"joinee_first_name"`
	JoinedAt        *time.Time          `json:"joined_at" bson:"joined_at"`
}
type LeaderBoardRes struct {
	Total       int64         `json:"total" bson:"total"`
	LeaderBoard []LeaderBoard `json:"leaderboard" bson:"leaderboard"`
}

type MetricsData struct {
	PointID            string     `json:"point_id" bson:"point_id"`
	TotalPoints        float64    `json:"total_points_num" bson:"total_points_num"`
	UniquePointHolders int64      `json:"unique_point_holders_num" bson:"unique_point_holders_num"`
	CreatedAt          *time.Time `bson:"created_at" json:"created_at"`
}

// Channel is a struct for the channel object
type Channel struct {
	// GUILD_CATEGORY
	Type                 string          `json:"type"`
	Deleted              bool            `json:"deleted"`
	GuildID              string          `json:"guildId"`
	ParentID             string          `json:"parentId"`
	PermissionOverwrites json.RawMessage `json:"permissionOverwrites"`
	ChannelID            string          `json:"id"`
	Name                 string          `json:"name"`
	RawPosition          int             `json:"rawPosition"`
	// GUILD_TEXT
	NSFW             bool    `json:"nsfw"`
	Topic            *string `json:"topic"`
	LastMessageID    *string `json:"lastMessageId"`
	RateLimitPerUser int     `json:"rateLimitPerUser"`
	// GUILD_VOICE
	RTCRegion *string `json:"rtcRegion"`
	Bitrate   int     `json:"bitrate"`
	UserLimit int     `json:"userLimit"`
}

// Member is a struct for the discord member
type Member struct {
	UserID        string     `json:"id" bson:"discord_user_id"`
	Bot           bool       `json:"bot" bson:"bot"`
	Username      string     `json:"username" bson:"username"`
	Discriminator string     `json:"discriminator" bson:"discriminator"`
	Avatar        *string    `json:"avatar" bson:"avatar"`
	GuildID       string     `json:"guild_id" bson:"guild_id"`
	JoinedAt      *time.Time `json:"joined_at" bson:"joined_at"`
	Nickname      *string    `json:"nickname" bson:"nickname"`
	Roles         []string   `json:"roles" bson:"roles"`
}

type PointMember struct {
	UserID          *string             `json:"id" bson:"discord_user_id"`
	Bot             *bool               `json:"bot" bson:"bot"`
	Username        *string             `json:"username" bson:"username"`
	Discriminator   *string             `json:"discriminator" bson:"discriminator"`
	Avatar          *string             `json:"avatar" bson:"avatar"`
	GuildID         *string             `json:"guild_id" bson:"guild_id"`
	JoinedAt        *time.Time          `json:"joined_at" bson:"joined_at"`
	Nickname        *string             `json:"nickname" bson:"nickname"`
	Roles           []string            `json:"roles" bson:"roles"`
	PointsNum       float64             `json:"points_num" bson:"points_num"`
	PointId         *string             `json:"point_id" bson:"point_id"`
	WalletAddress   *[]string           `json:"wallet_address"`
	MemberID        *string             `json:"member_id"`
	MemberName      *string             `json:"member_name"`
	CustomProducts  *[]CustomProductObj `json:"custom_products" bson:"custom_products"`
	JoineeChatId    *string             `json:"joinee_chat_id" bson:"joinee_chat_id"`
	JoineeFirstName *string             `json:"joinee_first_name" bson:"joinee_first_name"`
	ChatName        *string             `json:"chat_name" bson:"chat_name"`
	TwitterUserId   *string             `json:"twitter_user_id" bson:"twitter_user_id"`
	TwitterUserName *string             `json:"twitter_username" bson:"twitter_user_name"`
	TwitterName     *string             `json:"twitter_name" bson:"twitter_name"`
}

type CustomProductObj struct {
	ProductID    string  `json:"product_id" bson:"product_id"`
	ProductName  *string `json:"product_name" bson:"product_name"`
	UniqueUserId string  `json:"unique_user_id" bson:"unique_user_id"`
}

type PointMemberView struct {
	Id              *string             `json:"_id" bson:"_id"`
	UserID          *string             `json:"id" bson:"discord_user_id"`
	Bot             *bool               `json:"bot" bson:"bot"`
	Username        *string             `json:"username" bson:"username"`
	Discriminator   *string             `json:"discriminator" bson:"discriminator"`
	Avatar          *string             `json:"avatar" bson:"avatar"`
	GuildID         *string             `json:"guild_id" bson:"guild_id"`
	JoinedAt        *time.Time          `json:"joined_at" bson:"joined_at"`
	Nickname        *string             `json:"nickname" bson:"nickname"`
	Roles           []string            `json:"roles" bson:"roles"`
	PointsNum       float64             `json:"points_num" bson:"points_num"`
	PointId         *string             `json:"point_id" bson:"point_id"`
	WalletAddress   *[]string           `json:"wallet_address"`
	MemberID        *string             `json:"member_id"`
	MemberName      *string             `json:"member_name"`
	CustomProducts  *[]CustomProductObj `json:"custom_products" bson:"custom_products"`
	JoineeChatId    *string             `json:"joinee_chat_id" bson:"joinee_chat_id"`
	JoineeFirstName *string             `json:"joinee_first_name" bson:"joinee_first_name"`
	ChatName        *string             `json:"chat_name" bson:"chat_name"`
	TwitterUserId   *string             `json:"twitter_user_id" bson:"twitter_user_id"`
	TwitterUserName *string             `json:"twitter_user_name" bson:"twitter_user_name"`
	TwitterName     *string             `json:"twitter_name" bson:"twitter_name"`
}

type PointMemberType struct {
	PointID  *string `json:"point_id"`
	MemberID *string `json:"member_id"`
	Points   float64 `json:"points"`

	CreatedAt *time.Time `json:"created_at"`
}

type MemberView struct {
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

type IMember struct {
	MemberID string `json:"member_id,omitempty"`
	Name     string `json:"name"`
	Email    string `json:"email"`
}

type ProductResponse struct {
	MemberID    string  `json:"member_id"`
	PointID     string  `json:"point_id"`
	PointsNum   float64 `json:"points_num"`
	ProductName string  `json:"product_name" bson:"product_name"`
}

type ProductResponse1 struct {
	MemberID    string  `json:"member_id"`
	PointID     string  `json:"point_id"`
	ProductName string  `json:"product_name" bson:"product_name"`
}

type TelegramResponse struct {
	MemberID  string  `json:"member_id"`
	PointID   string  `json:"point_id"`
	PointsNum float64 `json:"points_num"`
}

type TwitterResponse struct {
	Points   TwitterPoints `json:"points"`
	MemberID string        `json:"member_id"`
}

type TwitterPoints struct {
	PointID       string   `json:"point_id"`
	TweetID       []string `json:"tweet_id"`
	Follow        int      `json:"follow"`
	Mention       int      `json:"mention"`
	Like          int      `json:"likes"`
	Retweet       int      `json:"retweet"`
	Quote         int      `json:"quote"`
	Hashtag       *string  `json:"hashtag"`
	HashtagPoints int      `json:"hashtag_pts"`
}

// Role is a struct for the discord role
type Role struct {
	RoleID      string   `json:"id" bson:"_id"`
	GuildID     string   `json:"guild_id" bson:"guild_id"`
	Name        string   `json:"name" bson:"name"`
	Color       int      `json:"color" bson:"color"`
	Hoist       bool     `json:"hoist" bson:"hoist"`
	RawPosition int      `json:"raw_position" bson:"raw_position"`
	Permissions string   `json:"permissions" bson:"permissions"`
	Position    int      `json:"position" bson:"position"`
	Managed     bool     `json:"managed" bson:"managed"`
	Mentionable bool     `json:"mentionable" bson:"mentionable"`
	Tags        RoleTags `json:"tags" bson:"tags"`
}

type RoleTags struct {
	BotID                 *string `json:"bot_id" bson:"bot_id"`
	IntegrationID         *string `json:"integration_id" bson:"integration_id"`
	PremiumSubscriberRole bool    `json:"premium_subscriber_role" bson:"premium_subscriber_role"`
}

type EntityMetadata struct {
	Location *string `json:"location" bson:"location"`
}

type UserData struct {
	ID            string  `json:"id" bson:"_id"`
	Bot           *bool   `json:"bot" bson:"bot"`
	Username      *string `json:"username" bson:"username"`
	Discriminator *string `json:"discriminator" bson:"discriminator"`
	Avatar        *string `json:"avatar" bson:"avatar"`
	CreatedAt     string  `json:"created_at" bson:"created_at"`
}

type Event struct {
	ID                      string          `json:"id" bson:"_id"`
	GuildID                 string          `json:"guild_id" bson:"guild_id"`
	ChannelID               *string         `json:"channel_id" bson:"channel_id"`
	CreatorID               *string         `json:"creator_id" bson:"creator_id"`
	Name                    string          `json:"name" bson:"name"`
	Description             *string         `json:"description" bson:"description"`
	ScheduledStartTimestamp *time.Time      `json:"scheduled_start_timestamp" bson:"scheduled_start_timestamp"`
	ScheduledEndTimestamp   *time.Time      `json:"scheduled_end_timestamp" bson:"scheduled_end_timestamp"`
	PrivacyLevel            int             `json:"privacy_level" bson:"privacy_level"`
	Status                  *int            `json:"status" bson:"status"`
	EntityType              *int            `json:"entity_type" bson:"entity_type"`
	EntityID                *string         `json:"entity_id" bson:"entity_id"`
	UserCount               *int            `json:"user_count" bson:"user_count"`
	Creator                 *UserData       `json:"creator" bson:"creator"`
	EntityMetadata          *EntityMetadata `json:"entity_metadata" bson:"entity_metadata"`
	Image                   *string         `json:"image" bson:"image"`
	Users                   []UserData      `json:"users" bson:"users"`
	ExpiresAt               *time.Time      `json:"expires_at" bson:"expiresAt"`
}

type Merge struct {
	UserID        *string   `json:"discord_user_id" bson:"discord_user_id"`
	WalletAddress *[]string `json:"wallet_address"`
	MemberID      *string   `json:"member_id"`
	MemberName    *string   `json:"member_name" bson:"member_name"`
	PointId       *string   `json:"point_id" bson:"point_id"`
}

type MergeMultiple struct {
	MergeType     string    `json:"merge_type" bson:"merge_type"`
	MergeID       *string   `json:"merge_id" bson:"merge_id"`
	UserID        *string   `json:"discord_user_id" bson:"discord_user_id"`
	WalletAddress *[]string `json:"wallet_address"`
	MemberID      *string   `json:"member_id"`
	MemberName    *string   `json:"member_name" bson:"member_name"`
	PointId       []string  `json:"point_id" bson:"point_id"`
}

type MergeType string

const (
	MergeTypeDiscord       MergeType = "discord"
	MergeTypeWallet        MergeType = "wallet"
	MergeTypeCustomProduct MergeType = "customProduct"
	MergeTypeTelegram      MergeType = "telegram"
	MergeTypeTwitter       MergeType = "twitter"
)

type MergeV2 struct {
	MergeType          MergeType `json:"merge_type" bson:"merge_type"`
	WalletMergeAddress *string   `json:"merge_id" bson:"merge_id"`
	DiscordID          *string   `json:"discord_user_id" bson:"discord_user_id"`
	MemberID           string    `json:"member_id"`
	MemberName         *string   `json:"member_name" bson:"member_name"`
	PointId            string    `json:"point_id" bson:"point_id"`
	ProductID          *string   `json:"product_id" bson:"product_id"`
	UniqueUserId       *string   `json:"unique_user_id" bson:"unique_user_id"`
	JoineeChatId       *string   `json:"joinee_chat_id" bson:"joinee_chat_id"`
	TwitterUserId      *string   `json:"twitter_user_id" bson:"twitter_user_id"`
}

type MergeActivityV2 struct {
	MergeType          MergeType `json:"merge_type" bson:"merge_type"`
	WalletMergeAddress *string   `json:"merge_id" bson:"merge_id"`
	DiscordID          *string   `json:"discord_user_id" bson:"discord_user_id"`
	MemberID           string    `json:"member_id"`
	ProductID          *string   `json:"product_id" bson:"product_id"`
	UniqueUserId       *string   `json:"unique_user_id" bson:"unique_user_id"`
	JoineeChatId       *string   `json:"joinee_chat_id" bson:"joinee_chat_id"`
	TwitterUserId      *string   `json:"twitter_user_id" bson:"twitter_user_id"`
}

type MergeMultipleV2 struct {
	MergeType          MergeType `json:"merge_type" bson:"merge_type"`
	WalletMergeAddress *string   `json:"merge_id" bson:"merge_id"`
	DiscordID          *string   `json:"discord_user_id" bson:"discord_user_id"`
	MemberID           string    `json:"member_id"`
	MemberName         *string   `json:"member_name" bson:"member_name"`
	PointIds           []string  `json:"point_id" bson:"point_id"`
	ProductID          *string   `json:"product_id" bson:"product_id"`
	UniqueUserId       *string   `json:"unique_user_id" bson:"unique_user_id"`
	JoineeChatId       *string   `json:"joinee_chat_id" bson:"joinee_chat_id"`
	TwitterUserId      *string   `json:"twitter_user_id" bson:"twitter_user_id"`
}

type NFT struct {
	Status   string      `json:"status"`
	Page     int         `json:"page"`
	PageSize int         `json:"page_size"`
	Cursor   interface{} `json:"cursor"` // Using interface{} because the actual type is null
	Result   []NFTResult `json:"result"`
}

type NFTResult struct {
	Amount                string      `json:"amount"`
	TokenID               string      `json:"token_id"`
	TokenAddress          string      `json:"token_address"`
	ContractType          string      `json:"contract_type"`
	OwnerOf               string      `json:"owner_of"`
	LastMetadataSync      string      `json:"last_metadata_sync"`
	LastTokenURISync      string      `json:"last_token_uri_sync"`
	Metadata              interface{} `json:"metadata"` // Using interface{} because the actual type is null
	BlockNumber           string      `json:"block_number"`
	BlockNumberMinted     interface{} `json:"block_number_minted"` // Using interface{} because the actual type is null
	Name                  string      `json:"name"`
	Symbol                interface{} `json:"symbol"` // Using interface{} because the actual type is null
	TokenHash             string      `json:"token_hash"`
	TokenURI              string      `json:"token_uri"`
	MinterAddress         string      `json:"minter_address"`
	VerifiedCollection    bool        `json:"verified_collection"`
	PossibleSpam          bool        `json:"possible_spam"`
	CollectionLogo        string      `json:"collection_logo"`
	CollectionBannerImage string      `json:"collection_banner_image"`
}
