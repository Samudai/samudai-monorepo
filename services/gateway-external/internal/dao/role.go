package dao

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/Samudai/service-discord/pkg/discord"
)

func AddRoles(daoID string, roles []discord.Role) error {
	var daoroles []dao.Role
	for _, role := range roles {
		daorole := parseDiscordRoles(daoID, role)
		daoroles = append(daoroles, daorole)
	}

	url := fmt.Sprintf("%s/role/createbulk", daoService)
	params := map[string]interface{}{
		"roles": daoroles,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddRole(guildID string, role discord.Role) error {
	dao, err := getByGuildID(guildID)
	if err != nil {
		return err
	}

	daorole := parseDiscordRoles(dao.DAOID, role)
	url := fmt.Sprintf("%s/role/create", daoService)
	params := map[string]interface{}{
		"role": daorole,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateDAODiscordRole(guildID string, role discord.Role) error {
	dao, err := getByGuildID(guildID)
	if err != nil {
		return err
	}

	daorole := parseDiscordRoles(dao.DAOID, role)
	url := fmt.Sprintf("%s/role/updatediscord", daoService)
	params := map[string]interface{}{
		"role": daorole,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func parseDiscordRoles(daoID string, role discord.Role) dao.Role {
	roleAccess := dao.Role{
		Name:          role.Name,
		DAOID:         daoID,
		DiscordRoleID: role.RoleID,
	}
	return roleAccess
}
