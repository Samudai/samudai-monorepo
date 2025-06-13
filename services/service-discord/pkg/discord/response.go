package discord

import "time"

type GuildForMember struct {
	UserID        string     `json:"id" bson:"discord_user_id"`
	Bot           bool       `json:"bot" bson:"bot"`
	Username      string     `json:"username" bson:"username"`
	Discriminator string     `json:"discriminator" bson:"discriminator"`
	Avatar        *string    `json:"avatar" bson:"avatar"`
	GuildID       string     `json:"guild_id" bson:"guild_id"`
	JoinedAt      *time.Time `json:"joined_at" bson:"joined_at"`
	Nickname      *string    `json:"nickname" bson:"nickname"`
	Roles         []string   `json:"roles" bson:"roles"`
	Guilds        []Guild    `json:"guildlist" bson:"guildlist"`
}

type GuildForMemberPoint struct {
	UserID        string     `json:"id" bson:"discord_user_id"`
	Bot           bool       `json:"bot" bson:"bot"`
	Username      string     `json:"username" bson:"username"`
	Discriminator string     `json:"discriminator" bson:"discriminator"`
	Avatar        *string    `json:"avatar" bson:"avatar"`
	GuildID       string     `json:"guild_id" bson:"guild_id"`
	JoinedAt      *time.Time `json:"joined_at" bson:"joined_at"`
	Nickname      *string    `json:"nickname" bson:"nickname"`
	Roles         []string   `json:"roles" bson:"roles"`
	PointsNum     float64    `json:"points_num" bson:"points_num"`
	Guilds        []Guild    `json:"guildlist" bson:"guildlist"`
}
