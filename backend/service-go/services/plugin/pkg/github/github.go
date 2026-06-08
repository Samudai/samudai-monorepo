package github

import gh "github.com/google/go-github/v47/github"

type DAOData struct {
	DAOID          string                `json:"dao_id" bson:"_id"`
	UserAccess     UserAccessTokenResp   `json:"user_access" bson:"user_access"`
	InstallationID int64                 `json:"installation_id" bson:"installation_id"`
	Installation   *gh.InstallationEvent `json:"installation" bson:"installation"`
}

type UserAccessTokenResp struct {
	AccessToken string `json:"access_token" bson:"access_token"`
	Scope       string `json:"scope" bson:"scope"`
	TokenType   string `json:"token_type" bson:"token_type"`
}

type MemberData struct {
	MemberID   string              `json:"member_id" bson:"_id"`
	UserAccess UserAccessTokenResp `json:"user_access" bson:"user_access"`
	User       gh.User             `json:"user" bson:"user"`
}
