package point

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
	"github.com/Samudai/service-point/pkg/point"
)

func CreatePointAccesses(pointID string, roles []discord.Role) error {
	var admins, view []string
	for _, role := range roles {
		perm, err := strconv.Atoi(role.Permissions)
		if err != nil {
			return err
		}
		if (perm&(1<<3)) == 8 || (perm&32) == 32 {
			admins = append(admins, role.RoleID)
		} else {
			view = append(view, role.RoleID)
		}
	}

	url := fmt.Sprintf("%s/access/updatediscord", pointService)
	params := point.CreateAccessesParam{
		Admin:   admins,
		View:    view,
		PointID: pointID,
	}
	_, err := requester.Post(url, params)
	if err != nil {

		return err
	}

	return nil
}
func CreateAccess(guildID string, role discord.Role) error {
	Point, err := GetPointByGuildID(guildID)
	if err != nil {
		return err
	}

	perm, err := strconv.Atoi(role.Permissions)
	if err != nil {
		return err
	}

	var access point.AccessType
	if (perm&(1<<3)) == 8 || (perm&32) == 32 {
		access = point.AccessTypeMember
	} else {
		access = point.AccessTypeAdmin
	}

	url := fmt.Sprintf("%s/access/addrolediscord", pointService)
	params := point.AddRoleDiscordParam{
		Access:        string(access),
		PointID:       Point.PointID,
		DiscordRoleID: role.RoleID,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

type AddGetAccessForMemberByGuildIDParams struct {
	GuildID       string `json:"guild_id" binding:"required"`
	DiscordUserID string `json:"discord_user_id" binding:"required"`
}

type MemberAccessInfo struct {
	Access  []string `json:"access"`
	Name    string   `json:"name"`
	PointID string   `json:"point_id"`
}

func GetAccessForMemberByGuildID(guildID string, discordUserId string) (*MemberAccessInfo, error) {
	url := fmt.Sprintf("%s/access/formemberbyguildid", pointService)
	params := AddGetAccessForMemberByGuildIDParams{
		GuildID:       guildID,
		DiscordUserID: discordUserId,
	}
	respBody, err := requester.Post(url, params)
	if err != nil {
		return nil, err
	}

	var memberAccessInfo MemberAccessInfo
	if err := json.Unmarshal(respBody, &memberAccessInfo); err != nil {
		return nil, err
	}

	return &memberAccessInfo, nil
}
