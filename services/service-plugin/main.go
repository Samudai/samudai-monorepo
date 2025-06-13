package main

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-plugin/internal/store"
	"github.com/Samudai/service-plugin/server"
)

func main() {
	logger.Init()
	db.InitMongo()
	store.Init()
	server.Init()
}
