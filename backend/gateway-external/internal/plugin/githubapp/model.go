package githubapp

import (
	"os"
)

var githubAppService string = os.Getenv("SERVICE_PLUGIN") + "/plugins/githubapp"
