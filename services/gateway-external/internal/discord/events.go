package discord

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
)

func AddEvents(guildID string, events []discord.Event) error {
	url := fmt.Sprintf("%s/event/add", discordService)

	params := discord.AddEventsParams{
		GuildID: guildID,
		Events:  events,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddEvent(guildID string, event discord.Event) error {
	url := fmt.Sprintf("%s/event/add", discordService)

	events := []discord.Event{event}

	//Using AddEvents to avoid code duplication
	params := discord.AddEventsParams{
		GuildID: guildID,
		Events:  events,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateEvent(guildID string, event discord.Event) error {
	url := fmt.Sprintf("%s/event/update", discordService)

	//Using AddEvents to avoid code duplication
	params := discord.AddEventParams{
		GuildID: guildID,
		Event:   event,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteEvent(eventID string) error {
	url := fmt.Sprintf("%s/event/delete/%s", discordService, eventID)

	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}

func AddUserToEvent(eventID string, user discord.UserData) error {
	url := fmt.Sprintf("%s/event/useradd", discordService)

	params := discord.AddUserToEventParams{
		EventID: eventID,
		User:    user,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func RemoveUserFromEvent(eventID string, userID string) error {
	url := fmt.Sprintf("%s/event/userremove/%s/%s", discordService, eventID, userID)

	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}