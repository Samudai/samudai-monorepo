package project

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-project/pkg/project"
	"github.com/lib/pq"
)

const magicNumber float64 = 65536

// GetTask returns a task
func GetTask(taskID string) (project.Task, error) {
	db := db.GetSQL()
	var task project.Task
	var files, subtasks, comments *json.RawMessage
	var payout, pr *string
	err := db.QueryRow(`SELECT task_id, project_id, title, description, col,
		created_by, updated_by, poc_member_id, notion_page, tags, 
		deadline, assignee_member, assignee_clan, feedback, position, 
		created_at, updated_at, files, subtasks, comments, 
		(SELECT COUNT(subtask_id) FROM subtask st WHERE st.task_id = tv.task_id AND col = (SELECT total_col from project p where p.project_id = tv.project_id)) AS completed_subtask_count,
		payout, vc_claim, payment_created, github_issue, github_pr, archived, associated_job_type, associated_job_id, source
		FROM task_view tv WHERE task_id = $1::uuid`, taskID).Scan(&task.TaskID, &task.ProjectID, &task.Title, &task.Description, &task.Col,
		&task.CreatedBy, &task.UpdatedBy, &task.POCMemberID, &task.NotionPage, pq.Array(&task.Tags),
		&task.Deadline, pq.Array(&task.AssigneeMember), pq.Array(&task.AssigneeClan), &task.Feedback, &task.Position,
		&task.CreatedAt, &task.UpdatedAt, &files, &subtasks, &comments,
		&task.CompletedSubtaskCount,
		&payout, pq.Array(&task.VCClaim), &task.PaymentCreated, &task.GithubIssue, &pr, &task.Archived, &task.AssociatedJobType, 
		&task.AssociatedJobId, &task.Source)
	if err != nil {
		return task, fmt.Errorf("error getting task: %w", err)
	}

	if pr != nil {
		err = json.Unmarshal([]byte(*pr), &task.GithubPR)
		if err != nil {
			return task, fmt.Errorf("error unmarshalling github pr: %w", err)
		}
	}

	if payout != nil {
		err = json.Unmarshal([]byte(*payout), &task.Payout)
		if err != nil {
			return task, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	if files != nil {
		err := json.Unmarshal(*files, &task.Files)
		if err != nil {
			return task, fmt.Errorf("error getting files: %w", err)
		}
	}

	if subtasks != nil {
		err := json.Unmarshal(*subtasks, &task.Subtasks)
		if err != nil {
			return task, fmt.Errorf("error getting subtasks: %w", err)
		}
	}

	if comments != nil {
		err := json.Unmarshal(*comments, &task.Comments)
		if err != nil {
			return task, fmt.Errorf("error getting comments: %w", err)
		}
	}

	return task, nil
}

// GetAllTaskByProject returns all tasks of a project
func GetAllTaskByProject(projectID string) ([]project.Task, int, error) {
	db := db.GetSQL()
	var tasks []project.Task
	var total int
	rows, err := db.Query(`SELECT COUNT(*) over() as total, task_id, project_id, title, description, col,
		created_by, updated_by, poc_member_id, notion_page, tags, 
		deadline, assignee_member, assignee_clan, feedback, position, 
		created_at, updated_at, files, subtasks, comments,
		(SELECT COUNT(subtask_id) FROM subtask st WHERE st.task_id = tv.task_id AND col = (SELECT total_col from project p where p.project_id = tv.project_id)) AS completed_subtask_count,
		payout, vc_claim, payment_created, github_issue, github_pr, archived, associated_job_type, associated_job_id, source
		FROM task_view tv WHERE project_id = $1::uuid`, projectID)
	if err != nil {
		return tasks, total, fmt.Errorf("error getting all tasks: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var task project.Task
		var files, subtasks, comments *json.RawMessage
		var payout, pr *string
		err := rows.Scan(&total, &task.TaskID, &task.ProjectID, &task.Title, &task.Description, &task.Col,
			&task.CreatedBy, &task.UpdatedBy, &task.POCMemberID, &task.NotionPage, pq.Array(&task.Tags),
			&task.Deadline, pq.Array(&task.AssigneeMember), pq.Array(&task.AssigneeClan), &task.Feedback, &task.Position,
			&task.CreatedAt, &task.UpdatedAt, &files, &subtasks, &comments,
			&task.CompletedSubtaskCount,
			&payout, pq.Array(&task.VCClaim), &task.PaymentCreated, &task.GithubIssue, &pr, &task.Archived, 
			&task.AssociatedJobType, &task.AssociatedJobId, &task.Source)
		if err != nil {
			return tasks, total, fmt.Errorf("error scanning task: %w", err)
		}

		if pr != nil {
			err = json.Unmarshal([]byte(*pr), &task.GithubPR)
			if err != nil {
				return tasks, total, fmt.Errorf("error unmarshalling github pr: %w", err)
			}
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &task.Payout)
			if err != nil {
				return tasks, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err := json.Unmarshal(*files, &task.Files)
			if err != nil {
				return tasks, total, fmt.Errorf("error getting files: %w", err)
			}
		}

		if subtasks != nil {
			err := json.Unmarshal(*subtasks, &task.Subtasks)
			if err != nil {
				return tasks, total, fmt.Errorf("error getting subtasks: %w", err)
			}
		}

		if comments != nil {
			err := json.Unmarshal(*comments, &task.Comments)
			if err != nil {
				return tasks, total, fmt.Errorf("error getting comments: %w", err)
			}
		}
		tasks = append(tasks, task)
	}

	return tasks, total, nil
}

// CreateTask creates a new task
func CreateTask(params project.Task) (string, error) {
	db := db.GetSQL()
	var taskID string
	var vcClaims, tags, assigneeMembers, assigneeClans *pq.StringArray
	var pr *string
	var err error
	if params.Tags != nil {
		ptr := pq.StringArray(params.Tags)
		tags = &ptr
	}
	if params.VCClaim != nil {
		ptr := pq.StringArray(params.VCClaim)
		vcClaims = &ptr
	}
	if params.AssigneeMember != nil {
		ptr := pq.StringArray(params.AssigneeMember)
		assigneeMembers = &ptr
	}
	if params.AssigneeClan != nil {
		ptr := pq.StringArray(params.AssigneeClan)
		assigneeClans = &ptr
	}
	if params.GithubPR != nil {
		pr, err = convertToJSONString(params.GithubPR)
		if err != nil {
			return taskID, fmt.Errorf("error converting issue to json: %w", err)
		}
	}
	if params.AssociatedJobType == "" {
		params.AssociatedJobType = "none"
	}
	err = db.QueryRow(`INSERT INTO task (project_id, title, description, description_raw, col, created_by, position, poc_member_id, 
		github_issue, notion_page, notion_property, tags, deadline, assignee_member, 
		assignee_clan, feedback, vc_claim, payment_created, github_pr, associated_job_type, associated_job_id,
		source, updated_by, updated_at)
		VALUES ($1::uuid, $2, $3, $4, $5, $6::uuid, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $6, CURRENT_TIMESTAMP)
		RETURNING task_id`,
		params.ProjectID, params.Title, params.Description, params.DescriptionRaw, params.Col, params.CreatedBy, params.Position, params.POCMemberID,
		params.GithubIssue, params.NotionPage, params.NotionProperty, tags, params.Deadline, assigneeMembers,
		assigneeClans, params.Feedback, vcClaims, params.PaymentCreated, pr, params.AssociatedJobType, params.AssociatedJobId,
		params.Source).Scan(&taskID)
	if err != nil {
		return taskID, fmt.Errorf("error creating task: %w", err)
	}

	logger.LogMessage("info", "Added task ID: %s", taskID)

	return taskID, nil
}

// UpdateTask updates a task
func UpdateTask(params project.Task) error {
	db := db.GetSQL()
	var pr *string
	var err error

	if params.GithubPR != nil {
		pr, err = convertToJSONString(params.GithubPR)
		if err != nil {
			return fmt.Errorf("error converting issue to json: %w", err)
		}
	}

	if params.AssociatedJobType == "" {
		params.AssociatedJobType = "none"
	}

	_, err = db.Exec(`UPDATE task SET title = $2, description = $3, poc_member_id = $4, tags = $5, 
		deadline = $6, updated_by = $7::uuid, assignee_member = $8, assignee_clan = $9, 
		github_pr = $10, description_raw = $11, project_id = $12::uuid, github_issue = $13,  notion_page = $14,
		notion_property = $15, associated_job_type = $16, associated_job_id = $17, source = $18,
		updated_at = CURRENT_TIMESTAMP
		WHERE task_id = $1::uuid`,
		params.TaskID, params.Title, params.Description, params.POCMemberID, pq.Array(params.Tags),
		params.Deadline, params.UpdatedBy, pq.Array(params.AssigneeMember), pq.Array(params.AssigneeClan),
		pr, params.DescriptionRaw, params.ProjectID, params.GithubIssue, params.NotionPage,
		params.NotionProperty, params.AssociatedJobType, params.AssociatedJobId, params.Source)
	if err != nil {
		return fmt.Errorf("error updating task: %w", err)
	}

	logger.LogMessage("info", "Updated task ID: %s", params.TaskID)

	return nil
}

// DeleteTask deletes a task
func DeleteTask(taskID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM task WHERE task_id = $1::uuid`, taskID)
	if err != nil {
		return fmt.Errorf("error deleting task: %w", err)
	}
	logger.LogMessage("info", "Deleted task ID: %s", taskID)

	return nil
}

// UpdateTaskCol updates a task state
func UpdateTaskCol(taskID string, col int, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET col = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, col, updatedBy)
	if err != nil {
		return fmt.Errorf("error updating task state: %w", err)
	}
	logger.LogMessage("info", "Updated task :%s to state: %d", taskID, col)

	return nil
}

func UpdateTaskColumnBulk(tasks []project.UpdateTaskStatusParam) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	for _, task := range tasks {
		_, err := tx.Exec(`UPDATE task SET col = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, task.TaskID, task.Col, task.UpdatedBy)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("error updating task state: %w", err)
		}
		logger.LogMessage("info", "Updated task :%s to state: %d", task.TaskID, task.Col)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

// UpdateFeedback adds a feedback to a task
func UpdateFeedback(taskID string, feedback string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET feedback = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, feedback, updatedBy)
	if err != nil {
		return fmt.Errorf("error adding feedback: %w", err)
	}
	logger.LogMessage("info", "Added feedback to task: %s", taskID)

	return nil
}

// AssignTaskToMember assigns a task to a member
func AssignTaskToMember(taskID string, assigneeMembers *[]string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET assignee_member = $2::uuid[], updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, pq.Array(assigneeMembers), updatedBy)
	if err != nil {
		return fmt.Errorf("error assigning task: %w", err)
	}

	logger.LogMessage("info", "Assigned task: %s to member: %s", taskID, assigneeMembers)
	return nil
}

