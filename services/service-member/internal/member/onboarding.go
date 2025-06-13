package member

import (
	"database/sql"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-member/pkg/member"
)

func CreateOnboarding(onboarding member.Onboarding) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO onboarding (member_id, admin, contributor, invite_code) VALUES ($1, $2, $3, $4)`, onboarding.MemberID, onboarding.Admin, onboarding.Contributor, onboarding.InviteCode)
	if err != nil {
		return fmt.Errorf("error inserting onboarding: %w", err)
	}

	logger.LogMessage("info", "Added onboarding for member ID: %s", onboarding.MemberID)

	return nil
}

func UpdateOnboarding(onboarding member.Onboarding) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE onboarding SET admin = $2, contributor = $3, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1`, onboarding.MemberID, onboarding.Admin, onboarding.Contributor)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated onboarding for member ID: %s", onboarding.MemberID)

	return nil
}

func RequestNFT(MemberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO member_nft_claims (member_id, requested, approved, updated_at) VALUES ( $1, true, false, CURRENT_TIMESTAMP)`, MemberID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Successfully requested NFT for member ID: %s", MemberID)

	return nil
}




func RequestSubdomain(MemberID string, Subdomain string, WalletAddress string) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO member_subdomains (subdomain_requested, member_id, wallet_address, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT (member_id) DO UPDATE
    SET subdomain_requested = EXCLUDED.subdomain_requested, updated_at = EXCLUDED.updated_at, wallet_address = EXCLUDED.wallet_address
	WHERE member_subdomains.member_id = $2 AND member_subdomains.approved = false;
	`, Subdomain, MemberID, WalletAddress)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Successfully requested Subdomain for member ID: %s", MemberID)

	return nil
}


func CheckSubdomain(subdomain string) (bool, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT count(*) FROM member_subdomains WHERE subdomain_requested = $1 AND approved = true`, subdomain).Scan(&count)

	if err != nil {
		return false, fmt.Errorf("error checking subdomain: %w", err)
	}

	if count > 0 {
		return true, nil
	}

	return false, nil
}

func FetchSubdomainByMemberID(memberId string) (*member.SubdomainInfo, error) {
	db := db.GetSQL()
	
	var Subdomain member.SubdomainInfo
	
	err := db.QueryRow(`SELECT member_id, subdomain_requested, approved, wallet_address
		FROM member_subdomains
		WHERE member_id = $1`, memberId).Scan(&Subdomain.MemberID, &Subdomain.SubdomainRequested, &Subdomain.Approved, &Subdomain.WalletAddress)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &Subdomain, nil
}

func GetOnboarding(memberID string) (*member.Onboarding, error) {
	db := db.GetSQL()
	var onboarding member.Onboarding
	err := db.QueryRow(`SELECT member_id, admin, contributor FROM onboarding WHERE member_id = $1`, memberID).Scan(&onboarding.MemberID, &onboarding.Admin, &onboarding.Contributor)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &onboarding, nil
}
