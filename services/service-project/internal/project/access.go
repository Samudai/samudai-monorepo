package project

import (
	"database/sql"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-project/pkg/project"
	"github.com/lib/pq"
)

// Helper function
func contains(slice []string, value string) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

func CreateAccess(access []project.Access) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	for _, a := range access {
		_, err := tx.Exec(`INSERT INTO access (project_id, access, members, roles) 
			VALUES ($1::uuid, $2, $3::uuid[], $4::uuid[])`,
			a.ProjectID, a.Access, pq.Array(a.Members), pq.Array(a.Roles))
		if err != nil {
			return fmt.Errorf("failed to create access: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	logger.LogMessage("info", "Created access for project: %s", access[0].ProjectID)
	return nil
}

func GetProjectAccessByMemberID(projectID string, memberID string, roles []string) (string, error) {
	db := db.GetSQL()
	var access string
	err := db.QueryRow(`SELECT a.access FROM access a 
		WHERE project_id = $1::uuid 
		AND ($2 = ANY(a.members) OR $3 && a.roles)
		ORDER BY (a.access::integer) DESC LIMIT 1`,
		projectID, memberID, pq.Array(roles)).Scan(&access)
	if err != nil {
		if err == sql.ErrNoRows {
			return access, nil
		}
		return access, fmt.Errorf("failed to get access: %w", err)
	}

	return access, nil
}

func GetAccessByProjectID(projectID string) ([]project.Access, error) {
	db := db.GetSQL()
	var accesses []project.Access
	rows, err := db.Query(`SELECT id, project_id, access, members, roles, 
		created_at, updated_at, invite_link
		FROM access WHERE project_id = $1::uuid`, projectID)
	if err != nil {
		return accesses, fmt.Errorf("failed to get access: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var access project.Access
		err := rows.Scan(&access.AccessID, &access.ProjectID, &access.Access, pq.Array(&access.Members), pq.Array(&access.Roles),
			&access.CreatedAt, &access.UpdatedAt, &access.InviteLink)
		if err != nil {
			return nil, fmt.Errorf("failed to scan access: %w", err)
		}
		accesses = append(accesses, access)
	}

	return accesses, nil
}

func UpdateAccess(access []project.Access) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	for _, a := range access {
		_, err := tx.Exec(`UPDATE access SET members = $2::uuid[], roles = $3::uuid[], updated_at = CURRENT_TIMESTAMP WHERE project_id = $1::uuid AND access = $4`,
			a.ProjectID, pq.Array(a.Members), pq.Array(a.Roles), a.Access)
		if err != nil {
			return fmt.Errorf("failed to update access: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func AddAccessIfNotExistsForMember(projectID string, memberID string, access project.AccessType) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	var currentMembers []string
	err = tx.QueryRow(`SELECT members FROM access WHERE project_id = $1::uuid AND access = $2`, projectID, access).Scan(pq.Array(&currentMembers))
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to fetch current members: %w", err)
	}

	// Check if the member already exists in the current members array
	if contains(currentMembers, memberID) {
		tx.Rollback()
		return nil
	}

	// Add the new member to the current members array
	currentMembers = append(currentMembers, memberID)

	_, err = tx.Exec(`UPDATE access SET members = $3::uuid[], updated_at = CURRENT_TIMESTAMP WHERE project_id = $1::uuid AND access = $2`,
		projectID, access, pq.Array(currentMembers))
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to update access: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func DeleteAccess(projectID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM access WHERE project_id = $1::uuid`, projectID)
	if err != nil {
		return fmt.Errorf("failed to delete access: %w", err)
	}

	return nil
}

func AddAccessByInvite(invite string, memeberID string) (string, string, error) {
	db := db.GetSQL()
	var projectID, linkID, access string
	err := db.QueryRow(`SELECT p.project_id, p.link_id, a.access 
		FROM project p
		LEFT JOIN access a ON p.project_id = a.project_id
		WHERE a.invite_link = $1 AND $2::uuid = ANY(members)`, invite, memeberID).Scan(&projectID, &linkID, &access)
	if err != nil {
		if err != sql.ErrNoRows {
			return projectID, linkID, fmt.Errorf("failed to get access: %w", err)
		}
	}

	if access == "" {
		err = db.QueryRow(`UPDATE access SET members = array_append(members, $1::uuid) WHERE invite_link = $2 returning project_id`, memeberID, invite).Scan(&projectID)
		if err != nil {
			return projectID, linkID, fmt.Errorf("failed to add access by invite: %w", err)
		}
	}

	err = db.QueryRow(`SELECT link_id FROM project WHERE project_id = $1::uuid`, projectID).Scan(&linkID)
	if err != nil {
		return projectID, linkID, fmt.Errorf("failed to get link id: %w", err)
	}
	logger.LogMessage("info", "Added access by invite")

	return projectID, linkID, nil
}
