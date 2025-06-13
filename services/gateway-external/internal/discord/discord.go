package discord

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
)

func CreateDiscord(guild discord.Guild) error {
	url := fmt.Sprintf("%s/discord/create", discordService)

	params := map[string]interface{}{
		"guild_data": guild,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateDiscord(guild discord.Guild) error {
	url := fmt.Sprintf("%s/discord/update", discordService)

	params := map[string]interface{}{
		"guild_data": guild,
	}
	_, err := requester.Put(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteGuild(guildID string) error {
	url := fmt.Sprintf("%s/discord/delete/%s", discordService, guildID)
	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}

func CreateDiscordPoint(guild discord.Guild) error {
	url := fmt.Sprintf("%s/point/discord/create", discordService)

	params := map[string]interface{}{
		"guild_data": guild,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateDiscordPoint(guild discord.Guild) error {
	url := fmt.Sprintf("%s/point/discord/update", discordService)

	params := map[string]interface{}{
		"guild_data": guild,
	}
	_, err := requester.Put(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteGuildPoint(guildID string) error {
	url := fmt.Sprintf("%s/point/discord/delete/%s", discordService, guildID)
	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}