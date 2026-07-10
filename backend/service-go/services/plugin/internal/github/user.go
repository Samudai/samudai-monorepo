package github

import (
	"context"

	gh "github.com/google/go-github/v47/github"
)

func GetUser(auth string) (*gh.User, error) {
	ghClient, err := InitGitHubOauthClient(auth)
	if err != nil {
		return nil, err
	}

	user, _, err := ghClient.Users.Get(context.Background(), "")
	if err != nil {
		return nil, err
	}

	return user, nil
}
