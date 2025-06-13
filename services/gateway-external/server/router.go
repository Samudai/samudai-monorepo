package server

import (
	"fmt"
	"time"

	"github.com/Samudai/gateway-external/controllers"
	"github.com/Samudai/gateway-external/middlewares"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format(time.RFC1123),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	}))
	router.Use(gin.Recovery())
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	corsConfig.AllowHeaders = []string{"*"}
	corsConfig.AllowCredentials = true
	corsConfig.MaxAge = 1 * time.Minute
	router.Use(cors.New(corsConfig))

	router.Use(middlewares.SetHeadersMiddleware)

	health := new(controllers.HealthController)
	router.GET("/health", health.Status)

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

	return router

}
