package discord

import (
	"fmt"
	"strconv"

	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discord/pkg/discord"
)

func GetGuildAdmin(token discord.DiscordAccessToken, memberID string) ([]Guild, error) {
	var result []Guild
	newToken, err := getRefreshToken(token)
	if err != nil {
		return result, err
	}

	if newToken.Accesstoken == "" {
		return result, fmt.Errorf("discord: failed to get access token")
	}
	logger.LogMessage("info", "discord refresh token fetched successfully!")

	data := discord.AuthData{
		MemberID: memberID,
		Token:    *newToken,
	}
	err = SaveAuthData(data)
	if err != nil {
		return result, err
	}

	guilds, err := GetGuilds(*newToken)
	if err != nil {
		return result, err
	}

	// strip out all guilds that the user is not an admin of
	for _, guild := range guilds {
		perm, err := strconv.Atoi(guild.Permissions)
		if err != nil {
			return result, err
		}
		if (perm & (1 << 3)) == 8 || (perm & 32) == 32 {
			result = append(result, guild)
		}
	}

	return result, nil
}

func GetGuildAdminPoint(token discord.DiscordAccessToken, memberID string) ([]Guild, error) {
	var result []Guild
	newToken, err := getRefreshToken(token)
	if err != nil {
		return result, err
	}

	if newToken.Accesstoken == "" {
		return result, fmt.Errorf("discord: failed to get access token")
	}
	logger.LogMessage("info", "discord refresh token fetched successfully!")

	data := discord.AuthData{
		MemberID: memberID,
		Token:    *newToken,
	}
	err = SaveAuthDataPoint(data)
	if err != nil {
		return result, err
	}

	guilds, err := GetGuilds(*newToken)
	if err != nil {
		return result, err
	}

	// strip out all guilds that the user is not an admin of
	for _, guild := range guilds {
		perm, err := strconv.Atoi(guild.Permissions)
		if err != nil {
			return result, err
		}
		if (perm & (1 << 3)) == 8 || (perm & 32) == 32 {
			result = append(result, guild)
		}
	}

	return result, nil
}