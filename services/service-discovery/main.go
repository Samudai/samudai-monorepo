package main

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discovery/server"
)

func main() {
	logger.Init()
	db.InitSQL()
	server.Init()
}
