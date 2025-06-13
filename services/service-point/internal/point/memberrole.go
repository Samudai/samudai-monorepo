package point

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

func CreateDAOMemberRole(memberRole point.MemberRole) (string, error) {
	db := db.GetSQL()
	var memberRoleID string
	err := db.QueryRow(`INSERT INTO member_roles (point_id, member_id, role_id) VALUES ($1::uuid, $2::uuid, $3::uuid) RETURNING id`,
		memberRole.PointID, memberRole.MemberID, memberRole.RoleID).Scan(&memberRoleID)
	if err != nil {
		return memberRoleID, err
	}

	logger.LogMessage("info", "Added role: %s to Point member ID: %s", memberRole.RoleID, memberRole.MemberID)
	return memberRoleID, nil
}

func DeleteDAOMemberRole(memberRoleID int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM member_roles WHERE id = $1`, memberRoleID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted member role ID: %d", memberRoleID)
	return nil
}

func CreateMemberRolesDiscord(members []point.MemberRoleDiscord) error {
	db := db.GetSQL()

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, member := range members {
		if len(member.DiscordRoleIDs) == 0 {
			continue
		}
		roleIDs, err := GetPointRoleIds(member.DiscordRoleIDs)
		if err != nil {
			logger.LogMessage("error", "Error getting DAO role IDs: %v", err)
			return err
		}

		if len(roleIDs) == 0 {
			continue
		}

		for _, role := range roleIDs {
			_, err = tx.Exec(`INSERT INTO member_roles (point_id, member_id, role_id) VALUES ($1::uuid, $2::uuid, $3::uuid)`, member.PointID, member.MemberID, role)
			if err != nil {
				return fmt.Errorf("Error executing statement: %w", err)
			}
		}

		logger.LogMessage("info", "Added roles: %v to DAO member ID: %s", roleIDs, member.MemberID)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

func DeleteMemberRolesDiscord(members []point.MemberRoleDiscord) error {
	db := db.GetSQL()

	for _, member := range members {
		if len(member.DiscordRoleIDs) == 0 {
			continue
		}
		roleIDs, err := GetPointRoleIds(member.DiscordRoleIDs)
		if err != nil {
			logger.LogMessage("error", "Error getting Point role IDs: %v", err)
			continue
		}

		if len(roleIDs) == 0 {
			continue
		}

		_, err = db.Exec(`DELETE FROM member_roles WHERE point_id = $1::uuid AND member_id = $2::uuid AND role_id = ANY($3::uuid[])`, member.PointID, member.MemberID, pq.StringArray(roleIDs))
		if err != nil {
			return err
		}

	}

	return nil
}