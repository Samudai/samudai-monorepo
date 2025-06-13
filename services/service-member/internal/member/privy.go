package member

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
)

func AddPrivyMember(Privy member.Privy) (string, error) {
	db := db.GetSQL()
	var memberID string
	var GoogleJSON []byte
	var GithubJSON []byte
	var err error
	if Privy.PrivyGoogle != nil {
		GoogleJSON, err = json.Marshal(Privy.PrivyGoogle)
		if err != nil {
			return memberID, fmt.Errorf("error marshalling google details: %w", err)
		}
	}
	if Privy.PrivyGithub != nil {
		GithubJSON, err = json.Marshal(Privy.PrivyGithub)
		if err != nil {
			return memberID, fmt.Errorf("error marshalling github details: %w", err)
		}
	}

	err = db.QueryRow(`
			  INSERT INTO privy_member (member_id, privy_did, privy_email, privy_google, privy_github)
			  VALUES ($1::uuid, $2, $3, $4, $5)
			  RETURNING member_id;`, Privy.MemberID, Privy.PrivyDID,
		Privy.PrivyEmail, GoogleJSON, GithubJSON).Scan(&memberID)

	if err != nil {
		return memberID, err
	}

	return memberID, nil
}
