package discord

// AddRolesParams is the params for adding roles to a discord guild
type AddRolesParams struct {
	GuildID string `json:"guild_id"`
	Roles   []Role `json:"roles"`
}

// UpdateRoleParams is the params for updating roles in a discord guild
type UpdateRoleParams struct {
	GuildID string `json:"guild_id"`
	Role    Role   `json:"role"`
}

type AddEventsParams struct {
	GuildID string  `json:"guild_id"`
	Events  []Event `json:"events"`
}

type AddEventParams struct {
	GuildID string `json:"guild_id"`
	Event   Event  `json:"event"`
}

type AddUserToEventParams struct {
	EventID string   `json:"event_id"`
	User    UserData `json:"user"`
}
