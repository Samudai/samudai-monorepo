package dao

import (
	"github.com/Samudai/backend/services/dao/pkg/dao"
	"github.com/Samudai/backend/shared/sqldb"
)

func AddSubdomainForDao(subdomain dao.Subdomain) (string, error) {
	db := sqldb.Dao()
	var subdomainID string
	err := db.QueryRow(`
			WITH cte AS (
				SELECT
				  access
				FROM subdomain
				WHERE dao_id = $1::uuid
				LIMIT 1
			  )
			  INSERT INTO subdomain (dao_id, subdomain, redirection_link, wallet_address, access, transaction_hash)
			  SELECT
				$1::uuid,
				$2,
				$3,
				$4,
				COALESCE((SELECT access FROM cte), $5),
				$6
			  RETURNING subdomain_id;`, subdomain.DaoID, subdomain.Subdomain,
		subdomain.RedirectionLink, subdomain.WalletAddress, subdomain.Access, subdomain.TransactionHash).Scan(&subdomainID)
	if err != nil {
		return subdomainID, err
	}

	return subdomainID, nil
}

func GetSubdomainForDao(daoId string, Subdomain string) (dao.Subdomain, error) {
	db := sqldb.Dao()
	var subdomain dao.Subdomain
	err := db.QueryRow(`SELECT subdomain_id, dao_id, subdomain, redirection_link, wallet_address, 
	access, transaction_hash, created_at, updated_at from subdomain where dao_id=$1 AND subdomain=$2`, daoId, Subdomain).Scan(&subdomain.SubdomainID, &subdomain.DaoID, &subdomain.Subdomain,
		&subdomain.RedirectionLink, &subdomain.WalletAddress, &subdomain.Access, &subdomain.TransactionHash, &subdomain.CreatedAt, &subdomain.UpdatedAt)

	if err != nil {
		return subdomain, err
	}

	return subdomain, nil
}

func CheckSubdomainCreateForDao(daoId string) (bool, error) {
	db := sqldb.Dao()
	var access bool
	err := db.QueryRow(`SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM subdomain WHERE dao_id = $1 AND access = false) THEN 
            false 
        ELSE 
            true 
    END;`, daoId).Scan(&access)

	if err != nil {
		return access, err
	}

	return access, nil
}
