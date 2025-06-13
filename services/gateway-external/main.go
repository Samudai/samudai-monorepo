package main

import (
	"github.com/Samudai/gateway-external/server"
	"github.com/Samudai/samudai-pkg/logger"
)

func main() {
	logger.Init()
	server.Init()
}
