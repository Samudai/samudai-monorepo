package discussionsvc

import (
	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/discussion/controllers"
)

func Register(router *gin.RouterGroup) {

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

}
