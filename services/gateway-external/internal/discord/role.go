package discord

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
)

func AddRoles(guildID string, roles []discord.Role) error {
	url := fmt.Sprintf("%s/role/addroles", discordService)

	params := discord.AddRolesParams{
		GuildID: guildID,
		Roles:   roles,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddRole(guildID string, role discord.Role) error {
	roles := []discord.Role{role}
	url := fmt.Sprintf("%s/role/addroles", discordService)

	params := discord.AddRolesParams{
		GuildID: guildID,
		Roles:   roles,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateRole(guildID string, role discord.Role) error {
	url := fmt.Sprintf("%s/role/updaterole", discordService)

	params := discord.UpdateRoleParams{
		GuildID: guildID,
		Role:    role,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteRole(guildID string, roleID string) error {
	url := fmt.Sprintf("%s/role/delete/%s/%s", discordService, guildID, roleID)
	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}

// Point

func AddRolesPoint(guildID string, roles []discord.Role) error {
	url := fmt.Sprintf("%s/point/role/addroles", discordService)

	params := discord.AddRolesParams{
		GuildID: guildID,
		Roles:   roles,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddRolePoint(guildID string, role discord.Role) error {
	roles := []discord.Role{role}
	url := fmt.Sprintf("%s/point/role/addroles", discordService)

	params := discord.AddRolesParams{
		GuildID: guildID,
		Roles:   roles,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateRolePoint(guildID string, role discord.Role) error {
	url := fmt.Sprintf("%s/point/role/updaterole", discordService)

	params := discord.UpdateRoleParams{
		GuildID: guildID,
		Role:    role,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteRolePoint(guildID string, roleID string) error {
	url := fmt.Sprintf("%s/point/role/delete/%s/%s", discordService, guildID, roleID)
	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}