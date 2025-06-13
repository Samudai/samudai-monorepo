package job

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-job/pkg/job"
)

func convertToJSONString(in interface{}) (*string, error) {
	bytes, err := json.Marshal(in)
	if err != nil {
		return nil, err
	}
	str := string(bytes)
	return &str, err
}

func CreatePayout(payout job.Payout) (string, error) {
	db := db.GetSQL()
	var payoutID string
	var payoutCur *string
	var err error

	if payout.PayoutCurrency != nil {
		payoutCur, err = convertToJSONString(payout.PayoutCurrency)
		if err != nil {
			return payoutID, fmt.Errorf("error converting payout to json: %w", err)
		}
	}

	err = db.QueryRow(`INSERT INTO payout (provider_id, link_type, link_id,
		name, receiver_address, payout_amount, payout_currency, token_address, completed, member_id, status, rank)
		VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6, $7, $8, $9, $10::uuid, $11, $12)
		RETURNING payout_id`, payout.ProviderID, payout.LinkType, payout.LinkID,
		payout.Name, payout.ReceiverAddress, payout.PayoutAmount, payoutCur,
		payout.TokenAddress, payout.Completed, payout.MemberID, payout.Status, payout.Rank).Scan(&payoutID)
	if err != nil {
		return payoutID, fmt.Errorf("failed to create payout: %w", err)
	}

	return payoutID, nil
}

func CreateMultiplePayouts(payout job.Payout, count int) ([]string, error) {
	db := db.GetSQL()
	var payoutIDs []string
	var payoutCur *string
	var err error

	if payout.PayoutCurrency != nil {
		payoutCur, err = convertToJSONString(payout.PayoutCurrency)
		if err != nil {
			return payoutIDs, fmt.Errorf("error converting payout to json: %w", err)
		}
	}

	// Loop to create multiple payouts
	for i := 0; i < count; i++ {
		var payoutID string
		err = db.QueryRow(`
			INSERT INTO payout (provider_id, link_type, link_id,
				name, receiver_address, payout_amount, payout_currency, token_address, completed, member_id, status, rank)
			VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6, $7, $8, $9, $10::uuid, $11, $12)
			RETURNING payout_id`,
			payout.ProviderID, payout.LinkType, payout.LinkID,
			payout.Name, payout.ReceiverAddress, payout.PayoutAmount, payoutCur,
			payout.TokenAddress, payout.Completed, payout.MemberID, payout.Status, payout.Rank,
		).Scan(&payoutID)

		if err != nil {
			return payoutIDs, fmt.Errorf("failed to create payout: %w", err)
		}

		payoutIDs = append(payoutIDs, payoutID)
	}

	return payoutIDs, nil
}

func UpdatePayout(payout job.Payout) error {
	db := db.GetSQL()
	var payoutCur *string
	var err error

	if payout.PayoutCurrency != nil {
		payoutCur, err = convertToJSONString(payout.PayoutCurrency)
		if err != nil {
			return fmt.Errorf("error converting payout to json: %w", err)
		}
	}

	_, err = db.Exec(`UPDATE payout SET provider_id = $2, name = $3, receiver_address = $4,
	payout_amount = $5, payout_currency = $6, token_address = $7, completed = $8, member_id = $9, rank = $10, updated_at = CURRENT_TIMESTAMP 
	WHERE payout_id = $1`, payout.PayoutID, payout.ProviderID, payout.Name, payout.ReceiverAddress, payout.PayoutAmount,
		payoutCur, payout.TokenAddress, payout.Completed, payout.MemberID, payout.Rank)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func UpdatePayoutStatus(payoutId string, status job.PayoutStatusType) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE payout SET status = $2, updated_at = CURRENT_TIMESTAMP 
	WHERE payout_id = $1`, payoutId, status)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func CompletePayout(payoutId string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE payout SET completed = true, status = $2, updated_at = CURRENT_TIMESTAMP 
    WHERE payout_id = $1`, payoutId, job.PayoutStatusTypeCompleted)

	if err != nil {
		return fmt.Errorf("failed to complete payout: %w", err)
	}

	return nil
}

