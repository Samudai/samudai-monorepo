package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-discord/internal/discord"
	pkg "github.com/Samudai/service-discord/pkg/discord"
	"github.com/gin-gonic/gin"
)

func AddEvent(c *gin.Context) {
	var params pkg.AddEventsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddEvent(params.GuildID, params.Events)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateEvent(c *gin.Context) {
	var params pkg.AddEventParams
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

func AddUserToEvent(c *gin.Context) {
	var params pkg.AddUserToEventParams
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

func GetEventsByGuildID(c *gin.Context) {
	guildID := c.Param("guild_id")

	events, err := discord.GetEventsByGuildID(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

func GetEventsByUserID(c *gin.Context) {
	userID := c.Param("user_id")

	events, err := discord.GetEventsByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

// Point

func AddEventPoint(c *gin.Context) {
	var params pkg.AddEventsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddEventPoint(params.GuildID, params.Events)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateEventPoint(c *gin.Context) {
	var params pkg.AddEventParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.UpdateEventPoint(params.GuildID, params.Event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteEventPoint(c *gin.Context) {
	eventID := c.Param("event_id")

	err := discord.DeleteEventPoint(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func AddUserToEventPoint(c *gin.Context) {
	var params pkg.AddUserToEventParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discord.AddUserToEventPoint(params.EventID, params.User)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func RemoveUserFromEventPoint(c *gin.Context) {
	eventID := c.Param("event_id")
	userID := c.Param("user_id")

	err := discord.RemoveUserFromEventPoint(eventID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetEventsByGuildIDPoint(c *gin.Context) {
	guildID := c.Param("guild_id")

	events, err := discord.GetEventsByGuildIDPoint(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

func GetEventsByUserIDPoint(c *gin.Context) {
	userID := c.Param("user_id")

	events, err := discord.GetEventsByUserIDPoint(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}
func GetRecentActivity(c *gin.Context) {
	point_id := c.Param("point_id")
	limit, err := strconv.Atoi(c.Param("limit"))
	page_number := c.Param("page_number")
	intValue, err := strconv.Atoi(page_number)
	activity, err := discord.GetRecentActivity(point_id, limit, intValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, activity)
}
func GetMemberActivity(c *gin.Context) {
	memberID := c.Param("member_id")
	limit, err := strconv.Atoi(c.Param("limit"))
	page_number := c.Param("page_number")
	intValue, err := strconv.Atoi(page_number)
	activity, err := discord.GetMemberActivity(memberID, limit, intValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, activity)
}

func GetLeaderBoard(c *gin.Context) {
	pointID := c.Param("point_id")
	limit, err := strconv.Atoi(c.Param("limit"))
	page_number := c.Param("page_number")
	intValue, err := strconv.Atoi(page_number)
	leaderBoard, err := discord.GetLeaderBoard(pointID, limit, intValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, leaderBoard)
}

func GetLeaderBoardByGuild(c *gin.Context) {
	guildID := c.Param("guild_id")
	limit, err := strconv.Atoi(c.Param("limit"))
	page_number := c.Param("page_number")
	intValue, err := strconv.Atoi(page_number)
	leaderBoard, err := discord.GetLeaderBoardByGuild(guildID, limit, intValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, leaderBoard)
}

func GetCPUserPoints(c *gin.Context) {
	productID := c.Param("product_id")
	uniqueUserID := c.Param("unique_user_id")
	points, err := discord.GetCPUserPoint(productID, uniqueUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"points": points})
}
