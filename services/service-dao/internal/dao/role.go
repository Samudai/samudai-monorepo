package dao

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/lib/pq"
)

func CreateDAORole(role dao.Role) (string, error) {
	db := db.GetSQL()
	var roleID string
	err := db.QueryRow(`INSERT INTO roles (dao_id, name, discord_role_id)
		VALUES ($1::uuid, $2, $3) RETURNING role_id`,
		role.DAOID, role.Name, role.DiscordRoleID).Scan(&roleID)
	if err != nil {
		return roleID, err
	}
	logger.LogMessage("info", "Added DAO role ID: %s to DAO ID: %s", roleID, role.DAOID)

	return roleID, nil
}

func CreateDAORoles(roles []dao.Role) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, role := range roles {
		_, err = tx.Exec(`INSERT INTO roles (dao_id, name, discord_role_id) VALUES ($1::uuid, $2, $3)`, role.DAOID, role.Name, role.DiscordRoleID)
		if err != nil {
			return fmt.Errorf("Error executing statement: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

func UpdateDAORoles(roles []dao.Role) error {
	db := db.GetSQL()
	for _, role := range roles {
		_, err := db.Exec(`UPDATE roles SET name = $3, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $1::uuid AND role_id = $2::uuid`,
			role.DAOID, role.RoleID, role.Name)
		if err != nil {
			return err
		}

		logger.LogMessage("info", "Updated DAO role ID: %s from DAO ID: %s", role.RoleID, role.DAOID)
	}
	return nil
}

func UpdateDiscordRole(role dao.Role) error {
	db := db.GetSQL()
	var roleID string
	err := db.QueryRow(`UPDATE roles SET name = $3, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $1::uuid AND discord_role_id = $2 RETURNING role_id`,
		role.DAOID, role.DiscordRoleID, role.Name).Scan(&roleID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO role ID: %s from Discord role ID: %s", roleID, role.DiscordRoleID)

	return nil
}

func ListDAORoles(daoID string) ([]dao.Role, error) {
	db := db.GetSQL()
	var roles []dao.Role
	rows, err := db.Query(`SELECT role_id, dao_id, name, discord_role_id, created_at, updated_at 
		FROM roles WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return roles, err
	}

	defer rows.Close()

	for rows.Next() {
		var role dao.Role
		err := rows.Scan(&role.RoleID, &role.DAOID, &role.Name, &role.DiscordRoleID, &role.CreatedAt, &role.UpdatedAt)
		if err != nil {
			return roles, err
		}
		roles = append(roles, role)
	}

	return roles, nil
}

func ListMemberRoles(daoID, memberID string) ([]dao.Role, error) {
	db := db.GetSQL()
	var roles []dao.Role
	rows, err := db.Query(`SELECT dr.role_id, dr.dao_id, dr.name, dr.discord_role_id, dr.created_at, dr.updated_at 
		FROM member_roles mr
		JOIN roles dr ON dr.role_id = mr.role_id
		WHERE mr.dao_id = $1::uuid AND mr.member_id = $2::uuid`, daoID, memberID)
	if err != nil {
		return roles, err
	}

	defer rows.Close()

	for rows.Next() {
		var role dao.Role
		err := rows.Scan(&role.RoleID, &role.DAOID, &role.Name, &role.DiscordRoleID, &role.CreatedAt, &role.UpdatedAt)
		if err != nil {
			return roles, err
		}
		roles = append(roles, role)
	}

	return roles, nil
}

func DeleteDAORole(daoID, roleID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM roles WHERE dao_id = $1::uuid AND role_id = $2::uuid`, daoID, roleID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted DAO role ID: %s from DAO ID: %s", roleID, daoID)

	return nil
}

func GetDAORoleIds(discordRoleIDs []string) ([]string, error) {
	db := db.GetSQL()
	var roleIDs []string
	rows, err := db.Query(`SELECT role_id FROM roles WHERE discord_role_id = ANY($1)`, pq.Array(discordRoleIDs))
	if err != nil {
		return roleIDs, err
	}

	defer rows.Close()

	for rows.Next() {
		var roleID string
		err := rows.Scan(&roleID)
		if err != nil {
			return roleIDs, err
		}

		roleIDs = append(roleIDs, roleID)
	}

	return roleIDs, nil
}
