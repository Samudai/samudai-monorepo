package point

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

/* enum for access
0. member
1. admin
3. owner
*/

func CreateAccess(access point.Access) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO access (point_id, access, members, roles) VALUES ($1::uuid, $2, $3::uuid[], $4::uuid[])`,
		access.PointID, access.Access, pq.Array(access.Members), pq.Array(access.Roles))
	if err != nil {
		return fmt.Errorf("failed to create access: %w", err)
	}

	return nil
}

func GetAccessByPointID(pointID string) ([]point.AccessView, error) {
	db := db.GetSQL()
	var accesses []point.AccessView
	rows, err := db.Query(`
    SELECT a.id, a.point_id, a.access, 
           json_agg(json_build_object('member_id', m.member_id, 'name', m.name, 'email', m.email)) AS members,
           a.roles, a.created_at, a.updated_at
    FROM access a
    LEFT JOIN members m ON m.member_id = ANY(a.members)
    WHERE a.point_id = $1::uuid
    GROUP BY a.id, a.point_id, a.access, a.roles, a.created_at, a.updated_at
`, pointID)
	if err != nil {
		return accesses, fmt.Errorf("failed to get access: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var access point.AccessView
		var membersJSON []byte
		err := rows.Scan(&access.AccessID, &access.PointID, &access.Access, &membersJSON, pq.Array(&access.Roles), &access.CreatedAt, &access.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan access: %w", err)
		}
		err = json.Unmarshal(membersJSON, &access.Members)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal members JSON: %w", err)
		}
		accesses = append(accesses, access)
	}

	return accesses, nil

}

func UpdateAccess(access point.Access) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE access SET members = $3::uuid[], roles = $4::uuid[], updated_at = CURRENT_TIMESTAMP WHERE access = $1 AND point_id = $2::uuid`, access.Access, access.PointID, pq.Array(access.Members), pq.Array(access.Roles))
	if err != nil {
		return fmt.Errorf("failed to update access: %w", err)
	}

	return nil
}

func UpdateAllAccesses(accesses []point.Access) error {
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
			WHERE access = $1 AND point_id = $2::uuid`,
			access.Access, access.PointID, pq.Array(access.Members), pq.Array(access.Roles))

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

func DeleteAccess(pointID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM access WHERE point_id = $1::uuid`, pointID)
	if err != nil {
		return fmt.Errorf("failed to delete access: %w", err)
	}

	return nil
}

func GetAccessForMember(memberID, pointID string) (*[]string, error) {
	db := db.GetSQL()
	var access []string
	err := db.QueryRow(`SELECT access FROM member_points_view WHERE point_id = $1::uuid AND member_id = $2::uuid`, pointID, memberID).Scan(pq.Array(&access))
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get access: %w", err)
	}

	return &access, nil
}

type MemberAccessInfo struct {
	Access  []string `json:"access"`
	Name    string   `json:"name"`
	PointID string   `json:"point_id"`
}

func GetAccessForMemberByGuildId(discordUserID, guildID string) (*MemberAccessInfo, error) {
	db := db.GetSQL()

	var memberID string
	err := db.QueryRow(`SELECT member_id FROM discord WHERE discord_user_id = $1`, discordUserID).Scan(&memberID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("discord user not found")
		}
		return nil, fmt.Errorf("failed to fetch member_id: %w", err)
	}

	var access []string
	var name string
	var pointId string
	err = db.QueryRow(`SELECT access, name, point_id FROM member_points_view WHERE guild_id = $1 AND member_id = $2::uuid`, guildID, memberID).Scan(pq.Array(&access), &name, &pointId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get access: %w", err)
	}

	return &MemberAccessInfo{
		Access:  access,
		Name:    name,
		PointID: pointId,
	}, nil
}

type TGMemberAccessInfo struct {
	Access  []string `json:"access"`
	PointID string   `json:"point_id"`
}

