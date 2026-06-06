package github

import (
	"context"
	"strings"

	gh "github.com/google/go-github/v47/github"

	"github.com/Samudai/backend/services/plugin/pkg/github"
)

func FetchIssues(data github.DAOData, repos []string) ([]*gh.Issue, error) {
	ghClient, err := InitGitHubAppClient(data.InstallationID)
	if err != nil {
		return nil, err
	}

	var issues []*gh.Issue
	user := data.Installation.Installation.Account.Login
	for _, repo := range repos {
		reponame := strings.Split(repo, "/")[1]
		list, _, err := ghClient.Issues.ListByRepo(context.Background(), *user, reponame, nil)
		if err != nil {
			return nil, err
		}
		issues = append(issues, list...)
	}

	return issues, nil
}