func AddAssigneeToTask(taskID string, assigneeMembers *[]string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET assignee_member = array_cat(assignee_member, $2::uuid[]), updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, pq.Array(assigneeMembers), updatedBy)
	if err != nil {
		return fmt.Errorf("error assigning task: %w", err)
	}

	logger.LogMessage("info", "Assigned task: %s to member: %s", taskID, assigneeMembers)
	return nil
}

// NotionAssignTaskToMember assigns a member to a task
func NotionAssignTaskToMember(taskID string, memberID string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET assignee_member = array_append(assignee_member, $2::uuid), updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, memberID, updatedBy)
	if err != nil {
		return fmt.Errorf("error assigning task: %w", err)
	}

	logger.LogMessage("info", "Assigned notion task: %s to member: %s", taskID, memberID)
	return nil
}

// AssignTaskToClan assigns a task to a clan
func AssignTaskToClan(taskID string, assigneeClans *[]string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET assignee_clan = $2::uuid[], updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, pq.Array(assigneeClans), updatedBy)
	if err != nil {
		return fmt.Errorf("error assigning task: %w", err)
	}
	logger.LogMessage("info", "Assigned task: %s to: %s", taskID, assigneeClans)

	return nil
}

// UpdateTaskPosition updates a task position
func UpdateTaskPosition(params project.UpdateTaskPositionParam) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	if params.Position >= 0.001 {
		_, err := tx.Exec(`UPDATE task SET position = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2::uuid`, params.Position, params.TaskID)
		if err != nil {
			return fmt.Errorf("error updating task position: %w", err)
		}
	} else {
		tasks, _, err := GetAllTaskByProject(params.ProjectID)
		if err != nil {
			return fmt.Errorf("error getting tasks: %w", err)
		}

		for ind, task := range tasks {
			position := magicNumber * float64(ind+1)
			if task.TaskID == params.TaskID {
				_, err := tx.Exec(`UPDATE task SET position = $2, updated_by = $3::uuid, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, task.TaskID, position, params.UpdatedBy)
				if err != nil {
					return fmt.Errorf("error updating task position: %w", err)
				}
			} else {
				_, err := tx.Exec(`UPDATE task SET position = $2, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, task.TaskID, position)
				if err != nil {
					tx.Rollback()
					return fmt.Errorf("error updating task position: %w", err)
				}
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	logger.LogMessage("info", "Updated task position: %s", params.TaskID)
	return nil
}

func UpdateTaskVCClaim(taskID string, memberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO task_credentials (task_id, member_id, vc_claim) VALUES ($1::uuid, $2::uuid, true)`, taskID, memberID)
	if err != nil {
		return fmt.Errorf("error updating task vc claim: %w", err)
	}
	logger.LogMessage("info", "Updated task vc claim: %s", taskID)

	return nil
}

func UpdateTaskPaymentCreated(taskID string, paymentCreated bool, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET payment_created = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, paymentCreated, updatedBy)
	if err != nil {
		return fmt.Errorf("error updating task payment created: %w", err)
	}
	logger.LogMessage("info", "Updated task payment created: %s", taskID)

	return nil
}

func UpdatetaskAssociatedJob(taskID string, associatedJobId string, associatedJobType project.AssociatedJobType) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET associated_job_id = $1, associated_job_type = $2, updated_at = CURRENT_TIMESTAMP
		WHERE task_id = $3::uuid`,
		associatedJobId, associatedJobType, taskID)
	if err != nil {
		return fmt.Errorf("failed to update subtask: %w", err)
	}
	logger.LogMessage("info", "Updated task: %s associated_job_id : %s", taskID, associatedJobId)

	return nil
}

func ArchiveTask(taskID string, Archive bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE task SET archived = $2, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, Archive)
	if err != nil {
		return fmt.Errorf("error archiving task: %w", err)
	}
	logger.LogMessage("info", "Successfully Archived Task: %s", taskID)

	return nil
}

