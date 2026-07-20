package discoverysvc

import (
	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/discovery/controllers"
)

func Register(router *gin.RouterGroup) {

	eventsDao := router.Group("/events/dao")
	eventsDao.POST("/create", controllers.CreateDAOEvent)

	eventsMember := router.Group("/events/member")
	eventsMember.POST("/create", controllers.CreateMemberEvent)

	discovery := router.Group("/discovery")
	discovery.POST("/dao", controllers.DiscoverDAO)
	discovery.POST("/member", controllers.DiscoverMember)

}
