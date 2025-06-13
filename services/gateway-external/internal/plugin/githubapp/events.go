package githubapp

import (
	"fmt"

	"github.com/Samudai/gateway-external/internal/plugin/github"
	"github.com/Samudai/gateway-external/internal/project"
	"github.com/Samudai/gateway-external/utils"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/samudai-pkg/requester"
	gh "github.com/google/go-github/v45/github"
)

func ConsumeEvent(webhookType string, payload []byte) error {
	event, err := gh.ParseWebHook(webhookType, payload)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/savewebhook", githubAppService)

	params := map[string]interface{}{
		"webhook_type": webhookType,
		"payload":      event,
	}
	_, err = requester.Post(url, params)
	if err != nil {
		return err
	}

	issueUpdateEvents := []string{"edited", "labeled", "unlabeled", "assigned", "unassigned"}
	switch Event := event.(type) {
	case *gh.CreateEvent:
		logger.LogMessage("info", "Received a create event")
	case *gh.IssuesEvent:
		logger.LogMessage("info", "Received issues event")
		if Event.GetAction() == "opened" {
			logger.LogMessage("info", "Received an opened issue event")
			repo := Event.Repo.GetFullName()
			issue := Event.GetIssue()
			daoID, err := getDAOIDForInstallation(Event.Installation.GetID())
			if err != nil {
				return err
			}
			assignees, err := github.GetMemberIDForAssignees(Event.GetIssue().Assignees)
			if err != nil {
				return err
			}
			err = project.CreateTaskFromGithubEvent(daoID, repo, issue, assignees)
			if err != nil {
				return err
			}
		} else if Event.GetAction() == "closed" {
			logger.LogMessage("info", "Received a closed issue event")
		} else if Event.GetAction() == "reopened" {
			logger.LogMessage("info", "Received a reopened issue event")
		} else if utils.Contains(issueUpdateEvents, Event.GetAction()) {
			logger.LogMessage("info", "Received an %s issue event", Event.GetAction())
			repo := Event.Repo.GetFullName()
			issue := Event.GetIssue()
			daoID, err := getDAOIDForInstallation(Event.Installation.GetID())
			if err != nil {
				return err
			}
			assignees, err := github.GetMemberIDForAssignees(Event.GetIssue().Assignees)
			if err != nil {
				return err
			}
			err = project.UpdateTaskFromGithubEvent(daoID, repo, issue, assignees)
			if err != nil {
				return err
			}
		} else if Event.GetAction() == "milestoned" {
			logger.LogMessage("info", "Received a milestoned issue event")
		} else if Event.GetAction() == "demilestoned" {
			logger.LogMessage("info", "Received a demilestoned issue event")
		} else if Event.GetAction() == "locked" {
			logger.LogMessage("info", "Received a locked issue event")
		} else if Event.GetAction() == "unlocked" {
			logger.LogMessage("info", "Received an unlocked issue event")
		} else if Event.GetAction() == "transferred" {
			logger.LogMessage("info", "Received a transferred issue event")
		}
	// integrate someday
	// case *gh.ProjectEvent:
	// 	logger.LogMessage("info", "Received project event")
	// case *gh.ProjectCardEvent:
	// 	logger.LogMessage("info", "Received project card event")
	// case *gh.ProjectColumnEvent:
	// 	logger.LogMessage("info", "Received project column event")
	case *gh.PullRequestEvent:
		logger.LogMessage("info", "Received pull request event")
	case *gh.InstallationEvent:
		logger.LogMessage("info", "Received installation event")
	default:
		logger.LogMessage("info", "Received unknown event")
	}
	return nil
}
