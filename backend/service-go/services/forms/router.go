package formssvc

import (
	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/forms/controllers"
)

func Register(router *gin.RouterGroup) {

	questions := router.Group("/deal/questions")
	questions.POST("/create", controllers.CreateQuestions)
	questions.POST("/update", controllers.UpdateQuestions)
	questions.GET("/:form_id", controllers.GetQuestionsByFormID)
	questions.GET("/bydao/:dao_id", controllers.GetQuestionsByDAO)
	questions.GET("/count/:dao_id", controllers.GetQuestionsCountByDAO)
	questions.DELETE("/delete/:form_id", controllers.DeleteQuestions)
	questions.GET("/support", controllers.GetSupportQuestions)

	response := router.Group("/deal/response")
	response.POST("/create", controllers.CreateResponse)
	response.GET("/:response_id", controllers.GetResponseByID)
	response.GET("/byform/:form_id", controllers.GetResponseByFormID)
	response.DELETE("/delete/:response_id", controllers.DeleteResponse)

}
