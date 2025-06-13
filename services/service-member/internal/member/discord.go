package member

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-member/pkg/member"
)

func CreateMemberDiscord(memberID string, discord member.MemberDiscord) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO discord (member_id, discord_user_id, username, avatar,
		discriminator, public_flags, flags, banner,
		banner_color, accent_color, locale, mfa_enabled, verified, email)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		`, memberID, discord.DiscordID, discord.Username, discord.Avatar,
		discord.Discriminator, discord.PublicFlags, discord.Flags, discord.Banner,
		discord.BannerColor, discord.AccentColor, discord.Locale, discord.MfaEnabled, discord.Verified, discord.Email)
	if err != nil {
		return fmt.Errorf("error inserting member discord: %w", err)
	}

	logger.LogMessage("info", "Added discord for member ID: %s", memberID)
	return nil
}

func UpdateMemberDiscord(memberID string, discord member.MemberDiscord) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE discord SET username = $1, avatar = $2, discriminator = $3, public_flags = $4, 
		flags = $5, banner = $6, banner_color = $7, accent_color = $8, 
		locale = $9, updated_at = CURRENT_TIMESTAMP WHERE member_id = $10::uuid`, discord.Username, discord.Avatar, discord.Discriminator, discord.PublicFlags,
		discord.Flags, discord.Banner, discord.BannerColor,
		discord.AccentColor, discord.Locale, memberID)
	if err != nil {
		return fmt.Errorf("error updating member discord: %w", err)
	}

	logger.LogMessage("info", "Updated member ID: %s", memberID)
	return nil
}

// DeleteDiscordMemberData deletes discord data of a member
func DeleteDiscordMemberData(memberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM discord WHERE member_id=$1::uuid`, memberID)
	if err != nil {
		return fmt.Errorf("error deleting discord data of member: %w", err)
	}

	logger.LogMessage("info", "Deleted discord data of member ID: %s", memberID)
	return nil
}
