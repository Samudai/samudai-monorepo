package dao

import (
	"errors"
	"fmt"

	"github.com/Samudai/gateway-external/internal/member"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/Samudai/service-discord/pkg/discord"
)

func AddMembers(daoID string, members []discord.Member) error {
	var daoMembers []dao.Member
	var daoMemberRoleDiscords []dao.MemberRoleDiscord
	for _, discordMember := range members {
		Member, err := member.GetByDiscordUserID(discordMember.UserID)
		if err != nil {
			logger.LogMessage("error", "member not found: %v", err)
			continue
		}
		daoMember := dao.Member{
			MemberID:  Member.MemberID,
			DAOID:     daoID,
			CreatedAt: discordMember.JoinedAt,
		}
		daoMembers = append(daoMembers, daoMember)

		daoMemberRoleDiscord := dao.MemberRoleDiscord{
			DAOID:          daoID,
			MemberID:       Member.MemberID,
			DiscordRoleIDs: discordMember.Roles,
		}
		daoMemberRoleDiscords = append(daoMemberRoleDiscords, daoMemberRoleDiscord)
	}

	url := fmt.Sprintf("%s/member/mapdiscordbulk", daoService)
	params := dao.MapDiscordBulkParams{
		Members:            daoMembers,
		DiscordMemberRoles: daoMemberRoleDiscords,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddMemberDiscord(discordMember discord.Member) error {
	DAO, err := getByGuildID(discordMember.GuildID)
	if err != nil {
		return err
	}

	Member, err := member.GetByDiscordUserID(discordMember.UserID)
	if err != nil {
		if err.Error() == "member not found" {
			return nil
		}
		return err
	}
	daoMember := dao.Member{
		MemberID: Member.MemberID,
		DAOID:    DAO.DAOID,
		CreatedAt: discordMember.JoinedAt,
	}

	daoMembers := []dao.Member{daoMember}

	daoMemberRoleDiscord := dao.MemberRoleDiscord{
		DAOID:          DAO.DAOID,
		MemberID:       Member.MemberID,
		DiscordRoleIDs: discordMember.Roles,
	}

	daoMemberRoleDiscords := []dao.MemberRoleDiscord{daoMemberRoleDiscord}

	url := fmt.Sprintf("%s/member/mapdiscordbulk", daoService)
	params := map[string]interface{}{
		"members":          daoMembers,
		"dao_member_roles": daoMemberRoleDiscords,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteMemberDiscord(guildID, userID string) error {
	dao, err := getByGuildID(guildID)
	if err != nil {
		return err
	}
	Member, err := member.GetByDiscordUserID(userID)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/member/delete/%s/%s", daoService, dao.DAOID, Member.MemberID)

	_, err = requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}

func UpdateMemberRoles(discordMember discord.Member, oldRoles, newRoles []string) error {
	DAO, err := getByGuildID(discordMember.GuildID)
	if err != nil {
		return err
	}
	Member, err := member.GetByDiscordUserID(discordMember.UserID)
	if err != nil {
		return errors.New("member not found")
	}

	roles := make(map[string]int, len(oldRoles))
	for _, role := range oldRoles {
		roles[role] = -1
	}

	for _, role := range newRoles {
		if _, ok := roles[role]; ok {
			roles[role] = 0
		} else {
			roles[role] = 1
		}
	}

	var rolesAdded []string
	var rolesRemoved []string
	for role, count := range roles {
		if count > 0 {
			rolesAdded = append(rolesAdded, role)
		} else if count < 0 {
			rolesRemoved = append(rolesRemoved, role)
		}
	}

	if len(rolesAdded) > 0 {
		url := fmt.Sprintf("%s/memberrole/creatediscord", daoService)
		params := map[string]interface{}{
			"dao_member_roles": []dao.MemberRoleDiscord{
				{
					DAOID:          DAO.DAOID,
					MemberID:       Member.MemberID,
					DiscordRoleIDs: rolesAdded,
				},
			},
		}
		_, err := requester.Post(url, params)
		if err != nil {
			return err
		}
	}

	if len(rolesRemoved) > 0 {
		url := fmt.Sprintf("%s/memberrole/deletediscord", daoService)
		params := map[string]interface{}{
			"dao_member_roles": []dao.MemberRoleDiscord{
				{
					DAOID:          DAO.DAOID,
					MemberID:       Member.MemberID,
					DiscordRoleIDs: rolesRemoved,
				},
			},
		}
		_, err := requester.Post(url, params)
		if err != nil {
			return err
		}
	}

	return nil
}
