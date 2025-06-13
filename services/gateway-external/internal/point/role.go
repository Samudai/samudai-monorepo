package point

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
	"github.com/Samudai/service-point/pkg/point"
)

func AddPointRoles(pointID string, roles []discord.Role) error {
	var pointroles []point.Role
	for _, role := range roles {
		pointrole := parseDiscordPointRoles(pointID, role)
		pointroles = append(pointroles, pointrole)
	}

	url := fmt.Sprintf("%s/role/createbulk", pointService)
	params := map[string]interface{}{
		"roles": pointroles,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}
func AddPointRole(guildID string, role discord.Role) error {
	point, err := GetPointByGuildID(guildID)
	if err != nil {
		return err
	}
	pointrole := parseDiscordPointRoles(point.PointID, role)
	url := fmt.Sprintf("%s/role/create", pointService)
	params := map[string]interface{}{
		"role": pointrole,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}
func UpdateDAODiscordRole(guildID string, role discord.Role) error {
	point, err := GetPointByGuildID(guildID)
	if err != nil {
		return err
	}
	pointrole := parseDiscordPointRoles(point.PointID, role)
	url := fmt.Sprintf("%s/role/updatediscord", pointService)
	params := map[string]interface{}{
		"role": pointrole,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func parseDiscordPointRoles(pointID string, role discord.Role) point.Role {
	roleAccess := point.Role{
		Name:          role.Name,
		PointID:       pointID,
		DiscordRoleID: role.RoleID,
	}
	return roleAccess
}
