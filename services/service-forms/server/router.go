package server

import (
	"fmt"
	"time"

	"github.com/Samudai/service-forms/controllers"
	"github.com/Samudai/service-forms/middlewares"
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

	return router

}
