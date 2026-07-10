// Command server runs the standalone gateway-external service: a thin Gin
// engine that mounts the external integration routes at the root and starts the
// RabbitMQ consumer. It holds no SQL/Mongo/Redis connections — every data
// operation is an HTTP call to the Go backend (SERVICE_* env URLs).
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Samudai/samudai-pkg/logger"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.elastic.co/apm/module/apmhttp"

	externalsvc "github.com/Samudai/gateway-external"
)

func main() {
	logger.Init()

	engine := newEngine()

	port := os.Getenv("PORT")
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: apmhttp.Wrap(engine),
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to initialize server: %v", err)
		}
	}()
	logger.LogMessage("info", "Listening on port: %s", srv.Addr)

	// RabbitMQ consumer — blocks on select{}, so run as a goroutine.
	go externalsvc.StartRMQ()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	logger.LogMessage("info", "Shutting down server...")
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
}

// newEngine builds the Gin engine and mounts the external routes at the root
// (no /external prefix — public webhook URLs are served natively, matching the
// pre-merge standalone). Middleware mirrors the backend monolith.
func newEngine() *gin.Engine {
	engine := gin.New()
	engine.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
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
	engine.Use(gin.Recovery())

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	corsConfig.AllowHeaders = []string{"*"}
	corsConfig.AllowCredentials = true
	corsConfig.MaxAge = 1 * time.Minute
	engine.Use(cors.New(corsConfig))

	engine.Use(func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.Next()
	})

	engine.GET("/health", func(c *gin.Context) { c.String(http.StatusOK, "Working!") })

	externalsvc.Register(engine.Group("/"))

	return engine
}
