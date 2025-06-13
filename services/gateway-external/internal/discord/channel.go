package discord

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
)

func AddChannels(channels []discord.Channel) error {
	url := fmt.Sprintf("%s/channel/addchannels", discordService)

	params := map[string]interface{}{
		"channels": channels,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateChannel(channel discord.Channel) error {
	url := fmt.Sprintf("%s/channel/updatechannel", discordService)

	params := map[string]interface{}{
		"channel": channel,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteChannel(guildID, channelID string) error {
	url := fmt.Sprintf("%s/channel/delete/%s/%s", discordService, guildID, channelID)
	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}