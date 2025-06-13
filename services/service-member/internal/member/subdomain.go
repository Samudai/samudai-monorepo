package member

import (

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
)

func AddSubdomainForMember(subdomain member.Subdomain) (string, error) {
	db := db.GetSQL()
	var subdomainID string
	err := db.QueryRow(`
			WITH cte AS (
				SELECT
				  access
				FROM subdomain
				WHERE member_id = $1::uuid
				LIMIT 1
			  )
			  INSERT INTO subdomain (member_id, subdomain, redirection_link, wallet_address, access, transaction_hash)
			  SELECT
				$1::uuid,
				$2,
				$3,
				$4,
				COALESCE((SELECT access FROM cte), $5),
				$6
			  RETURNING subdomain_id;`, subdomain.MemberID, subdomain.Subdomain, 
		subdomain.RedirectionLink, subdomain.WalletAddress, subdomain.Access, subdomain.TransactionHash).Scan(&subdomainID)
	if err != nil {
		return subdomainID, err
	}

	return subdomainID, nil
}

func GetSubdomainForMember(memberId string, Subdomain string) (member.Subdomain, error) {
	db := db.GetSQL();
	var subdomain member.Subdomain
	err := db.QueryRow(`SELECT subdomain_id, member_id, subdomain, redirection_link, wallet_address, 
	access, transaction_hash, created_at, updated_at from subdomain where member_id=$1 AND subdomain=$2`, memberId, Subdomain).Scan(&subdomain.SubdomainID, &subdomain.MemberID, &subdomain.Subdomain, 
	&subdomain.RedirectionLink, &subdomain.WalletAddress, &subdomain.Access, &subdomain.TransactionHash, &subdomain.CreatedAt, &subdomain.UpdatedAt)

	if err != nil {
		return subdomain, err
	}

	return subdomain, nil
}

func CheckSubdomainCreateForMember(memberId string) (bool, error) {
	db := db.GetSQL();
	var access bool
	err := db.QueryRow(`SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM subdomain WHERE member_id = $1 AND access = false) THEN 
            false 
        ELSE 
            true 
    END;`, memberId).Scan(&access)

	if err != nil {
		return access, err
	}

	return access, nil
}