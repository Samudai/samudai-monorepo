package github

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/Samudai/service-plugin/pkg/github"
)

type GithubError struct {
	github.UserAccessTokenResp
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description"`
}

func GetAccessToken(code, redirectURI string) (*github.UserAccessTokenResp, error) {
	authPayload := &github.AuthPayload{
		ClientID:     os.Getenv("GITHUB_OAUTH_APP_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_OAUTH_APP_CLIENT_SECRET"),
		Code:         code,
		RedirectURI:  redirectURI,
	}

	return githubAuth(authPayload)
}

func GetAppAccessToken(code, state, redirectURI string) (*github.UserAccessTokenResp, error) {
	authPayload := &github.AuthPayload{
		ClientID:     os.Getenv("GITHUB_APP_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_APP_CLIENT_SECRET"),
		Code:         code,
		State:        state,
		RedirectURI:  redirectURI,
	}

	return githubAuth(authPayload)
}

func githubAuth(payload *github.AuthPayload) (*github.UserAccessTokenResp, error) {
	var err error

	body := &bytes.Buffer{}
	if payload != nil {
		err = json.NewEncoder(body).Encode(payload)
		if err != nil {
			return nil, fmt.Errorf("github: failed to encode filter to JSON: %w", err)
		}
	}

	client := &http.Client{}
	url := "https://github.com/login/oauth/access_token"
	req, err := http.NewRequest(http.MethodPost, url, body)

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	bodyByte, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var result GithubError
	err = json.Unmarshal(bodyByte, &result)
	if err != nil {
		return nil, err
	}
	if result.Error != "" {
		return nil, fmt.Errorf("github: failed to get access token: %s", result.Error)
	}

	return &result.UserAccessTokenResp, nil
}
