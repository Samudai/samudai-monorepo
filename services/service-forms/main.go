package main

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-forms/server"
)

func main() {
	logger.Init()
	db.InitMongo()
	server.Init()
}
