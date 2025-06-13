package discord

import (
	"encoding/json"
	"fmt"

	point "github.com/Samudai/gateway-external/internal/point"
	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-discord/pkg/discord"
)

func AddMembers(members []discord.Member) error {
	url := fmt.Sprintf("%s/member/addmembers", discordService)

	params := map[string]interface{}{
		"members": members,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddMember(member discord.Member) error {
	members := []discord.Member{member}
	url := fmt.Sprintf("%s/member/addmembers", discordService)

	params := map[string]interface{}{
		"members": members,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateMember(member discord.Member) error {
	url := fmt.Sprintf("%s/member/updatemember", discordService)

	params := map[string]interface{}{
		"member": member,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteMember(guildID, userID string) error {
	url := fmt.Sprintf("%s/member/delete/%s/%s", discordService, guildID, userID)
	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}

// Point

func AddMembersPoint(point_id string, members []discord.PointMember) error {
	url := fmt.Sprintf("%s/point/member/addmembers", discordService)

	params := map[string]interface{}{
		"members":  members,
		"point_id": point_id,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}
func AddDiscordMembersPoint(point_id string, members []discord.PointMember, memberIds []string) error {
	url := fmt.Sprintf("%s/point/member/addDiscordMembers", discordService)

	params := map[string]interface{}{
		"members":    members,
		"point_id":   point_id,
		"member_ids": memberIds,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func AddMemberPoint(member discord.PointMember, memberId string) error {
	Point, err := point.GetPointByGuildID(*member.GuildID)
	if err != nil {
		return err
	}

	members := []discord.PointMember{member}
	url := fmt.Sprintf("%s/point/member/addDiscordMember", discordService)

	params := map[string]interface{}{
		"members":   members,
		"point_id":  Point.PointID,
		"member_id": memberId,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateMemberPoint(member discord.PointMember) error {
	url := fmt.Sprintf("%s/point/member/updatemember", discordService)

	params := map[string]interface{}{
		"member": member,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DeleteMemberPoint(guildID, userID string) error {
	url := fmt.Sprintf("%s/point/member/delete/%s/%s", discordService, guildID, userID)
	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}
func GetLeaderboard(guildID string, page string, limit string) (discord.LeaderBoardRes, error) {
	url := fmt.Sprintf("%s/point/event/getLeaderBoardbyguild/%s/%s/%s", discordService, guildID, page, limit)
	leaderboard, err := requester.Get(url)
	if err != nil {
		return discord.LeaderBoardRes{}, err
	}
	var res struct {
		Board discord.LeaderBoardRes `json:"leaderboard"`
	}
	err = json.Unmarshal(leaderboard, &res.Board)
	if err != nil {
		return discord.LeaderBoardRes{}, err
	}

	return res.Board, nil
}

func GetGuildByGuildidDiscordId(guildID, userID string) ([]discord.GuildForMemberPoint, error) {
	url := fmt.Sprintf("%s/point/discord/guildforuser/%s/%s", discordService, userID, guildID)
	guild, err := requester.Get(url)
	if err != nil {
		return nil, err
	}
	var res struct {
		Guild []discord.GuildForMemberPoint `json:"guild"`
	}
	err = json.Unmarshal(guild, &res.Guild)
	if err != nil {
		return nil, err
	}

	return res.Guild, nil
}
