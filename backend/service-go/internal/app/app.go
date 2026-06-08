// Package app wires every former microservice into a single Gin engine and
// owns process lifecycle (DB init, RabbitMQ consumers, graceful shutdown).
package app

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.elastic.co/apm/module/apmhttp"

	"github.com/Samudai/backend/shared/sqldb"

	daosvc "github.com/Samudai/backend/services/dao"
	dashboardsvc "github.com/Samudai/backend/services/dashboard"
	discordsvc "github.com/Samudai/backend/services/discord"
	discoverysvc "github.com/Samudai/backend/services/discovery"
	discussionsvc "github.com/Samudai/backend/services/discussion"
	formssvc "github.com/Samudai/backend/services/forms"
	jobsvc "github.com/Samudai/backend/services/job"
	membersvc "github.com/Samudai/backend/services/member"
	pluginsvc "github.com/Samudai/backend/services/plugin"
	pointsvc "github.com/Samudai/backend/services/point"
	projectsvc "github.com/Samudai/backend/services/project"
)

// Run boots the monolith: initialise data stores, build the router, start the
// HTTP server plus background consumers, and block until a shutdown signal.
func Run() {
	logger.Init()

	// Data stores. Each SQL module keeps its own connection (DATABASE_URL_<MODULE>);
	// Mongo and Redis are shared singletons (modules select their Mongo DB by name).
	sqldb.InitAll()
	db.InitMongo()
	db.InitRedis()
	pluginsvc.InitStore() // plugin object store — must run after InitMongo

	// Ensure the Go-owned Mongo secondary indexes (mirrors the Node services'
	// Mongoose autoIndex). Best-effort: indexes are an optimisation, so a failure
	// is logged but must not block startup.
	ictx, icancel := context.WithTimeout(context.Background(), 30*time.Second)
	indexers := []struct {
		name string
		fn   func(context.Context) error
	}{
		{"discord", discordsvc.EnsureIndexes},
		{"plugin", pluginsvc.EnsureIndexes},
		{"forms", formssvc.EnsureIndexes},
	}
	for _, ix := range indexers {
		if err := ix.fn(ictx); err != nil {
			logger.LogMessage("error", "ensure mongo indexes (%s): %v", ix.name, err)
		}
	}
	icancel()

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

	// RabbitMQ consumers — each blocks on select{}, so run as goroutines.
	go discordsvc.StartRMQ()
	go pointsvc.StartRMQ()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	sqldb.CloseAll()
	db.CloseMongo()
	db.CloseRedis()

	logger.LogMessage("info", "Shutting down server...")
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
}

// newEngine builds the shared Gin engine and mounts every module under its
// per-service prefix. Callers reach a module via SERVICE_<X>=http://backend/<prefix>.
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

	daosvc.Register(engine.Group("/dao"))
	membersvc.Register(engine.Group("/member"))
	discordsvc.Register(engine.Group("/discord"))
	projectsvc.Register(engine.Group("/project"))
	pointsvc.Register(engine.Group("/point"))
	pluginsvc.Register(engine.Group("/")) // routes are already prefixed /plugins/*
	dashboardsvc.Register(engine.Group("/dashboard"))
	discoverysvc.Register(engine.Group("/discovery"))
	discussionsvc.Register(engine.Group("/discussion"))
	formssvc.Register(engine.Group("/forms"))
	jobsvc.Register(engine.Group("/job"))

	return engine
}
