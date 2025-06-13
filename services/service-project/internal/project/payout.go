package project

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-project/pkg/project"
)

func CreatePayout(payout project.Payout) (string, error) {
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
		name, receiver_address, payout_amount, payout_currency, token_address, completed, member_id)
		VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6, $7, $8, $9, $10)
		RETURNING payout_id`, payout.ProviderID, payout.LinkType, payout.LinkID,
		payout.Name, payout.ReceiverAddress, payout.PayoutAmount, payoutCur,
		payout.TokenAddress, payout.Completed, payout.MemberID).Scan(&payoutID)
	if err != nil {
		return payoutID, fmt.Errorf("failed to create payout: %w", err)
	}

	return payoutID, nil
}

func CreateBulkPayout(payouts []project.Payout) ([]string, error) {
	db := db.GetSQL()
	var payoutIDs []string

	stmt, err := db.Prepare(`INSERT INTO payout (provider_id, link_type, link_id,
		name, receiver_address, payout_amount, payout_currency, token_address, completed, member_id)
		VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6, $7, $8, $9, $10)
		RETURNING payout_id`)
	if err != nil {
		return payoutIDs, fmt.Errorf("failed to prepare statement: %w", err)
	}

	defer stmt.Close()

	for _, payout := range payouts {
		var payoutID string
		var payoutCur *string

		if payout.PayoutCurrency != nil {
			payoutCur, err = convertToJSONString(payout.PayoutCurrency)
			if err != nil {
				return payoutIDs, fmt.Errorf("error converting payout to JSON: %w", err)
			}
		}

		err = stmt.QueryRow(payout.ProviderID, payout.LinkType, payout.LinkID,
			payout.Name, payout.ReceiverAddress, payout.PayoutAmount, payoutCur,
			payout.TokenAddress, payout.Completed, payout.MemberID).Scan(&payoutID)

		if err != nil {
			return payoutIDs, fmt.Errorf("failed to create payout: %w", err)
		}

		payoutIDs = append(payoutIDs, payoutID)
	}

	return payoutIDs, nil
}

func UpdatePayout(payout project.Payout) error {
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
	payout_amount = $5, payout_currency = $6, token_address = $7, completed = $8, member_id = $9,  updated_at = CURRENT_TIMESTAMP 
	WHERE payout_id = $1`, payout.PayoutID, payout.ProviderID, payout.Name, payout.ReceiverAddress, payout.PayoutAmount,
		payoutCur, payout.TokenAddress, payout.Completed, payout.MemberID)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func UpdatePayoutStatus(payoutId string, completed bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE payout SET completed = $2, updated_at = CURRENT_TIMESTAMP 
	WHERE payout_id = $1`, payoutId, completed)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func UpdatePayoutPaymentStatus(payoutId string, payementStatus project.PayoutPaymentStatus) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE payout SET payment_status = $2, updated_at = CURRENT_TIMESTAMP 
	WHERE payout_id = $1`, payoutId, payementStatus)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func CompletePayout(payoutId string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE payout SET payment_status = $2, completed = true, updated_at = CURRENT_TIMESTAMP 
	WHERE payout_id = $1`, payoutId, project.PayoutPaymentCompleted)

	if err != nil {
		return fmt.Errorf("failed to update payout: %w", err)
	}

	return nil
}

func GetPayoutbyID(payoutID string) (project.Payout, error) {
	db := db.GetSQL()
	var payout project.Payout
	var currencyJSON *json.RawMessage
	err := db.QueryRow(`SELECT payout_id, provider_id, link_type, link_id,
		name, member_id, receiver_address, payout_amount, payout_currency, token_address, completed FROM payout
		WHERE payout_id = $1::uuid`, payoutID).Scan(&payout.PayoutID, &payout.ProviderID,
		&payout.LinkType, &payout.LinkID, &payout.Name, &payout.MemberID, &payout.ReceiverAddress, &payout.PayoutAmount,
		&currencyJSON, &payout.TokenAddress, &payout.Completed)

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

func GetUninitiatedPayoutbyDAOID(daoID string) ([]project.PendingPayout, error) {
	db := db.GetSQL()
	var payouts []project.PendingPayout
	rows, err := db.Query(`SELECT payout_id, dao_id, provider, link_type, link_id, project_id,
	member_id, receiver_address, payout_amount, payout_currency, token_address, payment_created, completed,
	initiated_by, created_at, updated_at FROM pending_payouts
	WHERE dao_id = $1::uuid AND payment_created = false`, daoID)

	if err != nil {
		return payouts, fmt.Errorf("payout not found: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var provider, currencyJSON, initiatedByJSON *json.RawMessage
		var payout project.PendingPayout
		err := rows.Scan(&payout.PayoutID, &payout.DAOID, &provider,
			&payout.LinkType, &payout.LinkID, &payout.ProjectID, &payout.MemberID, &payout.ReceiverAddress, &payout.PayoutAmount,
			&currencyJSON, &payout.TokenAddress, &payout.PaymentCreated, &payout.Completed, 
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

func UpdatePayoutInitatedBy(payouts []project.Payout, initiated_by string) error {
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
