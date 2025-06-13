package dao

import (
	"encoding/json"
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/lib/pq"
)

// CreateDAOCollaboration creates a new collaboration request for a DAO.
func CreateDAOCollaboration(collaboration dao.Collaboration) (string, error) {
	db := db.GetSQL()
	var collaborationID string
	err := db.QueryRow(`INSERT INTO collaboration (applying_member_id, from_dao_id, to_dao_id, status, title, 
		department, description, requirements, benefits, attachment, replying_member_id, scope) 
		VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6::uuid, $7, $8, $9, $10, $11, $12) RETURNING collaboration_id`,
		collaboration.ApplyingMemberID, collaboration.FromDAOID, collaboration.ToDAOID, collaboration.Status, collaboration.Title,
		collaboration.Department, collaboration.Description, pq.Array(collaboration.Requirements), collaboration.Benefits, collaboration.Attachment,
		collaboration.ReplyingMemberID, collaboration.Scope).Scan(&collaborationID)
	if err != nil {
		return collaborationID, err
	}

	return collaborationID, nil
}

// ListDAOCollaborations returns a list of collaboration requests for a DAO.
func ListDAOCollaborations(daoID string) ([]dao.CollaborationResponse, error) {
	db := db.GetSQL()
	var collaborations []dao.CollaborationResponse
	rows, err := db.Query(`SELECT collaboration_id, applying_member, from_dao_id, to_dao_id, status, 
		title, department, description, requirements, benefits, 
		attachment, scope, replying_member, created_at, updated_at 
		FROM collaboration_view WHERE from_dao_id = $1::uuid OR to_dao_id = $1::uuid`, daoID)
	if err != nil {
		return collaborations, err
	}

	defer rows.Close()

	for rows.Next() {
		var collaboration dao.CollaborationResponse
		var replyingMemberJSON, applyingMemberJSON *json.RawMessage
		
		err := rows.Scan(&collaboration.CollaborationID, &applyingMemberJSON, &collaboration.FromDAOID, &collaboration.ToDAOID, &collaboration.Status, 
			&collaboration.Title, &collaboration.Department, &collaboration.Description, pq.Array(&collaboration.Requirements), &collaboration.Benefits, 
			&collaboration.Attachment, &collaboration.Scope, &replyingMemberJSON, &collaboration.CreatedAt, &collaboration.UpdatedAt)
		if err != nil {
			return collaborations, err
		}

		if applyingMemberJSON != nil {
			err = json.Unmarshal(*applyingMemberJSON, &collaboration.ApplyingMember)
			if err != nil {
				return collaborations, err
			}
		}
	
		if replyingMemberJSON != nil {
			err = json.Unmarshal(*replyingMemberJSON, &collaboration.ReplyingMember)
			if err != nil {
				return collaborations, err
			}
		}

		collaborations = append(collaborations, collaboration)
	}
	return collaborations, nil
}

func UpdateDAOCollaborationStatus(collaborationID string, status dao.CollaborationStatus, ReplyingMemberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE collaboration SET status = $2, replying_member_id = $3 WHERE collaboration_id = $1::uuid`, collaborationID, status, ReplyingMemberID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteDAOCollaboration deletes a collaboration request for a DAO.
func DeleteDAOCollaboration(collaborationID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM collaboration WHERE collaboration_id = $1::uuid`, collaborationID)
	if err != nil {
		return err
	}
	return nil
}
