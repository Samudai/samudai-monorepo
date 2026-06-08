package middlewares

import "github.com/gin-gonic/gin"

func SetHeadersMiddleware(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.Next()
}
