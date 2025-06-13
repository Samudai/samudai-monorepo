package project

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-project/pkg/project"
	"github.com/lib/pq"
)

// GetResponse returns a response
func GetResponse(responseID string) (project.FormResponse, error) {
	db := db.GetSQL()
	var response project.FormResponse
	err := db.QueryRow(`SELECT response_id, project_id, response_type, mongo_object, title,
		col, position, assignee_member, assignee_clan, created_at, 
		updated_by, updated_at, discussion_id
		FROM form_response 
		WHERE response_id = $1::uuid`, responseID).Scan(&response.ResponseID, &response.ProjectID, &response.ResponseType, &response.MongoObject, &response.Title,
		&response.Col, &response.Position, pq.Array(&response.AssigneeMember), pq.Array(&response.AssigneeClan), &response.CreatedAt,
		&response.UpdatedBy, &response.UpdatedAt, &response.DiscussionID)
	if err != nil {
		return response, fmt.Errorf("error getting response by id: %w", err)
	}

	return response, nil
}

func GetResponseByFormResponseID(formResponseID string) (project.FormResponse, error) {
	db := db.GetSQL()
	var response project.FormResponse
	err := db.QueryRow(`SELECT response_id, project_id, response_type, mongo_object, title,
		col, position, assignee_member, assignee_clan, created_at, 
		updated_by, updated_at, discussion_id
		FROM form_response 
		WHERE mongo_object = $1`, formResponseID).Scan(&response.ResponseID, &response.ProjectID, &response.ResponseType, &response.MongoObject, &response.Title,
		&response.Col, &response.Position, pq.Array(&response.AssigneeMember), pq.Array(&response.AssigneeClan), &response.CreatedAt,
		&response.UpdatedBy, &response.UpdatedAt, &response.DiscussionID)
	if err != nil {
		return response, fmt.Errorf("error getting response by form response id: %w", err)
	}

	return response, nil
}

// GetAllResponseByProject returns all responses of a project
func GetAllResponseByProject(projectID string) ([]project.FormResponse, int, error) {
	db := db.GetSQL()
	var responses []project.FormResponse
	var total int
	rows, err := db.Query(`SELECT COUNT(*) over() as total, response_id, project_id, response_type, mongo_object, title,
		col, position, assignee_member, assignee_clan, created_at, 
		updated_by, updated_at, discussion_id
		FROM form_response WHERE project_id = $1::uuid`, projectID)
	if err != nil {
		return responses, total, fmt.Errorf("error getting all responses: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var response project.FormResponse
		err := rows.Scan(&total, &response.ResponseID, &response.ProjectID, &response.ResponseType, &response.MongoObject, &response.Title,
			&response.Col, &response.Position, pq.Array(&response.AssigneeMember), pq.Array(&response.AssigneeClan), &response.CreatedAt,
			&response.UpdatedBy, &response.UpdatedAt, &response.DiscussionID)
		if err != nil {
			return responses, total, fmt.Errorf("error scanning response: %w", err)
		}

		responses = append(responses, response)
	}

	return responses, total, nil
}

// CreateResponse creates a new response
func CreateResponse(params project.FormResponse) (string, error) {
	db := db.GetSQL()
	var responseID string
	var assigneeMembers, assigneeClans *pq.StringArray
	if params.AssigneeMember != nil {
		ptr := pq.StringArray(params.AssigneeMember)
		assigneeMembers = &ptr
	}
	if params.AssigneeClan != nil {
		ptr := pq.StringArray(params.AssigneeClan)
		assigneeClans = &ptr
	}

	err := db.QueryRow(`INSERT INTO form_response (project_id, response_type, mongo_object, title, col, 
		position, assignee_member, assignee_clan)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8)
		RETURNING response_id`,
		params.ProjectID, params.ResponseType, params.MongoObject, params.Title, params.Col,
		params.Position, assigneeMembers, assigneeClans).Scan(&responseID)
	if err != nil {
		return responseID, fmt.Errorf("error creating response: %w", err)
	}

	logger.LogMessage("info", "Added response ID: %s", responseID)
	return responseID, nil
}

// DeleteResponse deletes a response
func DeleteResponse(responseID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM form_response WHERE response_id = $1::uuid`, responseID)
	if err != nil {
		return fmt.Errorf("error deleting response: %w", err)
	}

	logger.LogMessage("info", "Deleted response ID: %s", responseID)
	return nil
}

// UpdateResponseCol updates a response state
func UpdateResponseCol(responseID string, col int, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE form_response SET col = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE response_id = $1::uuid`, responseID, col, updatedBy)
	if err != nil {
		return fmt.Errorf("error updating response state: %w", err)
	}
	logger.LogMessage("info", "Updated response :%s to state: %d", responseID, col)

	return nil
}

