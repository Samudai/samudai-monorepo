package dao

import "time"

// Pagination is the pagination param
type Pagination struct {
	Offset *int `json:"offset"`
	Limit  *int `json:"limit"`
}

type CreateAccessesParam struct {
	Admin []string `json:"admin"`
	View  []string `json:"view"`
	DAOID string   `json:"dao_id"`
}

type AddRoleDiscordParam struct {
	DAOID         string `json:"dao_id"`
	Access        string `json:"access"`
	DiscordRoleID string `json:"discord_role_id"`
}

type AddRoleMemberParam struct {
	DAOID         string `json:"dao_id"`
	Access        AccessType `json:"access"`
	MemberID string `json:"member_id"`
}

type MapDiscordParams struct {
	MemberID string      `json:"member_id"`
	Guilds   []GuildInfo `json:"guild_info"`
}

type GuildInfo struct {
	GuildID      string     `json:"guild_id"`
	DiscordRoles []string   `json:"discord_roles"`
	JoinedAt     *time.Time `json:"joined_at"`
}

type MapDiscordBulkParams struct {
	Members            []Member            `json:"members"`
	DiscordMemberRoles []MemberRoleDiscord `json:"dao_member_roles"`
}
