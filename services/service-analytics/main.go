package main

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-analytics/server"
)

func main() {
	logger.Init()
	db.InitMongo()
	server.Init()
}
