package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-member/controllers"
	"github.com/Samudai/service-member/middlewares"
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

	member := router.Group("/member")
	member.POST("/create", controllers.CreateMember)
	member.POST("/creatediscord", controllers.CreateMemberDiscord)
	member.POST("/fetch", controllers.FetchMember)
	member.POST("/fetch/imember", controllers.FetchIMember)
	member.POST("/getbulkbyid", controllers.GetMembersBulk)
	member.POST("/update", controllers.UpdateMember)
	member.POST("/update/opportunitystatus", controllers.UpdateMemberOpportunityStatus)
	member.POST("/update/rate", controllers.UpdateMemberHourlyRate)
	member.POST("/update/domaintags", controllers.UpdateDomainTags)
	member.POST("/update/featuredprojects", controllers.UpdateMemberFeaturedProjects)
	member.POST("/updatediscord", controllers.UpdateMemberDiscord)
	member.DELETE("/:member_id", controllers.DeleteMember)
	member.DELETE("/discord/:member_id", controllers.DeleteDiscordMemberData)
	member.POST("/update/profilepicture", controllers.UpdateProfilePicture)
	member.POST("/update/oppurtunitypref", controllers.UpdateOppurtunityPref)
	member.POST("/update/ceramicstream", controllers.UpdateCeramicStream)
	member.POST("/update/subdomain", controllers.UpdateSubdomain)
	member.POST("/update/skills", controllers.UpdateSkills)
	member.POST("/update/tags", controllers.UpdateTags)
	member.POST("/update/name&pfp&email", controllers.UpdateNamePfpEmail)
	member.POST("/update/username", controllers.UpdateUsername)
	member.POST("/update/userorignialname", controllers.UpdateUserOriginalName)
	member.POST("/update/email", controllers.UpdateEmail)
	member.GET("/is/emailupdated/:member_id", controllers.GetIsEmailUpdated)
	member.GET("/discord/exist/:member_id", controllers.CheckDiscordExist)
	member.GET("/username/exist/:username", controllers.CheckUsernameExist)
	member.POST("/search", controllers.SearchMember)
	member.GET("/invitecount/:member_id", controllers.GetInviteCount)
	member.GET("/workprogress/:member_id", controllers.GetMemberWorkInProgress)
	member.GET("/get/all/contributors", controllers.GetAllContributors)
	member.GET("/get/all/contributors/open_to_work", controllers.GetAllOpenToWorkContributor)
	member.POST("/getbulkmembersfordiscovery", controllers.GetBulkMemberForDiscovery)
	member.POST("/getbulktelegramchatids", controllers.GetBulkTelegramChatIds)

	wallet := router.Group("/wallet")
	wallet.POST("/create", controllers.CreateWallet)
	wallet.POST("/update/default", controllers.UpdateDefaultWallet)
	wallet.DELETE("/delete/:member_id/:wallet_add", controllers.DeleteWallet)
	wallet.GET("/default/:member_id", controllers.GetDefaultWallet)

	skill := router.Group("/skill")
	// skill.POST("/create", controllers.CreateSkill)
	skill.GET("/list", controllers.ListSkills)
	// skill.POST("/bylist", controllers.GetSkillByList)
	// skill.DELETE("/delete/:skill_id", controllers.DeleteSkill)

	tag := router.Group("/tag")
	tag.GET("/list", controllers.ListTags)

	domainTags := router.Group("/domaintags")
	domainTags.GET("/list", controllers.ListDomainTags)

	social := router.Group("/social")
	social.POST("/create", controllers.CreateSocial)
	social.POST("/update", controllers.UpdateSocial)
	social.GET("/list/:member_id", controllers.ListSocialsForMember)
	social.DELETE("/delete/:social_id", controllers.DeleteSocial)

	connection := router.Group("/connection")
	connection.POST("/create", controllers.CreateConnection)
	connection.GET("/listbysender/:sender_id", controllers.ListConnectionsBySenderID)
	connection.GET("/listbyreceiver/:receiver_id", controllers.ListConnectionsByReceiverID)
	connection.POST("/update", controllers.UpdateConnection)
	connection.DELETE("/delete/:sender_id/:receiver_id", controllers.DeleteConnection)
	connection.GET("/list/:member_id", controllers.ListConnectionsForMember)
	connection.GET("/listall/:member_id", controllers.ListAllConnectionsForMember)
	connection.GET("/status/:viewer_id/:member_id", controllers.GetConnectionStatus)
	connection.GET("/exist/:member1/:member2", controllers.ConnectionExist)

	onboarding := router.Group("/onboarding")
	onboarding.POST("/update", controllers.UpdateOnboarding)
	onboarding.POST("/requestnft", controllers.RequestNFT)
	onboarding.GET("/:member_id", controllers.GetOnboarding)
	onboarding.POST("/requestsubdomain", controllers.RequestSubdomain)
	onboarding.GET("/checksubdomain/:subdomain", controllers.CheckSubdomain)
	onboarding.GET("/fetchsubdomainformember/:member_id", controllers.FetchSubdomainByMemberID)

	clan := router.Group("/clan")
	clan.POST("/create", controllers.CreateClan)
	clan.POST("/addmember", controllers.AddClanMember)
	clan.GET("/:clan_id", controllers.GetClanByID)
	clan.GET("/bymember/:member_id", controllers.GetClanByMemberID)
	clan.POST("/update", controllers.UpdateClan)
	clan.DELETE("/:clan_id", controllers.DeleteClan)
	clan.DELETE("/removemember/:clan_id/:member_id", controllers.RemoveClanMember)

	clanInvite := router.Group("/claninvite")
	clanInvite.POST("/create", controllers.CreateClanInvite)
	clanInvite.POST("/update", controllers.UpdateClanInvite)
	clanInvite.GET("/list/:clan_id", controllers.ListClanInvites)
	clanInvite.GET("/byreceiverid/:receiver_id", controllers.GetClanInviteByReceiverID)
	clanInvite.DELETE("/delete/:invite_id", controllers.DeleteClanInvite)

	review := router.Group("/reviews")
	review.POST("/create", controllers.CreateReview)
	review.GET("/list/:member_id", controllers.ListReviewsforMember)
	review.GET("/listbyreviewerid/:reviewer_id", controllers.ListReviewsforReviewerID)
	review.DELETE("/delete/:review_id", controllers.DeleteReview)

	reward := router.Group("/reward")
	reward.POST("/create", controllers.CreateReward)
	reward.POST("/formember", controllers.ListRewardsForMember)

	waitlist := router.Group("/waitlist")
	waitlist.POST("/create", controllers.CreateWaitlistEntry)

	telegram := router.Group("/telegram")
	telegram.POST("/add", controllers.AddTelegramForMember)
	telegram.POST("/update/generated_id", controllers.CreateOrUpdateGeneratedTelegramId)
	telegram.GET("/exist/:member_id", controllers.CheckTelegramExist)
	telegram.GET("/get/:member_id", controllers.GetTelegramForMember)
	telegram.DELETE("/delete/:member_id", controllers.DeleteTelegramForMember)

	mobile := router.Group("/mobile")
	mobile.POST("/add", controllers.AddMobileForMember)
	mobile.POST("/update/generated_otp", controllers.CreateOrUpdateGeneratedOTP)
	mobile.GET("/get/linkedstaus/:member_id", controllers.GetLinkedStatusForMember)
	mobile.DELETE("/delete/:member_id", controllers.DeleteMobileForMember)

	subdomain := router.Group("/subdomain")
	subdomain.POST("/add", controllers.AddSubdomainForMember)
	subdomain.GET("/get/:member_id/:subdomain", controllers.GetSubdomainForMember)
	subdomain.GET("/checksubdomaincreate/:member_id", controllers.CheckSubdomainCreateForMember)

	privy := router.Group("/privy")
	privy.POST("/add", controllers.AddPrivyMember)

	coposter := router.Group("/coposter")
	coposter.POST("/user/add", controllers.AddCoposterUser)
	coposter.GET("/getuser/byId/:coposter_user_id", controllers.GetCoposterUserById)
	coposter.POST("/x/addTweet", controllers.AddTweet)
	coposter.POST("/warpcast/addCast", controllers.AddCast)
	coposter.POST("/xcaster/addUser", controllers.AddXcasterUser)
	coposter.POST("/xcaster/updateXUser", controllers.UpdateXUser)
	coposter.POST("/xcaster/updateWarpcastUser", controllers.UpdateWarpcastUser)
	coposter.GET("/fetch/:member_id", controllers.FetchXcasterUser)
	return router
}