func GetAccessForMemberByTelegramUsername(groupChatId, fromUsername string) (*MemberAccessInfo, error) {
	db := db.GetSQL()

	var memberID string
	err := db.QueryRow(`SELECT member_id FROM telegram WHERE username = $1 AND chat_type='member'`, fromUsername).Scan(&memberID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("tg user not found")
		}
		return nil, fmt.Errorf("failed to fetch member_id: %w", err)
	}

	var access []string
	var name string
	var pointId string
	err = db.QueryRow(`SELECT point_id FROM telegram WHERE chat_id = $1 AND chat_type='group'`, groupChatId).Scan(&pointId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("tg point system not found")
		}
		return nil, fmt.Errorf("failed to get access: %w", err)
	}


	err = db.QueryRow(`SELECT access, name FROM member_points_view WHERE point_id = $1::uuid AND member_id = $2::uuid`, pointId, memberID).Scan(pq.Array(&access), &name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get access: %w", err)
	}

	return &MemberAccessInfo{
		Access:  access,
		Name:    name,
		PointID: pointId,
	}, nil
}

func CreateAccesses(admin, view []string, pointId string) error {
	var adminRoles, viewRoles []string
	var err error
	if admin != nil {
		adminRoles, err = GetPointRoleIds(admin)
		if err != nil {
			return fmt.Errorf("failed to get admin roles: %w", err)
		}
	}
	if view != nil {
		viewRoles, err = GetPointRoleIds(view)
		if err != nil {
			return fmt.Errorf("failed to get view roles: %w", err)
		}
	}
	accesses := []point.Access{
		{
			PointID: pointId,
			Roles:   adminRoles,
			Access:  point.AccessTypeAdmin,
		},
		{
			PointID: pointId,
			Roles:   viewRoles,
			Access:  point.AccessTypeMember,
		},
		{
			PointID: pointId,
			Access:  point.AccessTypeOwner,
		},
	}

	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	for _, access := range accesses {
		_, err := tx.Exec(`INSERT INTO access (point_id, access, members, roles) VALUES ($1::uuid, $2, $3::uuid[], $4::uuid[])`,
			access.PointID, access.Access, pq.Array(access.Members), pq.Array(access.Roles))
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

func UpdateAccesses(admin, view []string, pointId string) error {
	var adminRoles, viewRoles []string
	var err error
	if admin != nil {
		adminRoles, err = GetPointRoleIds(admin)
		if err != nil {
			return fmt.Errorf("failed to get admin roles: %w", err)
		}
	}
	if view != nil {
		viewRoles, err = GetPointRoleIds(view)
		if err != nil {
			return fmt.Errorf("failed to get view roles: %w", err)
		}
	}
	accesses := []point.Access{
		{
			PointID: pointId,
			Roles:   adminRoles,
			Access:  point.AccessTypeAdmin,
		},
		{
			PointID: pointId,
			Roles:   viewRoles,
			Access:  point.AccessTypeMember,
		},
		{
			PointID: pointId,
			Access:  point.AccessTypeOwner,
		},
	}

	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	for _, access := range accesses {
		_, err := tx.Exec(`UPDATE access SET roles = $3::uuid[] WHERE point_id=$1::uuid AND access = $2`,
			access.PointID, access.Access, pq.Array(access.Roles))
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

func AddMemberDiscord(pointID, MemberID string, access point.AccessType) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE access SET members = array_append(members, $1) WHERE point_id = $2::uuid AND access = $3`, MemberID, pointID, access)
	if err != nil {
		return fmt.Errorf("failed to add role member: %w", err)
	}

	return nil
}
func AddRoleDiscord(pointID, access, discordRoleID string) error {
	roleID, err := GetPointRoleIds([]string{discordRoleID})
	if err != nil {
		return fmt.Errorf("failed to get role id: %w", err)
	}

	if len(roleID) == 0 {
		return fmt.Errorf("role id not found")
	}

	db := db.GetSQL()
	_, err = db.Exec(`UPDATE access SET roles = array_append(roles, $1) WHERE point_id = $2::uuid AND access = $3`, roleID[0], pointID, access)
	if err != nil {
		return fmt.Errorf("failed to add role discord: %w", err)
	}

	return nil
}
