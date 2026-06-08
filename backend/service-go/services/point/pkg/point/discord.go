package point

// MemberDiscord represents a member's discord information
type MemberDiscord struct {
	MemberID      string  `json:"member_id"`
	DiscordID     string  `json:"discord_user_id"`
	Username      string  `json:"username"`
	Avatar        string  `json:"avatar"`
	Discriminator string  `json:"discriminator"`
	PublicFlags   int     `json:"public_flags,omitempty"`
	Flags         int     `json:"flags,omitempty"`
	Banner        *string `json:"banner,omitempty"`
	BannerColor   *string `json:"banner_color,omitempty"`
	AccentColor   *int    `json:"accent_color,omitempty"`
	Locale        string  `json:"locale"`
	MfaEnabled    bool    `json:"mfa_enabled,omitempty"`
	Verified      bool    `json:"verified,omitempty"`
	Email         string  `json:"email"`
}
