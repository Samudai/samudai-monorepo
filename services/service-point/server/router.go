package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-point/controllers"
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

	health := new(controllers.HealthController)
	router.GET("/health", health.Status)

	point := router.Group("/point")
	point.POST("/create", controllers.CreatePoint)
	point.POST("/updatePointsNum", controllers.UpdatePointsNum)
	point.POST("/update/guildId", controllers.UpdateGuildId)
	point.GET("/bymemberid/:member_id", controllers.GetPointByMemberID)
	point.GET("/pointid/:guild_id", controllers.GetPointByGuildID)
	point.GET("/guild_id/:point_id", controllers.GetGuildByPointID)
	point.GET("/getpointbyid/:point_id", controllers.GetPointByPointID)
	point.GET("/getPointIdsByMemberId/:member_id", controllers.GetPointIdsByMemberId)

	memberpoint := router.Group("/memberpoint")
	memberpoint.POST("/create", controllers.CreatePointMember)
	memberpoint.POST("/mapdiscord", controllers.MapDiscordAuth)
	memberpoint.POST("/update", controllers.UpdateMemberPoints)

	role := router.Group("/role")
	role.POST("/create", controllers.CreateRole)
	role.POST("/updatediscord", controllers.UpdateDiscordRole)
	role.POST("/createbulk", controllers.CreateRoles)
	role.GET("/list/:point_id", controllers.ListRolesForPoint)

	member := router.Group("/member")
	member.POST("/create", controllers.CreateMember)
	member.POST("/update", controllers.UpdateMember)
	member.POST("/list/:point_id", controllers.ListMembersForPoint)
	member.POST("/fetch", controllers.FetchMember)
	member.POST("/fetchbulkbydiscord", controllers.FetchMemberIdByDiscord)
	member.POST("/update/walletaddress", controllers.UpdateMemberWalletAddress)
	member.POST("/update/name&email", controllers.UpdateMemberEmailName)
	member.POST("/update/verificationcode", controllers.UpdateEmailVerificationCode)
	member.POST("/update/isonboarded", controllers.UpdateIsOnboarded)
	member.POST("/verifyemail", controllers.VerifyEmailForMember)
	member.POST("/creatediscord", controllers.CreateMemberDiscord)
	member.POST("/updatediscord", controllers.UpdateMemberDiscord)
	member.GET("/fetchdiscord/:member_id", controllers.FetchDiscordForMember)
	member.POST("/mapdiscordbulk", controllers.MapDiscordBulk)
	member.POST("/createpointmember", controllers.CreatePointMembersDiscord)

	access := router.Group("/access")
	access.POST("/create", controllers.CreateAccess)
	access.GET("/listbypointid/:point_id", controllers.GetAccessByPointID)
	access.POST("/update", controllers.UpdateAccess)
	access.POST("/update/allaccess", controllers.UpdateAllAccesses)
	access.DELETE("/delete/:point_id", controllers.DeleteAccess)
	access.POST("/formember", controllers.GetAccessForMember)
	access.POST("/formemberbyguildid", controllers.GetAccessForMemberByGuildId)
	access.POST("/formemberbytelegramusername", controllers.GetAccessForMemberByTelegramUsername)
	access.POST("/creatediscord", controllers.CreateAccesses)
	access.POST("/updatediscord", controllers.UpdateAccesses)
	access.POST("/addmemberdiscord", controllers.AddMemberDiscord)
	access.POST("/addrolediscord", controllers.AddRoleDiscord)

	contract := router.Group("/contract")
	contract.POST("/add", controllers.AddContract)
	contract.POST("/update", controllers.UpdateContract)
	contract.POST("/updatepoints", controllers.UpdateContractEventPoint)
	contract.GET("/getbyid/:contract_address", controllers.GetContractByIDs)
	contract.GET("/getbypointid/:point_id", controllers.GetContractsByPointID)
	contract.GET("/getByContractAddressPointId/:contract_address/:point_id", controllers.GetContractByContractAddressPointId)
	contract.DELETE("/delete/:point_id/:contract_address/:topic", controllers.DeleteContract)
	contract.POST("/webhook/add", controllers.AddWebhook)
	contract.GET("/webhook/get/:point_id/:contract_address", controllers.GetWebhook)
	contract.DELETE("/webhook/delete/:point_id/:contract_address", controllers.DeleteWebhook)
	contract.POST("/webhook/update", controllers.UpdateWebhook)

	memberRole := router.Group("/memberrole")
	memberRole.POST("/create", controllers.CreateMemberRole)
	memberRole.DELETE("/delete/:member_role_id", controllers.DeleteMemberRole)
	memberRole.POST("/creatediscord", controllers.CreateMemberRolesDiscord)
	memberRole.POST("/deletediscord", controllers.DeleteMemberRolesDiscord)

	customProduct := router.Group("/customproduct")
	customProduct.POST("/create", controllers.CreateCustomProduct)
	customProduct.POST("/update", controllers.UpdateCustomProduct)
	customProduct.GET("/getbyid/:product_id", controllers.GetProductByProductID)
	customProduct.GET("/getbypointid/:point_id", controllers.GetProductByPointID)
	customProduct.POST("/updatestatus", controllers.UpdateCustomProductStatus)

	memberproduct := router.Group("/memberproduct")
	memberproduct.POST("/create", controllers.CreateProductMember)
	memberproduct.GET("/fetch/productandmember/:product_id/:unique_user_id/:event_name", controllers.FetchProductAndMember)
	memberproduct.GET("/fetchbyid/productandmember/:product_id/:unique_user_id", controllers.FetchProductAndMemberById)

	productevent := router.Group("/productevent")
	productevent.POST("/add", controllers.AddProdcutEvents)
	productevent.POST("/update", controllers.UpdateProdcutEvents)
	productevent.POST("/updatepoints", controllers.UpdateProdcutEventsPoint)
	productevent.DELETE("/delete/:point_id/:product_id/:event_name", controllers.DeleteProdcutEvents)

	telegram := router.Group("/telegram")
	telegram.POST("/add", controllers.AddTelegramForMember)
	telegram.POST("/update/otp", controllers.CreateOrUpdateOTP)
	telegram.GET("/getformember/:member_id", controllers.GetTelegramForMember)
	telegram.GET("/getmember/:joinee_chat_id/:group_chat_id/:event_name", controllers.GetTelegramMemberByUsername)
	telegram.GET("/getmember1/:username/:group_chat_id", controllers.GetTelegramMemberByUsername1)
	telegram.GET("/getforpoint/:point_id", controllers.GetTelegramForPoint)
	telegram.POST("/events/add", controllers.AddTelegramEventsPoint)
	telegram.POST("/events/update", controllers.UpdateTelegramEventsPoint)
	telegram.GET("/getevents/:point_id", controllers.GetTelegramEventForPoint)

	twitter := router.Group("/twitter")
	twitter.POST("/add", controllers.AddTwitterForPoint)
	twitter.POST("/update", controllers.UpdateTwitterForPoint)
	twitter.POST("/updatetokens", controllers.UpdateTwitterTokens)
	twitter.POST("/updatestatus", controllers.UpdateTwitterStatus)
	twitter.GET("/getbypointid/:point_id", controllers.GetTwitterByPointID)
	twitter.GET("/getall", controllers.GetAllTwitterPoint)

	twittermember := router.Group("/twittermember")
	twittermember.POST("/add", controllers.AddTwitterMember)
	twittermember.POST("/update", controllers.UpdateTwitterMember)
	twittermember.GET("/getbyid/:member_id", controllers.GetTwitterMemberById)
	twittermember.GET("/getbyuserid/:point_id/:twitter_user_id/:twitter_username", controllers.GetTwitterMemberByUserId)

	twitterevent := router.Group("/twitterpoints")
	twitterevent.POST("/add", controllers.AddTwitterPoints)
	twitterevent.POST("/update", controllers.UpdateTwitterPoints)
	twitterevent.GET("/getbyid/:point_id", controllers.GetTwitterPointsByPointId)

	referral := router.Group("/referral")
	referral.POST("/update", controllers.AddandUpdateReferralPoints)
	referral.POST("/updatestatus", controllers.UpdateReferralStatus)
	referral.GET("/request/:point_id/:product_id/:unique_user_id", controllers.RequestReferralCode)
	referral.GET("/verifycode/:product_id/:unique_user_id/:referral_code", controllers.VerifyReferralCode)

	return router
}
