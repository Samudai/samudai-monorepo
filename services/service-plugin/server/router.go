package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-plugin/controllers"
	"github.com/Samudai/service-plugin/middlewares"
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

	return router
}
