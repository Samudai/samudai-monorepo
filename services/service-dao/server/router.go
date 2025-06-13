package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-dao/controllers"
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

	dao := router.Group("/dao")
	dao.POST("/create", controllers.CreateDAO)
	dao.GET("/:dao_id", controllers.GetDAOByID)
	dao.GET("/byguildid/:guild_id", controllers.GetDAOByGuildID)
	dao.GET("/bymemberid/:member_id", controllers.GetDAOByMemberID)
	dao.GET("/idao/bymemberid/:member_id", controllers.GetIDAOByMemberID)
	dao.POST("/update", controllers.UpdateDAO)
	dao.DELETE("/delete/:dao_id", controllers.DeleteDAO)
	dao.GET("/members/:dao_id/:access", controllers.GetDAOMemberIDs)
	dao.POST("/update/snapshot", controllers.UpdateSnapshot)
	dao.POST("/update/onboarding", controllers.UpdateOnboarding)
	dao.POST("/update/tokengating", controllers.UpdateTokenGating)
	dao.POST("/update/tags", controllers.UpdateTags)
	dao.POST("/update/profile_picture", controllers.UpdatePFP)
	dao.POST("/update/guildId", controllers.UpdateGuildId)
	dao.GET("/getpayouttime/:dao_id", controllers.GetAvgPayoutTime)
	dao.POST("/claimsubdomain", controllers.ClaimSubdomain)
	dao.GET("/checksubdomain/:subdomain", controllers.CheckSubdomain)
	dao.GET("/fetchsubdomainfordao/:dao_id", controllers.FetchSubdomainByDAOID)
	dao.GET("/getsnapshotdataforalldao", controllers.GetSnapshotDataforAllDao)
	dao.POST("/getbulkdaofordiscovery", controllers.GetBulkDaoForDiscovery)
	dao.GET("/getsubscription/fordao/:dao_id", controllers.GetSubscriptionForDao)
	
	dao.POST("/search", controllers.SearchDAOs)
	
	tag := router.Group("/tag")
	tag.GET("/list", controllers.ListTags)

	member := router.Group("/member")
	member.POST("/create", controllers.CreateMember)
	member.POST("/createbulk", controllers.CreateMembers)
	member.POST("/list/:dao_id", controllers.ListMembersForDAO)
	member.GET("/getfordao/:dao_id", controllers.GetMembersForDAO)
	member.GET("/listuuid/:dao_id", controllers.ListMembersForDAOUUID)
	member.DELETE("/delete/:dao_id/:member_id", controllers.DeleteMember)
	member.POST("/mapdiscord", controllers.MapDiscordAuth)
	member.POST("/mapdiscordbulk", controllers.MapDiscordBulk)
	member.POST("/update/license", controllers.UpdateDAOMemberLicense)
	member.POST("/update/licensebulk", controllers.UpdateDAOMemberLicenseBulk)
	member.GET("/licensed/getcount/:dao_id", controllers.GetLicensedMemberCount)

	memberRole := router.Group("/memberrole")
	memberRole.POST("/create", controllers.CreateMemberRole)
	memberRole.DELETE("/delete/:member_role_id", controllers.DeleteMemberRole)
	memberRole.POST("/creatediscord", controllers.CreateMemberRolesDiscord)
	memberRole.POST("/deletediscord", controllers.DeleteMemberRolesDiscord)

	role := router.Group("/role")
	role.POST("/create", controllers.CreateRole)
	role.POST("/createbulk", controllers.CreateRoles)
	role.POST("/update", controllers.UpdateRoles)
	role.POST("/updatediscord", controllers.UpdateDiscordRole)
	role.GET("/list/:dao_id", controllers.ListRolesForDAO)
	role.GET("/listbymemberid/:dao_id/:member_id", controllers.ListRolesForMember)
	role.DELETE("/delete/:dao_id/:role_id", controllers.DeleteRole)
	role.POST("/getdaoroleid", controllers.GetDAORoleIDs)

	social := router.Group("/social")
	social.POST("/create", controllers.CreateSocial)
	social.POST("/update", controllers.UpdateSocial)
	social.GET("/list/:dao_id", controllers.ListSocialsForDAO)
	social.DELETE("/delete/:social_id", controllers.DeleteSocial)

	blog := router.Group("/blog")
	blog.POST("/create", controllers.CreateBlog)
	blog.GET("/list/:dao_id", controllers.ListBlogsForDAO)
	blog.DELETE("/delete/:blog_id", controllers.DeleteBlog)

	// partner := router.Group("/partner")
	// partner.POST("/create", controllers.CreatePartner)
	// partner.GET("/list/:dao_id", controllers.ListPartnersForDAO)
	// partner.DELETE("/delete/:dao_partner_id", controllers.DeletePartner)

	// partnerSocial := router.Group("/partner_social")
	// partnerSocial.POST("/create", controllers.CreatePartnerSocial)
	// partnerSocial.POST("/update", controllers.UpdatePartnerSocial)
	// partnerSocial.GET("/list/:dao_id", controllers.ListPartnerSocialsForDAO)
	// partnerSocial.DELETE("/delete/:partner_social_id", controllers.DeletePartnerSocial)

	access := router.Group("/access")
	access.POST("/create", controllers.CreateAccess)
	access.GET("/listbydaoid/:dao_id", controllers.GetAccessByDAOID)
	access.POST("/update", controllers.UpdateAccess)
	access.POST("/update/allaccess", controllers.UpdateAllAccesses)
	access.DELETE("/delete/:dao_id", controllers.DeleteAccess)
	access.POST("/formember", controllers.GetAccessForMember)
	access.POST("/creatediscord", controllers.CreateAccesses)
	access.POST("/updatediscord", controllers.UpdateAccesses)
	access.POST("/addrolediscord", controllers.AddRoleDiscord)
	access.POST("/addmemberdiscord", controllers.AddMemberDiscord)

	daoInvite := router.Group("/daoinvite")
	daoInvite.POST("/create", controllers.CreateDAOInvite)
	daoInvite.DELETE("/delete/:invite_id", controllers.DeleteDAOInvite)
	daoInvite.POST("/addmember", controllers.AddMemberFromInvite)

	collaboration := router.Group("/collaboration")
	collaboration.POST("/create", controllers.CreateCollaboration)
	collaboration.GET("/list/:dao_id", controllers.ListCollaborations)
	collaboration.POST("/update/status", controllers.UpdateCollaborationStatus)
	collaboration.DELETE("/delete/:collaboration_id", controllers.DeleteCollaboration)

	collaborationPass := router.Group("/collaborationpass")
	collaborationPass.POST("/create", controllers.CreateCollaborationPass)
	collaborationPass.POST("/update", controllers.UpdateCollaborationPass)
	collaborationPass.GET("/get/:dao_id", controllers.GetCollaborationPassByDaoId)
	collaborationPass.DELETE("/delete/:collaboration_pass_id", controllers.DeleteCollaborationPass)

	department := router.Group("/department")
	department.POST("/createbulk", controllers.CreateDepartments)
	department.POST("/create", controllers.CreateDepartment)
	department.GET("/list/:dao_id", controllers.ListDepartmentsForDAO)
	department.DELETE("/delete/:department_id", controllers.DeleteDepartment)

	favourite := router.Group("/favourite")
	favourite.POST("/create", controllers.CreateFavourite)
	favourite.POST("/bymemberid/:member_id", controllers.GetFavouriteList)
	favourite.DELETE("/delete/:favourite_id", controllers.DeleteFavourite)
	favourite.GET("/countbydao/:dao_id", controllers.GetFavouriteCountByDAO)

	token := router.Group("/token")
	token.POST("/create", controllers.CreateToken)
	token.GET("/bydaoid/:dao_id", controllers.GetTokenByDAOID)
	token.POST("/update", controllers.UpdateToken)
	token.DELETE("/delete/:token_id", controllers.DeleteToken)

	review := router.Group("/reviews")
	review.POST("/create", controllers.CreateReview)
	review.GET("/list/:dao_id", controllers.ListReviewsforDAO)
	review.GET("/listbyreviewerid/:reviewer_id", controllers.ListReviewsforReviewerID)
	review.DELETE("/delete/:review_id", controllers.DeleteReview)

	analytics := router.Group("/analytics")
	analytics.POST("/add", controllers.AddAnalytics)
	analytics.GET("/:dao_id", controllers.ListAnalyticsForDAO)

	provider := router.Group("/provider")
	provider.POST("/create", controllers.CreateProvider)
	provider.GET("/get/:provider_id", controllers.GetProviderById)
	provider.GET("/list/:dao_id", controllers.ListProvidersForDAO)
	provider.POST("/update", controllers.UpdateProvider)
	provider.DELETE("/delete/:provider_id", controllers.DeleteProvider)
	provider.GET("/exists/:provider_id", controllers.DoesExistProvider)
	provider.GET("/default/:dao_id", controllers.GetDefaultProvider)
	provider.POST("/update/default", controllers.SetDefaultProvider)

	subdomain := router.Group("/subdomain")
	subdomain.POST("/add", controllers.AddSubdomainForDao)
	subdomain.GET("/get/:dao_id/:subdomain", controllers.GetSubdomainForDao)
	subdomain.GET("/checksubdomaincreate/:dao_id", controllers.CheckSubdomainCreateForDao)

	stripe := router.Group("/stripe")
	stripe.POST("/subscription/add", controllers.AddSubscriptionForDao)
	stripe.POST("/subscription/update", controllers.UpdateSubscriptionForDao)
	stripe.GET("/get/subscriptioncount/:dao_id", controllers.GetSubscriptionCountForDao)
	stripe.GET("/getcustomerid/:dao_id", controllers.GetCustomerIdForDao)
	stripe.POST("/customer/add", controllers.AddCustomerForDao)
	stripe.POST("/customer/update", controllers.UpdateCustomerForDao)

	return router
}
