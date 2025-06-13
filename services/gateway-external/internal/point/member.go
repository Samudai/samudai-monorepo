package point

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
	"github.com/Samudai/service-point/pkg/point"
)

type GetByDiscordUserIDResp struct {
	Member point.Member `json:"member"`
}

func GetByDiscordUserID(discordUserID string) (point.Member, error) {
	url := fmt.Sprintf("%s/member/fetch", pointService)
	var Member point.Member

	fmt.Println("Fetching member by discord user id", discordUserID)
	params := point.FetchMemberParams{
		Type:          point.FetchMemberTypeDiscord,
		DiscordUserID: &discordUserID,
	}
	respBody, err := requester.Post(url, params)
	if err != nil {
		return Member, err
	}

	var resp GetByDiscordUserIDResp
	err = json.Unmarshal(respBody, &resp)
	if err != nil {
		return Member, err
	}

	return resp.Member, nil
}

func GetByDiscordUserIDArray(discordUserIds []string) ([]string, error) {
	url := fmt.Sprintf("%s/member/fetchbulkbydiscord", pointService)

	params := map[string]interface{}{
		"discord_user_ids": discordUserIds,
	}
	respBody, err := requester.Post(url, params)
	if err != nil {
		return []string{}, err
	}

	var resp []string
	err = json.Unmarshal(respBody, &resp)
	if err != nil {
		return []string{}, err
	}

	return resp, nil
}

func AddPointMembers(pointID string, members []discord.PointMember) error {
	var pointMembers []point.PointMember
	var pointMemberRoleDiscords []point.MemberRoleDiscord
	for _, discordMember := range members {
		Member, err := GetByDiscordUserID(discordMember.UserID)
		if err != nil {
			logger.LogMessage("error", "member not found: %v", err)
			continue
		}
		pointMember := point.PointMember{
			MemberID:  Member.MemberID,
			PointID:   pointID,
			Points:    discordMember.PointsNum,
			CreatedAt: discordMember.JoinedAt,
		}
		pointMembers = append(pointMembers, pointMember)

		pointMemberRoleDiscord := point.MemberRoleDiscord{
			PointID:        pointID,
			MemberID:       Member.MemberID,
			DiscordRoleIDs: discordMember.Roles,
		}
		pointMemberRoleDiscords = append(pointMemberRoleDiscords, pointMemberRoleDiscord)
	}

	url := fmt.Sprintf("%s/member/mapdiscordbulk", pointService)
	params := point.MapDiscordBulkParams{
		Members:            pointMembers,
		DiscordMemberRoles: pointMemberRoleDiscords,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddPointMemberDiscord(discordMember discord.PointMember) error {
	Point, err := GetPointByGuildID(discordMember.GuildID)
	if err != nil {
		return err
	}

	Member, err := GetByDiscordUserID(discordMember.UserID)
	if err != nil {
		if err.Error() == "member not found" || err.Error() == "internal server error" {
			return nil
		}
		return err
	}
	pointMember := point.PointMember{
		MemberID:  Member.MemberID,
		PointID:   Point.PointID,
		Points:    discordMember.PointsNum,
		CreatedAt: discordMember.JoinedAt,
	}

	pointMembers := []point.PointMember{pointMember}

	pointMemberRoleDiscord := point.MemberRoleDiscord{
		PointID:        Point.PointID,
		MemberID:       Member.MemberID,
		DiscordRoleIDs: discordMember.Roles,
	}
	pointMemberRoleDiscords := []point.MemberRoleDiscord{pointMemberRoleDiscord}

	url := fmt.Sprintf("%s/member/mapdiscordbulk", pointService)
	params := map[string]interface{}{
		"members":          pointMembers,
		"dao_member_roles": pointMemberRoleDiscords,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func GetPointId(guildID string) (string, error) {
	Point, err := GetPointByGuildID(guildID)
	if err != nil {
		return "", err
	}
	return Point.PointID, nil
}

func DeleteMemberPointDiscord(guildID, userID string) error {
	Point, err := GetPointByGuildID(guildID)
	if err != nil {
		return err
	}
	Member, err := GetByDiscordUserID(userID)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/member/delete/%s/%s", pointService, Point.PointID, Member.MemberID)

	_, err = requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}

func UpdatePointMemberRoles(discordMember discord.PointMember, oldRoles, newRoles []string) error {
	Point, err := GetPointByGuildID(discordMember.GuildID)
	if err != nil {
		return err
	}
	Member, err := GetByDiscordUserID(discordMember.UserID)
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
		url := fmt.Sprintf("%s/memberrole/creatediscord", pointService)
		params := map[string]interface{}{
			"dao_member_roles": []point.MemberRoleDiscord{
				{
					PointID:        Point.PointID,
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
		url := fmt.Sprintf("%s/memberrole/deletediscord", pointService)
		params := map[string]interface{}{
			"dao_member_roles": []point.MemberRoleDiscord{
				{
					PointID:        Point.PointID,
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

// Telegram

func AddTelegramPoint(telegram point.Telegram) error {
	url := fmt.Sprintf("%s/telegram/add", pointService)

	params := map[string]interface{}{
		"telegram": telegram,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}