package externalsvc

import (
	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/external/controllers"
)

func Register(router *gin.RouterGroup) {

	project := router.Group("/project")
	project.GET("/getall", controllers.GetAllProject)

	discordbot := router.Group("/discordbot")
	// dao
	discordbot.POST("/dao/create", controllers.CreateDAO)
	discordbot.POST("/dao/linkdiscord", controllers.LinkDiscord)
	discordbot.POST("/dao/update", controllers.UpdateDAO)
	discordbot.POST("/dao/addowner", controllers.AddOwner)
	// dao member
	discordbot.POST("/member/addbulk", controllers.AddMembers)
	discordbot.POST("/member/add", controllers.AddMember)
	discordbot.POST("/member/update", controllers.UpdateMember)
	discordbot.DELETE("/member/delete/:guild_id/:user_id", controllers.DeleteMember)
	// dao roles
	discordbot.POST("/role/addbulk", controllers.AddRoles)
	discordbot.POST("/role/add", controllers.AddRole)
	discordbot.POST("/role/update", controllers.UpdateRole)
	discordbot.DELETE("/role/delete/:guild_id/:role_id", controllers.DeleteRole)
	// discord channels
	discordbot.POST("/channel/addbulk", controllers.AddChannels)
	discordbot.POST("/channel/update", controllers.UpdateChannel)
	discordbot.DELETE("/channel/delete/:guild_id/:channel_id", controllers.DeleteChannel)
	// guild
	discordbot.DELETE("/guild/delete/:guild_id", controllers.DeleteGuild)
	// point
	discordbot.POST("/point/linkdiscord", controllers.LinkDiscordPoints)
	// point roles
	discordbot.POST("/point/role/addbulk", controllers.AddPointRoles)
	discordbot.POST("/point/role/addPoints", controllers.AddRolePoints)
	discordbot.POST("/point/role/updatePoints", controllers.UpdateRolePoints)
	discordbot.DELETE("/point/role/deletePoints/:guild_id/:role_id", controllers.DeleteRolePoints)
	// point member
	discordbot.POST("/point/member/addbulk", controllers.AddPointMembers)
	discordbot.POST("/point/member/add", controllers.AddPointMember)
	discordbot.POST("/point/member/update", controllers.UpdatePointMember)
	discordbot.DELETE("/point/member/delete/:guild_id/:user_id", controllers.DeleteMember)
	// point access
	discordbot.POST("/point/getaccess/formemberbyguildid", controllers.GetAccessForMemberByGuildID)
	// point events
	discordbot.GET("/point/event/getLeaderBoard/:guild_id/:page/:limit", controllers.GetLeaderboardForGuild)
	discordbot.GET("/getInfo/:guild_id/:user_id", controllers.GetInfo)

	//discord events
	event := router.Group("/discordbot/event")
	event.POST("/addbulk", controllers.AddEvents)
	event.POST("/add", controllers.AddEvent)
	event.POST("/update", controllers.UpdateEvent)
	event.DELETE("/delete/:event_id", controllers.DeleteEvent)
	event.POST("/useradd", controllers.AddUserToEvent)
	event.DELETE("/userremove/:event_id/:user_id", controllers.RemoveUserFromEvent)
	event.POST("/addPointsNum", controllers.AddPointsNum)

	githubapp := router.Group("/plugins/githubapp")
	githubapp.POST("/webhook", controllers.ConsumeEvent)

	snapshot := router.Group("/snapshot")
	snapshot.POST("/webhook", controllers.Snapshot)

	telegram := router.Group("/telegram")
	telegram.POST("/create", controllers.CreateTelegram)
	telegram.POST("/publishnotifications", controllers.PublishNotifications)
	telegram.DELETE("/disconnect/:chat_id", controllers.DisconnectTelegram)

	// point telegram
	telegram.POST("/create/point", controllers.CreateTelegramPoint)

}

// StartRMQ starts the external RabbitMQ consumers (blocks; run as goroutine).
func StartRMQ() {
	controllers.RMQ_INIT()
}
