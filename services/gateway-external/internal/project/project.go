package project

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-project/pkg/project"
)

// GetAllProject returns all projects
func GetAllProject() ([]project.Project, error) {
	url := fmt.Sprintf("%s/project/getall", projectService)
	respBody, err := requester.Get(url)
	if err != nil {
		return nil, err
	}

	var projects []project.Project
	err = json.Unmarshal(respBody, &projects)
	if err != nil {
		return nil, err
	}

	return projects, nil
}
