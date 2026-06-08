package github

import gh "github.com/google/go-github/v47/github"

type AuthPayload struct {
	ClientID     string `json:"client_id,omitempty"`
	ClientSecret string `json:"client_secret,omitempty"`
	Code         string `json:"code,omitempty"`
	RedirectURI  string `json:"redirect_uri,omitempty"`
	State        string `json:"state,omitempty"`
}

type SaveDAODataParam struct {
	Installation *gh.InstallationEvent `json:"installation_id"`
	DAOID        string                `json:"dao_id"`
	UserAccess   UserAccessTokenResp   `json:"user_access"`
}
