package github

import (
	"context"
	"strings"

	gh "github.com/google/go-github/v47/github"

	"github.com/Samudai/backend/services/plugin/pkg/github"
)

func FetchPullRequests(data github.DAOData, repos []string) ([]*gh.PullRequest, error) {
	ghClient, err := InitGitHubAppClient(data.InstallationID)
	if err != nil {
		return nil, err
	}

	var pullRequests []*gh.PullRequest
	user := data.Installation.Installation.Account.Login
	for _, repo := range repos {
		reponame := strings.Split(repo, "/")[1]
		list, _, err := ghClient.PullRequests.List(context.TODO(), *user, reponame, nil)
		if err != nil {
			return nil, err
		}
		pullRequests = append(pullRequests, list...)
	}
	return pullRequests, nil
}
