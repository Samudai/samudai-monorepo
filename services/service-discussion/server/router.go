package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-discussion/controllers"
	"github.com/Samudai/service-discussion/middlewares"
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

	discussion := router.Group("/discussion")
	discussion.POST("/create", controllers.CreateDiscussion)
	discussion.POST("/update", controllers.UpdateDiscussion)
	discussion.GET("/:discussion_id", controllers.GetDiscussionsByID)
	discussion.GET("/gettags/:dao_id", controllers.GetTagsByDAOID)
	discussion.POST("/bydao/:dao_id", controllers.GetDiscussionsByDAOID)
	discussion.GET("/countbydao/:dao_id", controllers.GetDiscussionsCountByDAOID)
	discussion.GET("/byproposal/:proposal_id", controllers.GetDiscussionsByProposalID)
	discussion.POST("/formember", controllers.GetDiscussionsByMemberID)
	discussion.POST("/updatebookmark", controllers.UpdateBookmark)
	discussion.GET("/updateview/:discussion_id", controllers.UpdateView)
	discussion.GET("/getactiveforum/:dao_id", controllers.GetActiveForum)
	discussion.POST("/close", controllers.CloseDiscussion)

	message := router.Group("/message")
	message.POST("/create", controllers.CreateMessage)
	message.POST("/:discussion_id", controllers.GetMessagesByDiscussionID)
	message.POST("/update/content", controllers.UpdateMessageContent)
	message.DELETE("/delete/:message_id", controllers.DeleteMessage)

	participant := router.Group("/participant")
	participant.POST("/add", controllers.AddParticipant)
	participant.POST("/addbulk", controllers.AddParticipants)
	participant.POST("/remove", controllers.RemoveParticipant)
	participant.GET("/isparticipant/:discussion_id/:member_id", controllers.IsParticipant)
	participant.GET("/:discussion_id", controllers.GetParticipantsByDiscussionID)

	return router
}
