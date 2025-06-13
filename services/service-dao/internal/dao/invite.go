package dao

import (
	"database/sql"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
)

// CreateInvite creates a new invite for a dao
func CreateInvite(daoID, memberID string) (string, error) {
	db := db.GetSQL()
	inviteCode := RandString(12)
	_, err := db.Exec(`INSERT INTO dao_invites (dao_id, invite_code, created_by, valid_until) 
		VALUES ($1::uuid, $2, $3, CURRENT_TIMESTAMP + INTERVAL '3 day')`, daoID, inviteCode, memberID)
	if err != nil {
		return inviteCode, fmt.Errorf("error inserting dao invite: %w", err)
	}

	logger.LogMessage("info", "Added dao invite for dao ID: %s", daoID)
	return inviteCode, nil
}

// DeleteInvite deletes an existing invite for a dao
func DeleteInvite(id int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM dao_invites WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("error deleting dao invite: %w", err)
	}

	logger.LogMessage("info", "Deleted dao invite: %d", id)
	return nil
}

func AddMemberFromInvite(inviteCode, memberID string) (string, error) {
	db := db.GetSQL()
	var daoID string
	err := db.QueryRow(`SELECT dao_id FROM dao_invites WHERE invite_code = $1 AND CURRENT_TIMESTAMP < valid_until`, inviteCode).Scan(&daoID)
	if err != nil {
		return daoID, fmt.Errorf("invalid invite code: %w", err)
	}

	found := false
	err = db.QueryRow(`SELECT true FROM members WHERE dao_id = $1::uuid AND member_id = $2::uuid`, daoID, memberID).Scan(&found)
	if err != nil {
		if err != sql.ErrNoRows {
			return daoID, fmt.Errorf("error getting dao id from invite: %w", err)
		}
	}

	if !found {
		tx, err := db.Begin()
		if err != nil {
			return daoID, fmt.Errorf("error starting transaction: %w", err)
		}

		_, err = tx.Exec(`INSERT INTO members (dao_id, member_id) VALUES ($1::uuid, $2::uuid)`, daoID, memberID)
		if err != nil {
			return daoID, fmt.Errorf("error inserting invited member: %w", err)
		}

		var roleID string
		err = tx.QueryRow(`SELECT role_id FROM roles WHERE dao_id = $1::uuid AND name = '@everyone'`, daoID).Scan(&roleID)
		if err != nil {
			return daoID, fmt.Errorf("error getting role id from dao: %w", err)
		}

		_, err = tx.Exec(`INSERT INTO member_roles (dao_id, member_id, role_id) VALUES ($1::uuid, $2::uuid, $3::uuid)`, daoID, memberID, roleID)
		if err != nil {
			return daoID, fmt.Errorf("error inserting invited member role: %w", err)
		}

		err = tx.Commit()
		if err != nil {
			return daoID, fmt.Errorf("error committing transaction: %w", err)
		}
	}

	logger.LogMessage("info", "Added member for invite code: %s", inviteCode)
	return daoID, nil
}
