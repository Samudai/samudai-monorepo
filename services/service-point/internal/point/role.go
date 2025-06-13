package point

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

func CreatePointRole(role point.Role) (string, error) {
	db := db.GetSQL()
	var roleID string
	err := db.QueryRow(`INSERT INTO roles (point_id, name, discord_role_id)
		VALUES ($1::uuid, $2, $3) RETURNING role_id`,
		role.PointID, role.Name, role.DiscordRoleID).Scan(&roleID)
	if err != nil {
		return roleID, err
	}
	logger.LogMessage("info", "Added DAO role ID: %s to DAO ID: %s", roleID, role.PointID)

	return roleID, nil
}
func UpdateDiscordRole(role point.Role) error {
	db := db.GetSQL()
	var roleID string
	err := db.QueryRow(`UPDATE roles SET name = $3, updated_at = CURRENT_TIMESTAMP WHERE point_id = $1::uuid AND discord_role_id = $2 RETURNING role_id`,
		role.PointID, role.DiscordRoleID, role.Name).Scan(&roleID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated Point role ID: %s from Discord role ID: %s", roleID, role.DiscordRoleID)

	return nil
}

func CreatePointRoles(roles []point.Role) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, role := range roles {
		_, err = tx.Exec(`INSERT INTO roles (point_id, name, discord_role_id) VALUES ($1::uuid, $2, $3)`, role.PointID, role.Name, role.DiscordRoleID)
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

func ListPointRoles(pointID string) ([]point.Role, error) {
	db := db.GetSQL()
	var roles []point.Role
	rows, err := db.Query(`SELECT role_id, point_id, name, discord_role_id, created_at, updated_at 
		FROM roles WHERE point_id = $1::uuid`, pointID)
	if err != nil {
		return roles, err
	}

	defer rows.Close()

	for rows.Next() {
		var role point.Role
		err := rows.Scan(&role.RoleID, &role.PointID, &role.Name, &role.DiscordRoleID, &role.CreatedAt, &role.UpdatedAt)
		if err != nil {
			return roles, err
		}
		roles = append(roles, role)
	}

	return roles, nil
}

func GetPointRoleIds(discordRoleIDs []string) ([]string, error) {
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
