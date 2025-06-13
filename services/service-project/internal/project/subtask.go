package project

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-project/pkg/project"
	"github.com/lib/pq"
)

// GetSubtask returns a subtask
func GetSubtask(subtaskID string) (project.Subtask, error) {
	db := db.GetSQL()
	var payout, pr *string
	var subtask project.Subtask
	err := db.QueryRow(`SELECT subtask_id, task_id, project_id, title, completed, description,
	description_raw, deadline, poc_member_id, assignee_member, github_issue, position,
	notion_page, notion_property, col, payout, payment_created, github_pr, archived, 
	associated_job_type, associated_job_id, updated_by, created_by, created_at, updated_at FROM subtask_view
	WHERE subtask_id = $1::uuid`, subtaskID).Scan(&subtask.SubtaskID, &subtask.TaskID, &subtask.ProjectID, &subtask.Title, &subtask.Completed,
		&subtask.Description, &subtask.DescriptionRaw, &subtask.Deadline, &subtask.POCMemberID,
		pq.Array(&subtask.AssigneeMember), &subtask.GithubIssue, &subtask.Position, &subtask.NotionPage,
		&subtask.NotionProperty, &subtask.Col, &payout, &subtask.PaymentCreated, &pr,
		&subtask.Archived, &subtask.AssociatedJobType, &subtask.AssociatedJobId, &subtask.UpdatedBy, &subtask.CreatedBy, &subtask.CreatedAt, &subtask.UpdatedAt)
	if err != nil {
		return subtask, fmt.Errorf("subtask not found: %w", err)
	}

	if pr != nil {
		err = json.Unmarshal([]byte(*pr), &subtask.GithubPR)
		if err != nil {
			return subtask, fmt.Errorf("error unmarshalling github pr: %w", err)
		}
	}

	if payout != nil {
		err = json.Unmarshal([]byte(*payout), &subtask.Payout)
		if err != nil {
			return subtask, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	return subtask, nil
}

// GetAllSubtaskByTask returns all subtasks of a task
func GetAllSubtaskByProject(ProjectID string) ([]project.Subtask, int, error) {
	db := db.GetSQL()
	var payout, pr *string
	var total int
	var subtasks []project.Subtask
	rows, err := db.Query(`SELECT COUNT(*) over() as total, subtask_id, task_id, project_id, title, completed, description,
	description_raw, deadline, poc_member_id, assignee_member, github_issue, position,
	notion_page, notion_property, col, payout, payment_created, github_pr, archived, 
	associated_job_type, associated_job_id, updated_by, created_by, created_at, updated_at FROM subtask_view
	WHERE project_id = $1::uuid`, ProjectID)
	if err != nil {
		return subtasks, total, fmt.Errorf("failed to get subtasks: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var subtask project.Subtask
		err := rows.Scan(&total, &subtask.SubtaskID, &subtask.TaskID, &subtask.ProjectID, &subtask.Title,
			&subtask.Completed, &subtask.Description, &subtask.DescriptionRaw, &subtask.Deadline,
			&subtask.POCMemberID, pq.Array(&subtask.AssigneeMember), &subtask.GithubIssue,
			&subtask.Position, &subtask.NotionPage, &subtask.NotionProperty, &subtask.Col,
			&payout, &subtask.PaymentCreated, &pr, &subtask.Archived, &subtask.AssociatedJobType,
			&subtask.AssociatedJobId, &subtask.UpdatedBy, &subtask.CreatedBy, &subtask.CreatedAt, &subtask.UpdatedAt)
		if err != nil {
			return nil, total, fmt.Errorf("failed to scan subtask: %w", err)
		}

		if pr != nil {
			err = json.Unmarshal([]byte(*pr), &subtask.GithubPR)
			if err != nil {
				return subtasks, total, fmt.Errorf("error unmarshalling github pr: %w", err)
			}
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &subtask.Payout)
			if err != nil {
				return subtasks, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		subtasks = append(subtasks, subtask)
	}

	return subtasks, total, nil
}

// Addsubtask creates a new subtask
func Addsubtask(params project.Subtask) (string, error) {
	db := db.GetSQL()
	var assigneeMembers *pq.StringArray
	var subtaskID string
	var pr *string
	var err error

	if params.AssigneeMember != nil {
		ptr := pq.StringArray(params.AssigneeMember)
		assigneeMembers = &ptr
	}
	if params.GithubPR != nil {
		pr, err = convertToJSONString(params.GithubPR)
		if err != nil {
			return subtaskID, fmt.Errorf("error converting issue to json: %w", err)
		}
	}

	if params.AssociatedJobType == "" {
		params.AssociatedJobType = "none"
	}

	err = db.QueryRow(`INSERT INTO subtask (task_id, project_id, title, completed, description,
		description_raw, deadline, poc_member_id, assignee_member, github_issue, position,
		notion_page, notion_property, col, payment_created, github_pr, archived, 
		associated_job_type, associated_job_id, created_by, updated_by, updated_at)
		VALUES ($1::uuid, $2::uuid, $3, COALESCE($4, FALSE), $5, $6, $7, $8, $9, $10, $11, $12,
		$13, $14, $15, $16, $17, $18, $19, $20, $21, CURRENT_TIMESTAMP)
		RETURNING subtask_id`,
		params.TaskID, params.ProjectID, params.Title, params.Completed, params.Description,
		params.DescriptionRaw, params.Deadline, params.POCMemberID, assigneeMembers, params.GithubIssue,
		params.Position, params.NotionPage, params.NotionProperty, params.Col, params.PaymentCreated,
		pr, params.Archived, params.AssociatedJobType, params.AssociatedJobId, params.CreatedBy, params.CreatedBy).Scan(&subtaskID)
	if err != nil {
		return subtaskID, fmt.Errorf("failed to add subtask: %w", err)
	}

	logger.LogMessage("info", "Added subtask ID: %s", subtaskID)

	return subtaskID, nil
}

// UpdateSubtask updates a subtask
func UpdateSubtask(params project.Subtask) error {
	db := db.GetSQL()
	// var payout, pr *string
	var pr *string
	var err error

	// if params.Payout != nil {
	// 	payout, err = convertToJSONString(params.Payout)
	// 	if err != nil {
	// 		return fmt.Errorf("error converting payout to json: %w", err)
	// 	}
	// }
	if params.GithubPR != nil {
		pr, err = convertToJSONString(params.GithubPR)
		if err != nil {
			return fmt.Errorf("error converting issue to json: %w", err)
		}
	}

	if params.AssociatedJobType == "" {
		params.AssociatedJobType = "none"
	}

	_, err = db.Exec(`UPDATE subtask SET title = $1, completed = $2, description = $3, 
		description_raw = $4, deadline = $5, poc_member_id = $6, assignee_member = $7,
		notion_page = $8, notion_property = $9, github_pr = $10, payment_created = $11,
		updated_by = $12::uuid, github_issue = $14, associated_job_type = $15, associated_job_id = $16, updated_at = CURRENT_TIMESTAMP
		WHERE subtask_id = $13::uuid`,
		params.Title, params.Completed, params.Description, params.DescriptionRaw, params.Deadline,
		params.POCMemberID, pq.Array(params.AssigneeMember), params.NotionPage, params.NotionProperty,
		pr, params.PaymentCreated, params.UpdatedBy, params.SubtaskID, params.GithubIssue, params.AssociatedJobType, params.AssociatedJobId)

	if err != nil {
		return fmt.Errorf("failed to update subtask: %w", err)
	}

	logger.LogMessage("info", "Updated subtask ID: %s", params.SubtaskID)

	return nil
}

func UpdateSubtaskColumn(subtaskId string, col int, updatedBy string) error {
	db := db.GetSQL()

	_, err := db.Exec(`UPDATE subtask SET col = $1, updated_by = $2 WHERE subtask_id = $3::uuid`,
		col, updatedBy, subtaskId)

	if err != nil {
		return fmt.Errorf("error updating subtask state: %w", err)
	}
	logger.LogMessage("info", "Updated Subtask :%s to state: %d", subtaskId, col)

	return nil
}

func UpdateSubTaskColumnBulk(subtasks []project.UpdateSubTaskStatusParam) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	for _, subtask := range subtasks {
		_, err := tx.Exec(`UPDATE subtask SET col = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE subtask_id = $1::uuid`, subtask.SubTaskID, subtask.Col, subtask.UpdatedBy)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("error updating task state: %w", err)
		}
		logger.LogMessage("info", "Updated task :%s to state: %d", subtask.SubTaskID, subtask.Col)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func UpdateSubTaskPayout(subTaskID string, payout []project.Payout, updatedBy string) error {
	db := db.GetSQL()
	var payoutStr *string
	var err error

	if payout != nil {
		payoutStr, err = convertToJSONString(payout)
		if err != nil {
			return fmt.Errorf("error converting payout to json: %w", err)
		}
	}

	_, err = db.Exec(`UPDATE subtask SET payout = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE subtask_id = $1::uuid`, subTaskID, payoutStr, updatedBy)
	if err != nil {
		return fmt.Errorf("error updating subtask payout: %w", err)
	}

	logger.LogMessage("info", "Updated subtask payout: %s", subTaskID)
	return nil
}

func UpdateSubtaskPosition(subtaskId string, position float64, updatedBy string) error {
	db := db.GetSQL()

	_, err := db.Exec(`UPDATE subtask SET position = $1, updated_by = $2 WHERE subtask_id = $3::uuid`,
		position, updatedBy, subtaskId)

	if err != nil {
		return fmt.Errorf("error updating task state: %w", err)
	}
	logger.LogMessage("info", "Updated Subtask :%s to state: %f", subtaskId, position)

	return nil
}

func AddAssigneeToSubTask(subtaskID string, assigneeMembers *[]string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET assignee_member = array_cat(assignee_member, $2::uuid[]), updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE subtask_id = $1::uuid`, subtaskID, pq.Array(assigneeMembers), updatedBy)
	if err != nil {
		return fmt.Errorf("error assigning task: %w", err)
	}

	logger.LogMessage("info", "Assigned subtask: %s to member: %s", subtaskID, assigneeMembers)
	return nil
}

// DeleteSubtask deletes a subtask
func DeleteSubtask(subtaskID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM subtask WHERE subtask_id = $1::uuid`, subtaskID)
	if err != nil {
		return fmt.Errorf("failed to delete subtask: %w", err)
	}
	logger.LogMessage("info", "Deleted subtask ID: %s", subtaskID)

	return nil
}

// UpdateSubtaskStatus updates a subtask state
func UpdateSubtaskStatus(subtaskID string, completed bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE subtask SET completed = $1, updated_at = CURRENT_TIMESTAMP
		WHERE subtask_id = $2::uuid`,
		completed, subtaskID)
	if err != nil {
		return fmt.Errorf("failed to update subtask: %w", err)
	}
	logger.LogMessage("info", "Updated subtask: %s completed state: %v", subtaskID, completed)

	return nil
}

func UpdateSubtaskAssociatedJob(subtaskID string, associatedJobId string, associatedJobType project.AssociatedJobType) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE subtask SET associated_job_id = $1, associated_job_type = $2, updated_at = CURRENT_TIMESTAMP
		WHERE subtask_id = $3::uuid`,
		associatedJobId, associatedJobType, subtaskID)
	if err != nil {
		return fmt.Errorf("failed to update subtask: %w", err)
	}
	logger.LogMessage("info", "Updated subtask: %s associated_job_id : %s", subtaskID, associatedJobId)

	return nil
}

func ArchiveSubtask(subtaskID string, archived bool, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE subtask SET archived = $1, updated_by = $2 WHERE subtask_id = $3::uuid`,
		archived, updatedBy, subtaskID)
	if err != nil {
		return fmt.Errorf("failed to update subtask: %w", err)
	}
	logger.LogMessage("info", "Archive subtask: %s archived state: %v", subtaskID, archived)

	return nil
}

func GetAllArchivedSubtask(ProjectID string) ([]project.Subtask, int, error) {
	db := db.GetSQL()
	var payout, pr *string
	var total int
	var subtasks []project.Subtask
	rows, err := db.Query(`SELECT COUNT(*) over() as total, subtask_id, task_id, project_id, title, completed, description,
	description_raw, deadline, poc_member_id, assignee_member, github_issue, position,
	notion_page, notion_property, col, payout, payment_created, github_pr, archived, 
	associated_job_type, associated_job_id, updated_by FROM subtask_view
	WHERE project_id = $1::uuid AND archived = $2`, ProjectID, true)
	if err != nil {
		return subtasks, total, fmt.Errorf("failed to get subtasks: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var subtask project.Subtask
		err := rows.Scan(&total, &subtask.SubtaskID, &subtask.TaskID, &subtask.ProjectID, &subtask.Title,
			&subtask.Completed, &subtask.Description, &subtask.DescriptionRaw, &subtask.Deadline,
			&subtask.POCMemberID, pq.Array(&subtask.AssigneeMember), &subtask.GithubIssue,
			&subtask.Position, &subtask.NotionPage, &subtask.NotionProperty, &subtask.Col,
			&payout, &subtask.PaymentCreated, &pr, &subtask.Archived, &subtask.AssociatedJobType,
			&subtask.AssociatedJobId, &subtask.UpdatedBy)
		if err != nil {
			return nil, total, fmt.Errorf("failed to scan subtask: %w", err)
		}

		if pr != nil {
			err = json.Unmarshal([]byte(*pr), &subtask.GithubPR)
			if err != nil {
				return subtasks, total, fmt.Errorf("error unmarshalling github pr: %w", err)
			}
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &subtask.Payout)
			if err != nil {
				return subtasks, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		subtasks = append(subtasks, subtask)
	}

	return subtasks, total, nil
}
