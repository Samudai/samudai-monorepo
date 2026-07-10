package gcal

import "golang.org/x/oauth2"

type MemberData struct {
	LinkID string        `json:"link_id" bson:"_id"`
	Token  *oauth2.Token `json:"token" bson:"token"`
	Email  string        `json:"email" bson:"email"`
}
