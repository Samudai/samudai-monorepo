package github

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	gh "github.com/google/go-github/v45/github"
)

func GetMemberIDForAssignees(assignees []*gh.User) ([]string, error) {
	url := fmt.Sprintf("%s/getmemberids", githubService)
	var logins []string
	for _, assignee := range assignees {
		logins = append(logins, assignee.GetLogin())
	}
	if len(logins) == 0 {
		return []string{}, nil
	}

	params := map[string]interface{}{
		"logins": logins,
	}
	resp, err := requester.Post(url, params)
	if err != nil {
		return nil, err
	}
	var memberIDs []string
	err = json.Unmarshal(resp, &memberIDs)
	if err != nil {
		return nil, err
	}

	return memberIDs, nil
}
