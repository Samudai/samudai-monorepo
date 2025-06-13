package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-discord/controllers"
	"github.com/Samudai/service-discord/middlewares"
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
	corsConfig.MaxAge = 1 * time.Minute
	router.Use(cors.New(corsConfig))

	router.Use(middlewares.SetHeadersMiddleware)

	health := new(controllers.HealthController)
	router.GET("/health", health.Status)

	discord := router.Group("/discord")
	discord.POST("/create", controllers.CreateOrUpdate)
	discord.POST("/update", controllers.CreateOrUpdate)
	discord.DELETE("/delete/:guild_id", controllers.Delete)
	discord.GET("/guildforuser/:discord_user_id", controllers.GuildsByUserID)
	discord.POST("/authuser", controllers.AuthUser)
	discord.GET("/guildadmin/:member_id", controllers.GuildAdmin)
	discord.DELETE("/disconnect/:member_id", controllers.DisconnectDiscord)

	member := router.Group("/member")
	member.POST("/addmembers", controllers.Addmembers)
	member.POST("/updatemember", controllers.UpdateMember)
	member.DELETE("/delete/:guild_id/:user_id", controllers.DeleteMember)
	member.GET("/getpointbywallet/:wallet_address", controllers.GetPointsForWalletAddress)

	role := router.Group("/role")
	role.POST("/addroles", controllers.AddRoles)
	role.POST("/updaterole", controllers.UpdateRole)
	role.DELETE("/delete/:guild_id/:role_id", controllers.DeleteRole)
	role.GET("/byguildid/:guild_id", controllers.GetRolesByGuildID)

	event := router.Group("/event")
	event.POST("/add", controllers.AddEvent)
	event.POST("/update", controllers.UpdateEvent)
	event.DELETE("/delete/:event_id", controllers.DeleteEvent)
	event.POST("/useradd", controllers.AddUserToEvent)
	event.DELETE("/userremove/:event_id/:user_id", controllers.RemoveUserFromEvent)
	event.GET("/byguildid/:guild_id", controllers.GetEventsByGuildID)
	event.GET("/byuserid/:user_id", controllers.GetEventsByUserID)

	// POINTS

	pointdiscord := router.Group("/point/discord")
	pointdiscord.POST("/create", controllers.CreateOrUpdatePoint)
	pointdiscord.POST("/update", controllers.CreateOrUpdatePoint)
	pointdiscord.DELETE("/delete/:guild_id", controllers.DeletePoint)
	pointdiscord.GET("/guildforuser/:discord_user_id", controllers.GuildsByUserIDPoint)
	pointdiscord.POST("/authuser", controllers.AuthUserPoint)
	pointdiscord.GET("/guildadmin/:member_id", controllers.GuildAdminPoint)
	pointdiscord.DELETE("/disconnect/:member_id", controllers.DisconnectDiscordPoint)
	pointdiscord.GET("/guildforuser/:discord_user_id/:guild_id", controllers.GuildByDiscordIdGuildId)
	pointdiscord.GET("/addMetric", controllers.AddMetric)
	pointdiscord.GET("/getMetric/:point_id/:days", controllers.GetMetric)
	pointdiscord.GET("/removeDuplicate", controllers.RemoveDuplicate)

	// pointdiscord.POST("/addwalletactivity", controllers.AddWalletActivity)
	pointdiscord.POST("/merge", controllers.MergeAll)
	pointdiscord.POST("/mergeV2", controllers.MergeAllV2)
	pointdiscord.POST("/updatememberpoints", controllers.UpdateMemberPoints)
	// pointdiscord.POST("/mergeactivity", controllers.MergeActivity)
	// pointdiscord.GET("/test/:wallet_address/:point_id/:points", controllers.Test)

	pointmember := router.Group("/point/member")
	pointmember.POST("/addmembers", controllers.AddmembersPoint)
	pointmember.POST("/addDiscordMembers", controllers.AddDiscordmembersPoint)
	pointmember.POST("/addDiscordMember", controllers.AddDiscordmemberPoint)
	pointmember.POST("/updatemember", controllers.UpdateMemberPoint)
	pointmember.POST("/updatememberPointsNum", controllers.UpdateMemberPointsNum)
	pointmember.DELETE("/delete/:guild_id/:user_id", controllers.DeleteMemberPoint)
	// pointmember.GET("/getNFTsByWallet/:wallet_address/:token_address/:chain", controllers.GetNFTs)

	pointrole := router.Group("/point/role")
	pointrole.POST("/addroles", controllers.AddRolesPoint)
	pointrole.POST("/updaterole", controllers.UpdateRolePoint)
	pointrole.DELETE("/delete/:guild_id/:role_id", controllers.DeleteRolePoint)
	pointrole.GET("/byguildid/:guild_id", controllers.GetRolesByGuildIDPoint)

	pointevent := router.Group("/point/event")
	pointevent.POST("/add", controllers.AddEventPoint)
	pointevent.POST("/update", controllers.UpdateEventPoint)
	pointevent.DELETE("/delete/:event_id", controllers.DeleteEventPoint)
	pointevent.POST("/useradd", controllers.AddUserToEventPoint)
	pointevent.DELETE("/userremove/:event_id/:user_id", controllers.RemoveUserFromEventPoint)
	pointevent.GET("/byguildid/:guild_id", controllers.GetEventsByGuildIDPoint)
	pointevent.GET("/byuserid/:user_id", controllers.GetEventsByUserIDPoint)
	pointevent.GET("/getRecentActivity/:point_id/:page_number/:limit", controllers.GetRecentActivity)
	pointevent.GET("/getMemberActivity/:member_id/:page_number/:limit", controllers.GetMemberActivity)
	pointevent.GET("/getLeaderBoard/:point_id/:page_number/:limit", controllers.GetLeaderBoard)
	pointevent.GET("/getLeaderBoardbyguild/:guild_id/:page_number/:limit", controllers.GetLeaderBoardByGuild)
	pointevent.GET("/getcpuserpoints/:product_id/:unique_user_id", controllers.GetCPUserPoints)

	return router
}
