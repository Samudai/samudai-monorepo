package dao

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/Samudai/service-discord/pkg/discord"
)

func CreateAccesses(daoID string, roles []discord.Role) error {
	var admins, view []string
	for _, role := range roles {
		perm, err := strconv.Atoi(role.Permissions)
		if err != nil {
			return err
		}
		if (perm & (1 << 3)) == 8 || (perm & 32) == 32 {
			admins = append(admins, role.RoleID)
		} else {
			view = append(view, role.RoleID)
		}
	}

	url := fmt.Sprintf("%s/access/updatediscord", daoService)
	params := dao.CreateAccessesParam{
		Admin: admins,
		View:  view,
		DAOID: daoID,
	}
	_, err := requester.Post(url, params)
	if err != nil {

		return err
	}

	return nil
}

func CreateAccess(guildID string, role discord.Role) error {
	DAO, err := getByGuildID(guildID)
	if err != nil {
		return err
	}

	perm, err := strconv.Atoi(role.Permissions)
	if err != nil {
		return err
	}
	var access dao.AccessType
	if (perm & (1 << 3)) == 8 || (perm & 32) == 32 {
		access = dao.AccessTypeManageDAO
	} else {
		access = dao.AccessTypeView
	}

	url := fmt.Sprintf("%s/access/addrolediscord", daoService)
	params := dao.AddRoleDiscordParam{
		Access:        string(access),
		DAOID:         DAO.DAOID,
		DiscordRoleID: role.RoleID,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateMemberAccess(daoID string, memberID string, access dao.AccessType) error {

	url := fmt.Sprintf("%s/access/addmemberdiscord", daoService)
	params := dao.AddRoleMemberParam{
			Access:	access,
			DAOID:	daoID,
			MemberID: memberID,
	}

	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}



func FetchAccesses(daoID string) ([]dao.Access, error) {

	url := fmt.Sprintf("%s/access/listbydaoid/%s", daoService, daoID)
	
	respBody, err := requester.Get(url)
	if err != nil {
		return nil, err
	}

	var resp []dao.Access
	err = json.Unmarshal(respBody, &resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}