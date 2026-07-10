package pluginsvc

import (
	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/plugin/controllers"
)

func Register(router *gin.RouterGroup) {

	notion := router.Group("/plugins/notion")
	notion.POST("/auth", controllers.NotionAuth)
	notion.GET("/exists/:member_id", controllers.CheckMemberNotionExists)
	notion.POST("/getalldatabase", controllers.GetAllDatabase)
	notion.POST("/getdatabase", controllers.GetDatabase)
	notion.POST("/getdatabaseproperties", controllers.GetDatabaseProperties)
	notion.POST("/getpages", controllers.GetPages)
	notion.GET("/page/:page_id", controllers.GetPageByID)
	notion.POST("/getmemberids", controllers.GetNotionMemberIDs)
	notion.DELETE("/:member_id", controllers.DeleteNotionAuth)

	github := router.Group("/plugins/github")
	github.POST("/auth", controllers.AuthMember)
	github.GET("/exists/:member_id", controllers.CheckMemberGithubExists)
	github.POST("/getmemberids", controllers.GetGithubMemberIDs)
	github.DELETE("/:member_id", controllers.DeleteGithubAuth)

	githubapp := router.Group("/plugins/githubapp")
	githubapp.POST("/savewebhook", controllers.ConsumeEvent)
	githubapp.POST("/auth", controllers.AppAuthMember)
	githubapp.GET("/exists/:dao_id", controllers.CheckDaoGithubAppExists)
	githubapp.GET("/getrepos/:dao_id", controllers.GetRepos)
	githubapp.GET("/getdaoidforinstallation/:installation_id", controllers.GetDAOIDForInstallation)
	githubapp.POST("/fetchissues", controllers.FetchIssues)
	githubapp.POST("/fetchpullrequests", controllers.FetchPullRequests)
	githubapp.DELETE("/:dao_id", controllers.DeleteGithubAppAuth)

	gcal := router.Group("/plugins/gcal")
	gcal.POST("/auth", controllers.GcalAuth)
	gcal.GET("/exists/:member_id", controllers.CheckMemberGcalExists)
	gcal.GET("/access/:member_id", controllers.GetGcalAuth)
	gcal.DELETE("/:member_id", controllers.DeleteGcalAccess)

	discord := router.Group("/plugins/discord")
	discord.GET("/exists/:discord_id", controllers.CheckMemberDiscordExists)

}
