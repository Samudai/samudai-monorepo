package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Samudai/gateway-external/internal/dao"
	"github.com/Samudai/gateway-external/internal/discord"
	"github.com/Samudai/gateway-external/internal/member"
	"github.com/Samudai/gateway-external/internal/point"
	"github.com/Samudai/samudai-pkg/logger"
	daopkg "github.com/Samudai/service-dao/pkg/dao"
	discordpkg "github.com/Samudai/service-discord/pkg/discord"
	"github.com/gin-gonic/gin"
)

// CreateDAOParams is the params for creating a discord guild
type CreateDAOParams struct {
	GuildData discordpkg.Guild `json:"guild_data" binding:"required"`
}

func CreateDAO(c *gin.Context) {
	var params CreateDAOParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.CreateDiscord(params.GuildData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error creating discord": err.Error()})
		return
	}

	daoID, err := dao.CreateDAO(params.GuildData.ServerName, params.GuildData.GuildID, params.GuildData.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error creating dao": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dao_id": daoID})
}

type LinkDiscordParams struct {
	DaoID     string           `json:"dao_id"`
	GuildData discordpkg.Guild `json:"guild_data" binding:"required"`
}

func LinkDiscord(c *gin.Context) {
	var params LinkDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.CreateDiscord(params.GuildData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error creating discord": err.Error()})
		return
	}

	err = dao.UpdateDAOGuildId(params.DaoID, params.GuildData.GuildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error creating dao": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateDAO(c *gin.Context) {
	var params CreateDAOParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateDiscord(params.GuildData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddOwnerParams struct {
	MemberDiscordID string `json:"member_discord_id" binding:"required"`
	DaoID           string `json:"dao_id"`
}

func AddOwner(c *gin.Context) {
	var params AddOwnerParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	member, err := member.GetByDiscordUserID(params.MemberDiscordID)
	if err != nil {
		logger.LogMessage("error", "User not on Samudai %v", err)
		c.JSON(http.StatusOK, gin.H{"message": "success, fallback"})
		return
	}
	if member.MemberID != "" {
		err = dao.UpdateMemberAccess(params.DaoID, member.MemberID, daopkg.AccessTypeManageDAO)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// AddmembersParams is the params for adding members to a discord guild
type AddMembersParams struct {
	Members []discordpkg.Member `json:"members" binding:"required"`
	DaoID   string              `json:"dao_id"`
}

func AddMembers(c *gin.Context) {
	var params AddMembersParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddMembers(params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.AddMembers(params.DaoID, params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// AddmembersParams is the params for adding member to a discord guild
type AddMemberParams struct {
	Member discordpkg.Member `json:"member" binding:"required"`
}

func AddMember(c *gin.Context) {
	var params AddMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddMember(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.AddMemberDiscord(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateMemberParams struct {
	Member   discordpkg.Member `json:"member" binding:"required"`
	OldRoles []string          `json:"old_roles"`
	NewRoles []string          `json:"new_roles"`
}

func UpdateMember(c *gin.Context) {
	var params UpdateMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateMember(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.UpdateMemberRoles(params.Member, params.OldRoles, params.NewRoles)
	if err != nil {
		if err.Error() == "member not found" {
			c.JSON(http.StatusOK, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteMember(c *gin.Context) {
	guildID := c.Param("guild_id")
	userID := c.Param("user_id")

	err := discord.DeleteMemberPoint(guildID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.DeleteMemberPointDiscord(guildID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type GetInfoParams struct {
	DashboardURL string                   `json:"dashboard_url"`
	LeaderBoard  []discordpkg.LeaderBoard `json:"leaderboard"`
	Points       int64                    `json:"points"`
}

func GetInfo(c *gin.Context) {
	guildID := c.Param("guild_id")
	userID := c.Param("user_id")
	var params GetInfoParams

	pointId, err := point.GetPointId(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	params.DashboardURL = fmt.Sprintf("https://points.samudai.xyz/%s/dashboard", pointId)

	leaderboardRes, err := discord.GetLeaderboard(guildID, "1", "5")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	params.LeaderBoard = leaderboardRes.LeaderBoard

	guild, err := discord.GetGuildByGuildidDiscordId(guildID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if guild != nil {
		params.Points = int64(guild[0].PointsNum)
	}

	c.JSON(http.StatusOK, params)
}

type AddRolesParams struct {
	GuildID string            `json:"guild_id" binding:"required"`
	Roles   []discordpkg.Role `json:"roles" binding:"required"`
	DaoID   string            `json:"dao_id"`
}

func AddRoles(c *gin.Context) {
	var params AddRolesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddRoles(params.GuildID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.AddRoles(params.DaoID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.CreateAccesses(params.DaoID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddRoleParams struct {
	GuildID string          `json:"guild_id" binding:"required"`
	Role    discordpkg.Role `json:"role" binding:"required"`
}

func AddRole(c *gin.Context) {
	var params AddRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddRole(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.AddRole(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateRole(c *gin.Context) {
	var params AddRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateRole(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.UpdateDAODiscordRole(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.CreateAccess(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteRole(c *gin.Context) {
	guildID := c.Param("guild_id")
	roleID := c.Param("role_id")

	err := discord.DeleteRole(guildID, roleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

// AddChannelsParams is the params for adding channels to a discord guild
type AddChannelsParams struct {
	Channels []discordpkg.Channel `json:"channels" binding:"required"`
}

func AddChannels(c *gin.Context) {
	var params AddChannelsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddChannels(params.Channels)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateChannelParams struct {
	Channel discordpkg.Channel `json:"channel" binding:"required"`
}

func UpdateChannel(c *gin.Context) {
	var params UpdateChannelParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateChannel(params.Channel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteChannel(c *gin.Context) {
	guildID := c.Param("guild_id")
	channelID := c.Param("channel_id")

	err := discord.DeleteChannel(guildID, channelID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteGuild(c *gin.Context) {
	guildID := c.Param("guild_id")

	err := discord.DeleteGuild(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddEventParams struct {
	GuildID string           `json:"guild_id" binding:"required"`
	Event   discordpkg.Event `json:"event" binding:"required"`
	DaoID   *string          `json:"dao_id"`
}

func AddEvent(c *gin.Context) {
	var params AddEventParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddEvent(params.GuildID, params.Event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddEventsParams struct {
	GuildID string             `json:"guild_id" binding:"required"`
	Events  []discordpkg.Event `json:"events" binding:"required"`
	DaoID   *string            `json:"dao_id"`
}

func AddEvents(c *gin.Context) {
	var params AddEventsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddEvents(params.GuildID, params.Events)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateEvent(c *gin.Context) {
	var params AddEventParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateEvent(params.GuildID, params.Event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteEvent(c *gin.Context) {
	eventID := c.Param("event_id")

	err := discord.DeleteEvent(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddUserToEventParams struct {
	EventID string              `json:"event_id" binding:"required"`
	User    discordpkg.UserData `json:"user" binding:"required"`
}

func AddUserToEvent(c *gin.Context) {
	var params AddUserToEventParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddUserToEvent(params.EventID, params.User)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func RemoveUserFromEvent(c *gin.Context) {
	eventID := c.Param("event_id")
	userID := c.Param("user_id")

	err := discord.RemoveUserFromEvent(eventID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type LinkDiscordPointsParams struct {
	PointID   string           `json:"point_id"`
	GuildData discordpkg.Guild `json:"guild_data" binding:"required"`
}

func LinkDiscordPoints(c *gin.Context) {
	var params LinkDiscordPointsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.CreateDiscordPoint(params.GuildData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error creating discord": err.Error()})
		return
	}

	err = point.UpdatePointGuildId(params.PointID, params.GuildData.GuildID, params.GuildData.ServerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error updating point": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddPointRolesParams struct {
	GuildID string            `json:"guild_id" binding:"required"`
	Roles   []discordpkg.Role `json:"roles" binding:"required"`
	PointID string            `json:"point_id"`
}

func AddPointRoles(c *gin.Context) {
	var params AddPointRolesParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddRolesPoint(params.GuildID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.AddPointRoles(params.PointID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.CreatePointAccesses(params.PointID, params.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddPointRoleParams struct {
	GuildID string          `json:"guild_id" binding:"required"`
	Role    discordpkg.Role `json:"role" binding:"required"`
	PointID string          `json:"point_id"`
}

func AddRolePoints(c *gin.Context) {
	var params AddPointRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddRolePoint(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.AddPointRole(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func UpdateRolePoints(c *gin.Context) {
	var params AddPointRoleParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateRolePoint(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	err = point.UpdateDAODiscordRole(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.CreateAccess(params.GuildID, params.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
func DeleteRolePoints(c *gin.Context) {
	guildID := c.Param("guild_id")
	roleID := c.Param("role_id")

	err := discord.DeleteRolePoint(guildID, roleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddPointMembersParams struct {
	Members []discordpkg.PointMember `json:"members" binding:"required"`
	PointID string                   `json:"point_id"`
}

func AddPointMembers(c *gin.Context) {
	var params AddPointMembersParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var discordIds []string
	for i := 0; i < len(params.Members); i++ {
		discordIds = append(discordIds, params.Members[i].UserID)
	}

	MemberIds, err := point.GetByDiscordUserIDArray(discordIds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = discord.AddDiscordMembersPoint(params.PointID, params.Members, MemberIds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.AddPointMembers(params.PointID, params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddPointMemberParams struct {
	Member discordpkg.PointMember `json:"member" binding:"required"`
}

func AddPointMember(c *gin.Context) {
	var params AddPointMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var MemberId string
	Member, err := point.GetByDiscordUserID(params.Member.UserID)
	if err != nil {
		if err.Error() == "member not found" || err.Error() == "internal server error" {
			MemberId = ""
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		MemberId = Member.MemberID
	}
	err = discord.AddMemberPoint(params.Member, MemberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.AddPointMemberDiscord(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdatePointMemberParams struct {
	Member   discordpkg.PointMember `json:"member" binding:"required"`
	OldRoles []string               `json:"old_roles"`
	NewRoles []string               `json:"new_roles"`
}

func UpdatePointMember(c *gin.Context) {
	var params UpdatePointMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateMemberPoint(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.UpdatePointMemberRoles(params.Member, params.OldRoles, params.NewRoles)
	if err != nil {
		if err.Error() == "member not found" {
			c.JSON(http.StatusOK, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type AddGetAccessForMemberByGuildIDParams struct {
	GuildID       string `json:"guild_id" binding:"required"`
	DiscordUserID string `json:"discord_user_id" binding:"required"`
}

func GetAccessForMemberByGuildID(c *gin.Context) {
	var params AddGetAccessForMemberByGuildIDParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	access, err := point.GetAccessForMemberByGuildID(params.GuildID, params.DiscordUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access": access})
}

func GetLeaderboardForGuild(c *gin.Context) {
	guildID := c.Param("guild_id")
	page := c.Param("page")
	limit := c.Param("limit")

	leaderboard, err := discord.GetLeaderboard(guildID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, leaderboard)
}

type ActivityGuild struct {
	RequestType     string     `json:"requestType" bson:"requestType"`
	IsMember        bool       `json:"isMember" bson:"isMember"`
	MemberID        *string    `json:"member_id" bson:"member_id"`
	ContractAddress *string    `json:"contract_address" bson:"contract_address"`
	WalletAddress   *string    `json:"wallet_address" bson:"wallet_address"`
	Topic           *string    `json:"topic" bson:"topic"`
	GuildID         *string    `json:"guild_id" bson:"guild_id"`
	GuildName       *string    `json:"guild_name" bson:"guild_name"`
	From            *string    `json:"from" bson:"from"`
	FromUsername    *string    `json:"from_username"`
	To              *string    `json:"to" bson:"to"`
	ToUsername      *string    `json:"to_username"`
	Points          int64      `json:"points" bson:"points"`
	Description     string     `json:"description" bson:"description"`
	PointId         string     `json:"point_id" bson:"point_id"`
	PointName       string     `json:"point_name" bson:"point_name"`
	CreatedAt       *time.Time `bson:"created_at,omitempty" json:"created_at,omitempty"`
}

func AddPointsNum(c *gin.Context) {
	var params ActivityGuild
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	params.RequestType = "DiscordTip"
	// Member, err := point.GetByDiscordUserID(*params.To)
	// if err != nil {
	// 	if err.Error() == "member not found" || err.Error() == "internal server error" {
	// 		params.IsMember = false
	// 	} else {
	// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// } else {
	// 	params.IsMember = true
	// 	params.MemberID = &Member.MemberID
	// }
	jsonData, err := json.Marshal(params)
	if err != nil {
		panic(err)
	}
	jsonString := string(jsonData)
	HandleExchangeReq(jsonString)
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
