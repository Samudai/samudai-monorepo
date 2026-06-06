package github

import (
	"os"
)

var githubService string = os.Getenv("SERVICE_PLUGIN") + "/plugins/github"
