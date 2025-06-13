package github

import (
	"context"

	"github.com/Samudai/service-plugin/pkg/github"
	gh "github.com/google/go-github/v47/github"
)

func GetRepos(data github.DAOData) (*gh.ListRepositories, error) {
	ghClient, err := InitGitHubAppClient(data.InstallationID)
	if err != nil {
		return nil, err
	}

	repos, _, err := ghClient.Apps.ListRepos(context.Background(), &gh.ListOptions{
		PerPage: 100,
	})
	if err != nil {
		return nil, err
	}

	return repos, nil
}
