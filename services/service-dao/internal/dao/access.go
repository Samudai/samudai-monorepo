package dao

import (
	"database/sql"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/lib/pq"
)

/* enum for access
0. hidden
1. view
3. manage_project
4. manage_dao
*/

func CreateAccess(access dao.Access) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO access (dao_id, access, members, roles) VALUES ($1::uuid, $2, $3::uuid[], $4::uuid[])`,
		access.DAOID, access.Access, pq.Array(access.Members), pq.Array(access.Roles))
	if err != nil {
		return fmt.Errorf("failed to create access: %w", err)
	}

	return nil
}

func CreateAccesses(admin, view []string, daoID string) error {
	var adminRoles, viewRoles []string
	var err error
	if admin != nil {
		adminRoles, err = GetDAORoleIds(admin)
		if err != nil {
			return fmt.Errorf("failed to get admin roles: %w", err)
		}
	}
	if view != nil {
		viewRoles, err = GetDAORoleIds(view)
		if err != nil {
			return fmt.Errorf("failed to get view roles: %w", err)
		}
	}
	accesses := []dao.Access{
		{
			DAOID:  daoID,
			Roles:  adminRoles,
			Access: dao.AccessTypeManageDAO,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManageProject,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManagePayment,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManageJob,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManageForum,
		},
		{
			DAOID:  daoID,
			Roles:  viewRoles,
			Access: dao.AccessTypeView,
		},
	}

	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	for _, access := range accesses {
		_, err := tx.Exec(`INSERT INTO access (dao_id, access, members, roles) VALUES ($1::uuid, $2, $3::uuid[], $4::uuid[])`,
			access.DAOID, access.Access, pq.Array(access.Members), pq.Array(access.Roles))
		if err != nil {
			return fmt.Errorf("failed to create access: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func UpdateAccesses(admin, view []string, daoID string) error {
	var adminRoles, viewRoles []string
	var err error
	if admin != nil {
		adminRoles, err = GetDAORoleIds(admin)
		if err != nil {
			return fmt.Errorf("failed to get admin roles: %w", err)
		}
	}
	if view != nil {
		viewRoles, err = GetDAORoleIds(view)
		if err != nil {
			return fmt.Errorf("failed to get view roles: %w", err)
		}
	}
	accesses := []dao.Access{
		{
			DAOID:  daoID,
			Roles:  adminRoles,
			Access: dao.AccessTypeManageDAO,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManageProject,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManagePayment,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManageJob,
		},
		{
			DAOID:  daoID,
			Access: dao.AccessTypeManageForum,
		},
		{
			DAOID:  daoID,
			Roles:  viewRoles,
			Access: dao.AccessTypeView,
		},
	}

	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	for _, access := range accesses {
		_, err := tx.Exec(`UPDATE access SET roles = $3::uuid[] WHERE dao_id=$1::uuid AND access = $2`,
			access.DAOID, access.Access, pq.Array(access.Roles))
		if err != nil {
			return fmt.Errorf("failed to create access: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func GetAccessByDAOID(daoID string) ([]dao.Access, error) {
	db := db.GetSQL()
	var accesses []dao.Access
	rows, err := db.Query(`SELECT id, dao_id, access, members, roles, created_at, updated_at 
		FROM access WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return accesses, fmt.Errorf("failed to get access: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var access dao.Access
		err := rows.Scan(&access.AccessID, &access.DAOID, &access.Access, pq.Array(&access.Members), pq.Array(&access.Roles), &access.CreatedAt, &access.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan access: %w", err)
		}
		accesses = append(accesses, access)
	}

	return accesses, nil
}

func UpdateAccess(access dao.Access) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE access SET members = $3::uuid[], roles = $4::uuid[], updated_at = CURRENT_TIMESTAMP WHERE access = $1 AND dao_id = $2::uuid`, access.Access, access.DAOID, pq.Array(access.Members), pq.Array(access.Roles))
	if err != nil {
		return fmt.Errorf("failed to update access: %w", err)
	}

	return nil
}

func UpdateAllAccesses(accesses []dao.Access) error {
	db := db.GetSQL()

	// Start a transaction for batch updates
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}

	// Flag to check if any update failed
	var updateErr error

	// Defer a function to handle rollback if needed
	defer func() {
		if updateErr != nil {
			tx.Rollback()
		}
	}()

	// Loop through each access and update it
	for _, access := range accesses {
		_, err := tx.Exec(`
			UPDATE access
			SET members = $3::uuid[], roles = $4::uuid[], updated_at = CURRENT_TIMESTAMP
			WHERE access = $1 AND dao_id = $2::uuid`,
			access.Access, access.DAOID, pq.Array(access.Members), pq.Array(access.Roles))

		if err != nil {
			// If any update fails, set the updateErr flag and return the error
			updateErr = fmt.Errorf("failed to update access: %w", err)
			return updateErr
		}
	}

	// Commit the transaction after all updates are successful
	if err := tx.Commit(); err != nil {
		// If the commit fails, set the updateErr flag and return the error
		updateErr = fmt.Errorf("failed to commit transaction: %w", err)
		return updateErr
	}

	return nil
}

func DeleteAccess(daoID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM access WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return fmt.Errorf("failed to delete access: %w", err)
	}

	return nil
}

func GetAccessForMember(memberID, daoID string) (*[]string, error) {
	db := db.GetSQL()
	var access []string
	err := db.QueryRow(`SELECT access FROM members_view WHERE dao_id = $1::uuid AND member_id = $2::uuid`, daoID, memberID).Scan(pq.Array(&access))
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get access: %w", err)
	}

	return &access, nil
}

func AddRoleDiscord(daoID, access, discordRoleID string) error {
	roleID, err := GetDAORoleIds([]string{discordRoleID})
	if err != nil {
		return fmt.Errorf("failed to get role id: %w", err)
	}

	if len(roleID) == 0 {
		return fmt.Errorf("role id not found")
	}

	db := db.GetSQL()
	_, err = db.Exec(`UPDATE access SET roles = array_append(roles, $1) WHERE dao_id = $2::uuid AND access = $3`, roleID[0], daoID, access)
	if err != nil {
		return fmt.Errorf("failed to add role discord: %w", err)
	}

	return nil
}

func AddMemberDiscord(daoID, MemberID string, access dao.AccessType) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE access SET members = array_append(members, $1) WHERE dao_id = $2::uuid AND access = $3`, MemberID, daoID, access)
	if err != nil {
		return fmt.Errorf("failed to add role member: %w", err)
	}

	return nil
}
