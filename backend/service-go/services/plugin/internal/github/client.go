package github

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/Samudai/samudai-pkg/logger"
	"github.com/bradleyfalzon/ghinstallation/v2"
	"github.com/google/go-github/v47/github"
	"golang.org/x/oauth2"
)

var (
	githubURL = "https://github.com"
)

// InitGitHubAppClient initializes a GitHub client for a GitHub App
func InitGitHubAppClient(installationID int64) (*github.Client, error) {
	githubKey := os.Getenv("GITHUB_APP_PRIVATE_KEY")
	appID, exist := os.LookupEnv("GITHUB_APP_ID")
	if exist {
		AppID, err := strconv.ParseInt(appID, 10, 64)
		if err != nil {
			return nil, err
		}
		itr, err := ghinstallation.NewKeyFromFile(http.DefaultTransport, AppID, installationID, githubKey)
		if err != nil {
			return nil, err
		}
		gitHubClient := github.NewClient(&http.Client{Transport: itr})

		logger.LogMessage("info", "GitHub app client initialized")
		return gitHubClient, nil
	}

	return nil, fmt.Errorf("GITHUB_APP_ID is not set")
}

// InitGitHubOauthClient initializes a GitHub oauth client for a GitHub user
func InitGitHubOauthClient(accessToken string) (*github.Client, error) {
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: accessToken},
	)
	tc := oauth2.NewClient(ctx, ts)

	gitHubClient := github.NewClient(tc)

	logger.LogMessage("info", "GitHub oauth client initialized")
	return gitHubClient, nil
}