func UpdatePayoutByLinkIdForTransaction(linkId string, receiverAddress string, status job.PayoutStatusType,
	memberId string, rank int) error {
	db := db.GetSQL()

	// Use a common table expression (CTE) to assign row numbers for each combination of link_id, status, and rank
	query := `
        WITH ranked_payouts AS (
            SELECT 
                id, 
                ROW_NUMBER() OVER (PARTITION BY link_id, status, rank ORDER BY id) AS row_num
            FROM payout 
            WHERE link_id = $1::uuid AND status = $5 AND rank <= $6
        )
        UPDATE payout 
        SET receiver_address = $2, status = $3, member_id = $4, updated_at = CURRENT_TIMESTAMP
        FROM ranked_payouts
        WHERE payout.id = ranked_payouts.id AND row_num = 1
    `

	_, err := db.Exec(query, linkId, receiverAddress, status, memberId, job.PayoutStatusTypeUnassigned, rank)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func UpdatePayoutByLinkIdAndRank(linkId string, rank int, recieverAddress string, status job.PayoutStatusType,
	memberId string, initiated_by string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE payout SET receiver_address = $2, status = $3, member_id = $4, initiated_by = $5, updated_at = CURRENT_TIMESTAMP
	WHERE link_id = $1::uuid AND rank = $6`,
		linkId, recieverAddress, status, memberId, initiated_by, rank)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func GetPayoutbyID(payoutID string) (job.Payout, error) {
	db := db.GetSQL()
	var payout job.Payout
	var currencyJSON *json.RawMessage
	err := db.QueryRow(`SELECT payout_id, provider_id, link_type, link_id,
		name, member_id, receiver_address, payout_amount, payout_currency, token_address, completed, status, rank FROM payout
		WHERE payout_id = $1::uuid`, payoutID).Scan(&payout.PayoutID, &payout.ProviderID,
		&payout.LinkType, &payout.LinkID, &payout.Name, &payout.MemberID, &payout.ReceiverAddress, &payout.PayoutAmount,
		&currencyJSON, &payout.TokenAddress, &payout.Completed, &payout.Status, &payout.Rank)

	if currencyJSON != nil {
		err = json.Unmarshal(*currencyJSON, &payout.PayoutCurrency)
		if err != nil {
			return payout, err
		}
	}

	if err != nil {
		return payout, fmt.Errorf("payout not found: %w", err)
	}

	return payout, err
}

func GetUninitiatedPayoutForDao(daoID string) ([]job.PendingPayout, error) {
	db := db.GetSQL()
	var payouts []job.PendingPayout
	rows, err := db.Query(`SELECT payout_id, dao_id, provider, link_type, link_id,
	member_id, receiver_address, payout_amount, payout_currency, token_address, name, 
	completed, status, initiated_by, created_at, updated_at FROM pending_payouts
	WHERE dao_id = $1::uuid`, daoID)

	if err != nil {
		return payouts, fmt.Errorf("payout not found: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var provider, currencyJSON, initiatedByJSON *json.RawMessage
		var payout job.PendingPayout
		err := rows.Scan(&payout.PayoutID, &payout.DAOID, &provider,
			&payout.LinkType, &payout.LinkID, &payout.MemberID, &payout.ReceiverAddress, &payout.PayoutAmount,
			&currencyJSON, &payout.TokenAddress, &payout.Name, &payout.Completed, &payout.Status,
			&initiatedByJSON, &payout.CreatedAt, &payout.UpdatedAt)
		if err != nil {
			return payouts, fmt.Errorf("Error scanning Payout: %w", err)
		}

		if provider != nil {
			err = json.Unmarshal([]byte(*provider), &payout.Provider)
			if err != nil {
				return payouts, fmt.Errorf("Error scanning Payout: %w", err)
			}
		}

		if currencyJSON != nil {
			err = json.Unmarshal(*currencyJSON, &payout.PayoutCurrency)
			if err != nil {
				return payouts, fmt.Errorf("Error scanning Payout: %w", err)
			}
		}

		if initiatedByJSON != nil {
			err = json.Unmarshal(*initiatedByJSON, &payout.InitiatedBy)
			if err != nil {
				return payouts, fmt.Errorf("Error scanning Payout: %w", err)
			}
		}

		payouts = append(payouts, payout)
	}

	return payouts, err
}

func UpdatePayoutInitatedBy(payouts []job.Payout, initiated_by string) error {
	db := db.GetSQL()

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	for _, payout := range payouts {
		_, err := tx.Exec(`
			UPDATE payout 
			SET initiated_by = $2 
			WHERE payout_id = $1
		`, payout.PayoutID, initiated_by)

		if err != nil {
			return fmt.Errorf("failed to update payout : %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func DeletePayout(payoutID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM payout WHERE payout_id = $1::uuid`, payoutID)
	if err != nil {
		return fmt.Errorf("failed to delete payout: %w", err)
	}
	logger.LogMessage("info", "Deleted payout ID: %s", payoutID)

	return nil
}
