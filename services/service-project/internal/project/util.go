package project

import (
	"encoding/json"

	gh "github.com/google/go-github/v45/github"
)

func convertToJSONString(in interface{}) (*string, error) {
	bytes, err := json.Marshal(in)
	if err != nil {
		return nil, err
	}
	str := string(bytes)
	return &str, err
}

func parseLabels(labels []*gh.Label) []string {
	var parsedLabels []string
	for _, label := range labels {
		parsedLabels = append(parsedLabels, label.GetName())
	}
	return parsedLabels
}
