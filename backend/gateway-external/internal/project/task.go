package project

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	gh "github.com/google/go-github/v45/github"

	"github.com/Samudai/backend/services/project/pkg/project"
)

func CreateTaskFromGithubEvent(daoID string, repo string, issue *gh.Issue, assignees []string) error {
	url := fmt.Sprintf("%s/github/createtask", projectService)
	params := project.CreateGithubTaskParam{
		Repo:      repo,
		Issue:     issue,
		DAOID:     daoID,
		Assignees: assignees,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func UpdateTaskFromGithubEvent(daoID string, repo string, issue *gh.Issue, assignees []string) error {
	url := fmt.Sprintf("%s/github/updatetask", projectService)

	params := project.CreateGithubTaskParam{
		Repo:      repo,
		Issue:     issue,
		DAOID:     daoID,
		Assignees: assignees,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}