func GetArchiveTaskByProject(projectID string) ([]project.Task, int, error) {
	db := db.GetSQL()
	var tasks []project.Task
	var total int
	rows, err := db.Query(`SELECT COUNT(*) over() as total, task_id, project_id, title, description, col,
		created_by, updated_by, poc_member_id, notion_page, tags, 
		deadline, assignee_member, assignee_clan, feedback, position, 
		created_at, updated_at, files, subtasks, comments,
		payout, vc_claim, payment_created, github_issue, github_pr, source,
		FROM task_view WHERE project_id = $1::uuid AND archived = $2`, projectID, true)
	if err != nil {
		return tasks, total, fmt.Errorf("error getting all tasks: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var task project.Task
		var files, subtasks, comments *json.RawMessage
		var payout, pr *string
		err := rows.Scan(&total, &task.TaskID, &task.ProjectID, &task.Title, &task.Description, &task.Col,
			&task.CreatedBy, &task.UpdatedBy, &task.POCMemberID, &task.NotionPage, pq.Array(&task.Tags),
			&task.Deadline, pq.Array(&task.AssigneeMember), pq.Array(&task.AssigneeClan), &task.Feedback, &task.Position,
			&task.CreatedAt, &task.UpdatedAt, &files, &subtasks, &comments,
			&payout, pq.Array(&task.VCClaim), &task.PaymentCreated, &task.GithubIssue, &pr, &task.Source)
		if err != nil {
			return tasks, total, fmt.Errorf("error scanning task: %w", err)
		}

		if pr != nil {
			err = json.Unmarshal([]byte(*pr), &task.GithubPR)
			if err != nil {
				return tasks, total, fmt.Errorf("error unmarshalling github pr: %w", err)
			}
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &task.Payout)
			if err != nil {
				return tasks, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err := json.Unmarshal(*files, &task.Files)
			if err != nil {
				return tasks, total, fmt.Errorf("error getting files: %w", err)
			}
		}

		if subtasks != nil {
			err := json.Unmarshal(*subtasks, &task.Subtasks)
			if err != nil {
				return tasks, total, fmt.Errorf("error getting subtasks: %w", err)
			}
		}

		if comments != nil {
			err := json.Unmarshal(*comments, &task.Comments)
			if err != nil {
				return tasks, total, fmt.Errorf("error getting comments: %w", err)
			}
		}
		tasks = append(tasks, task)
	}

	return tasks, total, nil
}

func GetOpentasksForDao(daoId string) ([]project.DataPoint, error) {
	db := db.GetSQL()
	var dataPoints []project.DataPoint

	rows, err := db.Query(`
		SELECT
		tmp.date,
		SUM(COALESCE(total_task.total, 0)) OVER (ORDER BY tmp.date) AS value
	FROM (
		SELECT generate_series(
				(NOW() - INTERVAL '1 YEAR')::date,
				NOW()::date,
				'1 day'::interval
			) AS date
	) tmp
	LEFT JOIN (
		SELECT
			date_trunc('day', task.created_at) AS date,
			count(*) AS total
		FROM task
		JOIN project proj ON task.project_id = proj.project_id
		WHERE
			proj.link_id = $1
			AND type = 'dao'
			AND proj.total_col != task.col
			AND task.created_at >= NOW() - INTERVAL '1 YEAR'
		GROUP BY date_trunc('day', task.created_at)
	) total_task ON tmp.date = total_task.date
	ORDER BY tmp.date DESC;

	`, daoId)

	if err != nil {
		return dataPoints, err
	}

	defer rows.Close()

	for rows.Next() {
		var data project.DataPoint
		err := rows.Scan(&data.Date, &data.Value)
		if err != nil {
			return dataPoints, err
		}

		dataPoints = append(dataPoints, data)
	}

	return dataPoints, nil
}

/*** Task Files ***/

// CreateTaskFile creates a new task file
func CreateTaskFile(params project.TaskFile) (string, error) {
	db := db.GetSQL()
	var taskFileID string
	err := db.QueryRow(`INSERT INTO tasks_files (task_id, name, url, metadata)
		VALUES ($1::uuid, $2, $3, $4) RETURNING task_file_id`,
		params.TaskID, params.Name, params.URL, params.Metadata).Scan(&taskFileID)
	if err != nil {
		return taskFileID, fmt.Errorf("Error creating task file: %w", err)
	}

	logger.LogMessage("info", "Added file for task_id: %s", params.TaskID)
	return taskFileID, nil
}

// // Redundant
// func UpdateTaskPayout(taskID string, payout []project.Payout, updatedBy string) error {
// 	db := db.GetSQL()
// 	var payoutStr *string
// 	var err error

// 	if payout != nil {
// 		payoutStr, err = convertToJSONString(payout)
// 		if err != nil {
// 			return fmt.Errorf("error converting payout to json: %w", err)
// 		}
// 	}

// 	_, err = db.Exec(`UPDATE task SET payout = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1::uuid`, taskID, payoutStr, updatedBy)
// 	if err != nil {
// 		return fmt.Errorf("error updating task payout: %w", err)
// 	}

// 	logger.LogMessage("info", "Updated task payout: %s", taskID)
// 	return nil
// }

// GetTaskFiles gets a task files
func GetTaskFiles(taskID string) ([]project.TaskFile, error) {
	db := db.GetSQL()
	var taskFiles []project.TaskFile
	rows, err := db.Query(`SELECT task_file_id, task_id, name, url, metadata, created_at
		FROM tasks_files WHERE task_id = $1::uuid`, taskID)
	if err != nil {
		return taskFiles, fmt.Errorf("Error getting task files: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var taskFile project.TaskFile
		err := rows.Scan(&taskFile.TaskFileID, &taskFile.TaskID, &taskFile.Name, &taskFile.URL, &taskFile.Metadata, &taskFile.CreatedAt)
		if err != nil {
			return taskFiles, fmt.Errorf("Error scanning task file: %w", err)
		}
		taskFiles = append(taskFiles, taskFile)
	}

	return taskFiles, nil
}

// DeleteTaskFile deletes a task file
func DeleteTaskFile(taskFileID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM tasks_files WHERE task_file_id = $1::uuid`, taskFileID)
	if err != nil {
		return fmt.Errorf("Error deleting task file: %w", err)
	}

	logger.LogMessage("info", "Deleted task file ID: %s", taskFileID)
	return nil
}

func PersonalTaskByMemberID(memberID string) ([]project.Task, error) {
	db := db.GetSQL()
	var personalTasks []project.Task
	rows, err := db.Query(`SELECT task_id, tv.project_id, tv.title, tv.description, col,
		tv.created_by, tv.updated_by, tv.poc_member_id, tv.notion_page, tv.tags, 
		tv.deadline, tv.assignee_member, tv.assignee_clan, tv.feedback, tv.position, 
		tv.created_at, tv.updated_at, tv.files, tv.subtasks, tv.comments,
		(SELECT COUNT(subtask_id) FROM subtask st WHERE st.task_id = tv.task_id AND col = (SELECT total_col from project p where p.project_id = tv.project_id)) AS completed_subtask_count,
		tv.payout, tv.vc_claim, tv.payment_created
		FROM task_view tv
		JOIN project p ON tv.project_id = p.project_id
		WHERE p.link_id = $1::uuid`, memberID)
	if err != nil {
		return personalTasks, fmt.Errorf("Error getting personal tasks: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var task project.Task
		var files, subtasks, comments *json.RawMessage
		var payout *string
		err := rows.Scan(&task.TaskID, &task.ProjectID, &task.Title, &task.Description, &task.Col,
			&task.CreatedBy, &task.UpdatedBy, &task.POCMemberID, &task.NotionPage, pq.Array(&task.Tags),
			&task.Deadline, pq.Array(&task.AssigneeMember), pq.Array(&task.AssigneeClan), &task.Feedback, &task.Position,
			&task.CreatedAt, &task.UpdatedAt, &files, &subtasks, &comments,
			&task.CompletedSubtaskCount,
			&payout, pq.Array(&task.VCClaim), &task.PaymentCreated)
		if err != nil {
			return personalTasks, fmt.Errorf("Error scanning personal task: %w", err)
		}

		if payout != nil {
			err := json.Unmarshal([]byte(*payout), &task.Payout)
			if err != nil {
				return personalTasks, fmt.Errorf("Error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err := json.Unmarshal(*files, &task.Files)
			if err != nil {
				return personalTasks, fmt.Errorf("error getting files: %w", err)
			}
		}

		if subtasks != nil {
			err := json.Unmarshal(*subtasks, &task.Subtasks)
			if err != nil {
				return personalTasks, fmt.Errorf("error getting subtasks: %w", err)
			}
		}

		if comments != nil {
			err := json.Unmarshal(*comments, &task.Comments)
			if err != nil {
				return personalTasks, fmt.Errorf("error getting comments: %w", err)
			}
		}

		personalTasks = append(personalTasks, task)
	}

	return personalTasks, nil
}

func AssignedTaskByMemberID(memberID string) ([]project.Task, error) {
	db := db.GetSQL()
	var assignedTasks []project.Task
	rows, err := db.Query(`SELECT task_id, project_id, project_name, columns, dao_id, COALESCE(dao_name, '') AS dao_name, department, title, description, col,
		created_by, updated_by, poc_member_id, notion_page, tags, 
		deadline, assignee_member, assignee_clan, feedback, position, 
		created_at, updated_at, files, subtasks, comments,
		payout, tv.vc_claim, tv.payment_created
		FROM task_view tv
		WHERE $1::uuid = ANY(assignee_member)`, memberID)
	if err != nil {
		return assignedTasks, fmt.Errorf("Error getting assigned tasks: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var task project.Task
		var files, subtasks, comments *json.RawMessage
		var payout, columns *string
		var err error
		err = rows.Scan(&task.TaskID, &task.ProjectID, &task.ProjectName, &columns, &task.DaoId, &task.DaoName, &task.Department, &task.Title, &task.Description, &task.Col,
			&task.CreatedBy, &task.UpdatedBy, &task.POCMemberID, &task.NotionPage, pq.Array(&task.Tags),
			&task.Deadline, pq.Array(&task.AssigneeMember), pq.Array(&task.AssigneeClan), &task.Feedback, &task.Position,
			&task.CreatedAt, &task.UpdatedAt, &files, &subtasks, &comments,
			&payout, pq.Array(&task.VCClaim), &task.PaymentCreated)
		if err != nil {
			return assignedTasks, fmt.Errorf("Error scanning assigned task: %w", err)
		}

		if payout != nil {
			err := json.Unmarshal([]byte(*payout), &task.Payout)
			if err != nil {
				return assignedTasks, fmt.Errorf("Error unmarshalling payout: %w", err)
			}
		}

		if columns != nil {
			err := json.Unmarshal([]byte(*columns), &task.Columns)
			if err != nil {
				return assignedTasks, fmt.Errorf("Error unmarshalling Columns: %w", err)
			}
		}

		if files != nil {
			err := json.Unmarshal(*files, &task.Files)
			if err != nil {
				return assignedTasks, fmt.Errorf("error getting files: %w", err)
			}
		}

		if subtasks != nil {
			err := json.Unmarshal(*subtasks, &task.Subtasks)
			if err != nil {
				return assignedTasks, fmt.Errorf("error getting subtasks: %w", err)
			}
		}

		if comments != nil {
			err := json.Unmarshal(*comments, &task.Comments)
			if err != nil {
				return assignedTasks, fmt.Errorf("error getting comments: %w", err)
			}
		}

		assignedTasks = append(assignedTasks, task)
	}

	return assignedTasks, nil
}

type TaskCount struct {
	MemberID string `json:"member_id"`
	Value    int    `json:"value"`
}

func AssignedTaskByLinkID(linkID string) ([]TaskCount, error) {
	db := db.GetSQL()
	var assignedTasks []TaskCount
	rows, err := db.Query(`SELECT UNNEST(t.assignee_member) AS member_id, COUNT(t.task_id) AS count
		FROM project p
		JOIN task t ON t.project_id = p.project_id
		WHERE p.completed IS NOT true
		AND t.col != p.total_col
		AND p.link_id = $1::uuid
		GROUP BY member_id`, linkID)
	if err != nil {
		return assignedTasks, fmt.Errorf("Error getting assigned tasks: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var count TaskCount
		err := rows.Scan(&count.MemberID, &count.Value)
		if err != nil {
			return assignedTasks, fmt.Errorf("Error scanning assigned task: %w", err)
		}

		assignedTasks = append(assignedTasks, count)
	}

	return assignedTasks, nil
}
