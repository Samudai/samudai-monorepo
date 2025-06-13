package member

// Pagination is the pagination param
type Pagination struct {
	Offset *int `json:"offset"`
	Limit  *int `json:"limit"`
}

// CreateMemberParam is the param for CreateMember
type CreateMemberParam struct {
	Member        Member  `json:"member"`
	ChainID       int     `json:"chain_id"`
	WalletAddress string  `json:"wallet_address"`
	InviteCode    *string `json:"invite_code"`
}

type SearchMemberParams struct {
	Query              string    `json:"query"`
	Skills             *[]string `json:"skills"`
	Team               *[]string `json:"team"`
	Tags               *[]string `json:"tags"`
	OpenForOpportunity bool      `json:"open_for_opportunity"`
	OfoFilers          bool      `json:"ofofilter"`
	MemberID           *string    `json:"member_id"`
	Sort               *string    `json:"sort"`
	Pagination
}

type FetchMemberType string

const (
	FetchMemberTypeMemberID FetchMemberType = "member_id"
	FetchMemberTypeDiscord  FetchMemberType = "discord_user_id"
	FetchMemberTypeWallet   FetchMemberType = "wallet_address"
	FetchMemberTypeUsername FetchMemberType = "username"
)

type FetchMemberParams struct {
	Type          FetchMemberType `json:"type" binding:"required"`
	MemberID      *string         `json:"member_id"`
	DiscordUserID *string         `json:"discord_user_id"`
	WalletAddress *string         `json:"wallet_address"`
	Username      *string         `json:"username"`
}

type UpdateMemberFeaturedProjectsParams struct {
	MemberID         string            `json:"member_id"`
	FeaturedProjects []FeaturedProject `json:"featured_projects"`
}