func UpdateResponseColumnBulk(responses []project.UpdateResponseStatusParam) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	for _, response := range responses {
		_, err := tx.Exec(`UPDATE form_response SET col = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE response_id = $1::uuid`, response.ResponseID, response.Col, response.UpdatedBy)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("error updating response state: %w", err)
		}
		logger.LogMessage("info", "Updated response :%s to state: %d", response.ResponseID, response.Col)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

// AssignResponseToMember assigns a response to a member
func AssignResponseToMember(responseID string, assigneeMembers []string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE form_response SET assignee_member = $2::uuid[], updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE response_id = $1::uuid`, responseID, pq.Array(assigneeMembers), updatedBy)
	if err != nil {
		return fmt.Errorf("error assigning response: %w", err)
	}

	logger.LogMessage("info", "Assigned response: %s to member: %s", responseID, assigneeMembers)
	return nil
}

// AssignResponseToClan assigns a response to a clan
func AssignResponseToClan(responseID string, assigneeClans []string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE form_response SET assignee_clan = $2::uuid[], updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE response_id = $1::uuid`, responseID, pq.Array(assigneeClans), updatedBy)
	if err != nil {
		return fmt.Errorf("error assigning response: %w", err)
	}
	logger.LogMessage("info", "Assigned response: %s to: %s", responseID, assigneeClans)

	return nil
}

// UpdateResponsePosition updates a response position
func UpdateResponsePosition(params project.UpdateResponsePositionParam) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	if params.Position >= 0.001 {
		_, err := tx.Exec(`UPDATE form_response SET position = $1, updated_at = CURRENT_TIMESTAMP WHERE response_id = $2::uuid`, params.Position, params.ResponseID)
		if err != nil {
			return fmt.Errorf("error updating response position: %w", err)
		}
	} else {
		responses, _, err := GetAllResponseByProject(params.ProjectID)
		if err != nil {
			return fmt.Errorf("error getting responses: %w", err)
		}

		for ind, response := range responses {
			position := magicNumber * float64(ind+1)
			if response.ResponseID == params.ResponseID {
				_, err := tx.Exec(`UPDATE form_response SET position = $2, updated_by = $3::uuid, updated_at = CURRENT_TIMESTAMP WHERE response_id = $1::uuid`, response.ResponseID, position, params.UpdatedBy)
				if err != nil {
					tx.Rollback()
					return fmt.Errorf("error updating response position: %w", err)
				}
			} else {
				_, err := tx.Exec(`UPDATE form_response SET position = $2, updated_at = CURRENT_TIMESTAMP WHERE response_id = $1::uuid`, response.ResponseID, position)
				if err != nil {
					tx.Rollback()
					return fmt.Errorf("error updating response position: %w", err)
				}
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	logger.LogMessage("info", "Updated response position: %s", params.ResponseID)
	return nil
}

func UpdateDiscussion(responseID, discussionID, title string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE form_response SET discussion_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE response_id = $3::uuid`, discussionID, title, responseID)
	if err != nil {
		return fmt.Errorf("error updating response discussion: %w", err)
	}

	logger.LogMessage("info", "Updated response discussion: %s", responseID)
	return nil
}
