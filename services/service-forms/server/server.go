package server

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"go.elastic.co/apm/module/apmhttp"
)

func Init() {
	port := os.Getenv("PORT")
	r := NewRouter()

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: apmhttp.Wrap(r),
	}

	// Graceful server shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to initialize server: %v", err)
		}
	}()

	logger.LogMessage("info", "Listening on port: %s", srv.Addr)

	// Wait for kill signal of channel
	quit := make(chan os.Signal)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// This blocks until a signal is passed into the quit channel
	<-quit

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// shutdown data sources
	db.CloseMongo()

	// Shutdown server
	logger.LogMessage("info", "Shutting down server...")
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
}
