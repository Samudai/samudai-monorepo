package project

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-project/pkg/project"
	"github.com/lib/pq"
)

// ListAllProject returns all projects
func ListAllProject() ([]project.ProjectResponse, error) {
	db := db.GetSQL()
	var projects []project.ProjectResponse
	rows, err := db.Query(`SELECT link_id, type, project_id, title, description,
		visibility, project_type, poc_member_id, github_repos, start_date, 
		end_date, created_by, updated_by, discord_channel, created_at, 
		updated_at, captain, department, columns, poc_member_id, 
		budget_amount, budget_currency, completed, pinned
		total_col,
		(SELECT COUNT(task_id) FROM task WHERE project_id = p.project_id) AS task_count,
		(SELECT COUNT(task_id) FROM task WHERE project_id = p.project_id AND col = p.total_col) AS completed_task_count,
		ARRAY(SELECT DISTINCT member_id FROM member_assigned WHERE project_id = p.project_id) AS contributors
		FROM project p
		ORDER BY p.created_at DESC`)
	if err != nil {
		return projects, fmt.Errorf("Error getting all projects: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var columns *string
		var Project project.ProjectResponse
		err := rows.Scan(&Project.LinkID, &Project.Type, &Project.ProjectID, &Project.Title, &Project.Description,
			&Project.Visibility, &Project.ProjectType, &Project.POCMemberID, pq.Array(&Project.GithubRepos), &Project.StartDate,
			&Project.EndDate, &Project.CreatedBy, &Project.UpdatedBy, &Project.DiscordChannel, &Project.CreatedAt,
			&Project.UpdatedAt, &Project.Captain, &Project.Department, &columns, &Project.POCMemberID,
			&Project.BudgetAmount, &Project.BudgetCurrency, &Project.Completed, &Project.Pinned,
			&Project.TotalCol, &Project.TaskCount, &Project.CompletedTaskCount, pq.Array(&Project.Contributors))
		if err != nil {
			return projects, fmt.Errorf("Error scanning project: %w", err)
		}

		projects = append(projects, Project)
	}

	return projects, nil
}

// GetProjectByID returns a project by ID
func GetProjectByID(projectID string) (project.ProjectResponse, error) {
	db := db.GetSQL()
	var Project project.ProjectResponse
	var columns *string
	err := db.QueryRow(`SELECT link_id, type, project_id, title, description,
		visibility, project_type, poc_member_id, github_repos, start_date, 
		end_date, created_by, updated_by, discord_channel, created_at, 
		updated_at, captain, department, columns, poc_member_id, 
		budget_amount, budget_currency, completed, total_col, pinned,
		(SELECT COUNT(task_id) FROM task WHERE project_id = p.project_id) AS task_count,
		(SELECT COUNT(task_id) FROM task WHERE project_id = p.project_id AND col = p.total_col) AS completed_task_count,
		ARRAY(SELECT DISTINCT member_id FROM member_assigned WHERE project_id = p.project_id) AS contributors
		FROM project p 
		WHERE project_id = $1::uuid`, projectID).Scan(&Project.LinkID, &Project.Type, &Project.ProjectID, &Project.Title, &Project.Description,
		&Project.Visibility, &Project.ProjectType, &Project.POCMemberID, pq.Array(&Project.GithubRepos), &Project.StartDate,
		&Project.EndDate, &Project.CreatedBy, &Project.UpdatedBy, &Project.DiscordChannel, &Project.CreatedAt,
		&Project.UpdatedAt, &Project.Captain, &Project.Department, &columns, &Project.POCMemberID,
		&Project.BudgetAmount, &Project.BudgetCurrency, &Project.Completed, &Project.TotalCol, &Project.Pinned,
		&Project.TaskCount, &Project.CompletedTaskCount, pq.Array(&Project.Contributors))
	if err != nil {
		return Project, fmt.Errorf("Project not found: %w", err)
	}
	if columns != nil {
		err = json.Unmarshal([]byte(*columns), &Project.Columns)
		if err != nil {
			return Project, fmt.Errorf("Error unmarshalling columns: %w", err)
		}
	}

	return Project, nil
}

func GetContributorByProjectID(projectID string) (map[string]int, error) {
	db := db.GetSQL()
	members := make(map[string]int)
	rows, err := db.Query(`SELECT DISTINCT member_id, COUNT(*) over(PARTITION by member_id)
		FROM member_assigned WHERE project_id = $1::uuid`, projectID)
	if err != nil {
		return members, fmt.Errorf("Error getting all contributors: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var member string
		var count int
		err := rows.Scan(&member, &count)
		if err != nil {
			return members, fmt.Errorf("Error scanning contributor: %w", err)
		}
		members[member] = count
	}

	return members, nil
}

func GetProjectByLinkID(linkID string, limit, offset *int) ([]project.ProjectResponse, int, error) {
	db := db.GetSQL()
	var total int
	var projects []project.ProjectResponse
	rows, err := db.Query(`SELECT COUNT(*) over() as total, link_id, type, project_id, title, description,
		visibility, project_type, poc_member_id, github_repos, start_date, 
		end_date, created_by, updated_by, discord_channel, created_at, 
		updated_at, captain, department, columns, budget_amount, 
		budget_currency, completed, total_col, pinned,
		(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id) as task_count,
		(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id AND col = p.total_col) as completed_task_count,
		ARRAY(SELECT DISTINCT member_id FROM member_assigned WHERE project_id = p.project_id) AS contributors
		FROM project p WHERE link_id = $1::uuid
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, linkID, limit, offset)
	if err != nil {
		return projects, total, fmt.Errorf("Error getting all projects: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var columns *string
		var Project project.ProjectResponse
		err := rows.Scan(&total, &Project.LinkID, &Project.Type, &Project.ProjectID, &Project.Title, &Project.Description,
			&Project.Visibility, &Project.ProjectType, &Project.POCMemberID, pq.Array(&Project.GithubRepos), &Project.StartDate,
			&Project.EndDate, &Project.CreatedBy, &Project.UpdatedBy, &Project.DiscordChannel, &Project.CreatedAt,
			&Project.UpdatedAt, &Project.Captain, &Project.Department, &columns, &Project.BudgetAmount,
			&Project.BudgetCurrency, &Project.Completed, &Project.TotalCol, &Project.Pinned,
			&Project.TaskCount, &Project.CompletedTaskCount, pq.Array(&Project.Contributors))
		if err != nil {
			return projects, total, fmt.Errorf("Error scanning project: %w", err)
		}

		if columns != nil {
			err = json.Unmarshal([]byte(*columns), &Project.Columns)
			if err != nil {
				return projects, total, fmt.Errorf("Error unmarshalling columns: %w", err)
			}
		}

		projects = append(projects, Project)
	}

	return projects, total, nil
}

func GetProjectsByMemberDAO(memberID string, daos []project.DAODetail) ([]project.ProjectResponse, int, error) {
	db := db.GetSQL()
	var total int
	var projects []project.ProjectResponse
	for _, dao := range daos {
		if dao.DAOID != "" {
			rows, err := db.Query(`WITH access_tbl AS (SELECT p.project_id, COALESCE(( SELECT a.access
					FROM access a
					WHERE a.project_id = p.project_id AND ($1::uuid = ANY (a.members) OR a.roles && $2)
					ORDER BY (a.access::integer) DESC LIMIT 1),
					CASE WHEN p.visibility = 'public' THEN 'view'::accesstype
						WHEN p.visibility = 'private' THEN 'hidden'::accesstype
					END) AS access
					FROM project p)
				SELECT COUNT(*) over() as total, p.link_id, p.type, p.project_id, p.title, p.visibility, 
					t.access, p.project_type, p.start_date, p.end_date, p.captain,
					p.department, p.created_at, p.updated_at, total_col, pinned,
					(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id) as task_count,
					(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id AND col = p.total_col) as completed_task_count,
					ARRAY(SELECT DISTINCT member_id FROM member_assigned WHERE project_id = p.project_id) AS contributors
				FROM project p
				JOIN access_tbl t ON t.project_id = p.project_id
				WHERE p.link_id = $3::uuid
				ORDER BY p.created_at DESC`, memberID, pq.Array(dao.Roles), dao.DAOID)
			if err != nil {
				return projects, total, fmt.Errorf("Error getting all projects: %w", err)
			}

			defer rows.Close()

			for rows.Next() {
				var project project.ProjectResponse
				err := rows.Scan(&total, &project.LinkID, &project.Type, &project.ProjectID, &project.Title, &project.Visibility,
					&project.Access, &project.ProjectType, &project.StartDate, &project.EndDate, &project.Captain,
					&project.Department, &project.CreatedAt, &project.UpdatedAt, &project.TotalCol, &project.Pinned,
					&project.TaskCount, &project.CompletedTaskCount, pq.Array(&project.Contributors))
				if err != nil {
					return projects, total, fmt.Errorf("Error scanning project: %w", err)
				}
				projects = append(projects, project)
			}
		}
	}

	return projects, total, nil
}

func GetProjectsByMember(memberID string, daos []project.DAODetail) ([]project.ProjectResponse, error) {
	db := db.GetSQL()
	projects, _, err := GetProjectsByMemberDAO(memberID, daos)
	if err != nil {
		return projects, fmt.Errorf("Error getting all projects: %w", err)
	}

	var daoIDs []string
	for _, dao := range daos {
		if dao.DAOID != "" {
			daoIDs = append(daoIDs, dao.DAOID)
		}
	}

	var daosArr *pq.StringArray
	if len(daoIDs) > 0 {
		d := pq.StringArray(daoIDs)
		daosArr = &d
	}

	rows, err := db.Query(`SELECT p.link_id, p.type, p.project_id, p.title, p.visibility, 
			a.access, p.project_type, p.start_date, p.end_date, p.captain,
			p.department, p.created_at, p.updated_at, total_col, pinned,
			(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id) as task_count,
			(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id AND col = p.total_col) as completed_task_count,
			ARRAY(SELECT DISTINCT member_id FROM member_assigned WHERE project_id = p.project_id) AS contributors
		FROM project p
		JOIN access a ON a.project_id = p.project_id
		WHERE $1::uuid = ANY(a.members)
		AND CASE WHEN $2::uuid[] IS NOT NULL THEN p.link_id <> ANY($2::uuid[]) ELSE true END
		ORDER BY p.created_at DESC;`, memberID, daosArr)
	if err != nil {
		return projects, fmt.Errorf("Error getting all projects with access: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var project project.ProjectResponse
		err := rows.Scan(&project.LinkID, &project.Type, &project.ProjectID, &project.Title, &project.Visibility,
			&project.Access, &project.ProjectType, &project.StartDate, &project.EndDate, &project.Captain,
			&project.Department, &project.CreatedAt, &project.UpdatedAt, &project.TotalCol, &project.Pinned,
			&project.TaskCount, &project.CompletedTaskCount, pq.Array(&project.Contributors))
		if err != nil {
			return projects, fmt.Errorf("Error scanning project: %w", err)
		}
		projects = append(projects, project)
	}

	return projects, nil
}

// CreateProject creates a new project
func CreateProject(params project.Project) (string, error) {
	db := db.GetSQL()
	var projectID string

	if params.Columns == nil {
		params.Columns = project.DefaultColumns
		params.TotalCol = len(project.DefaultColumns)
	}

	params.Visibility = project.ProjectVisibilityPrivate

	columns, err := convertToJSONString(params.Columns)
	if err != nil {
		return projectID, fmt.Errorf("Error marshalling columns: %w", err)
	}

	err = db.QueryRow(`INSERT INTO project (link_id, type, title, description, visibility, 
		poc_member_id, start_date, end_date, created_by, discord_channel, 
		project_type, captain, department, columns, budget_amount, 
		budget_currency, total_col, pinned, form_id, updated_by, updated_at)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $9, CURRENT_TIMESTAMP)
		RETURNING project_id`,
		params.LinkID, params.Type, params.Title, params.Description, params.Visibility,
		params.POCMemberID, params.StartDate, params.EndDate, params.CreatedBy, params.DiscordChannel,
		params.ProjectType, params.Captain, params.Department, columns, params.BudgetAmount,
		params.BudgetCurrency, params.TotalCol, params.Pinned, params.FormID).Scan(&projectID)
	if err != nil {
		return "", fmt.Errorf("Error creating project: %w", err)
	}

	if projectID != "" {
		access := project.GetDefaultAccess(projectID)
		err = CreateAccess(access)
		if err != nil {
			return "", fmt.Errorf("Error creating access: %w", err)
		}
	}

	logger.LogMessage("info", "Added project ID: %s", projectID)

	return projectID, nil
}

// UpdateProject updates a project
func UpdateProject(params project.Project) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE project SET title = $2, description = $3, visibility = $4, poc_member_id = $5, 
		start_date = $6, end_date = $7, updated_by = $8, department = $9, budget_amount = $10, 
		budget_currency = $11, github_repos = $12, updated_at = CURRENT_TIMESTAMP
		WHERE project_id = $1::uuid`,
		params.ProjectID, params.Title, params.Description, params.Visibility, params.POCMemberID,
		params.StartDate, params.EndDate, params.UpdatedBy, params.Department, params.BudgetAmount,
		params.BudgetCurrency, pq.Array(params.GithubRepos))
	if err != nil {
		return fmt.Errorf("Error updating project: %w", err)
	}

	logger.LogMessage("info", "Updated project ID: %s", params.ProjectID)
	return nil
}

// DeleteProject deletes a project
func DeleteProject(projectID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM project WHERE project_id = $1::uuid`, projectID)
	if err != nil {
		return fmt.Errorf("Error deleting project: %w", err)
	}

	logger.LogMessage("info", "Deleted project ID: %s", projectID)

	return nil
}

/*** Project Files ***/

// CreateProjectFile creates a new project file
func CreateProjectFile(params project.ProjectFile) (string, error) {
	db := db.GetSQL()
	var projectFileID string
	err := db.QueryRow(`INSERT INTO project_files (folder_id, name, url, metadata)
		VALUES ($1::uuid, $2, $3, $4) RETURNING project_file_id`,
		params.FolderID, params.Name, params.URL, params.Metadata).Scan(&projectFileID)
	if err != nil {
		return projectFileID, fmt.Errorf("Error creating project file: %w", err)
	}

	logger.LogMessage("info", "Added file for project_id: %s", params.FolderID)
	return projectFileID, nil
}

// GetProjectFiles gets all project files for a project
func GetProjectFiles(folderID string) ([]project.ProjectFile, int, error) {
	db := db.GetSQL()
	var total int
	var projectFiles []project.ProjectFile
	rows, err := db.Query(`SELECT COUNT(*) OVER() as total, project_file_id, folder_id, name, url, 
		metadata, created_at
		FROM project_files WHERE folder_id = $1::uuid`, folderID)
	if err != nil {
		return projectFiles, total, fmt.Errorf("Error getting project files: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var projectFile project.ProjectFile
		err := rows.Scan(&total, &projectFile.ProjectFileID, &projectFile.FolderID, &projectFile.Name,
			&projectFile.URL, &projectFile.Metadata, &projectFile.CreatedAt)
		if err != nil {
			return projectFiles, total, fmt.Errorf("Error scanning project file: %w", err)
		}
		projectFiles = append(projectFiles, projectFile)
	}

	return projectFiles, total, nil
}

// DeleteProjectFile deletes a project file
func DeleteProjectFile(projectFileID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM project_files WHERE project_file_id = $1::uuid`, projectFileID)
	if err != nil {
		return fmt.Errorf("Error deleting project file: %w", err)
	}

	logger.LogMessage("info", "Deleted project file ID: %s", projectFileID)
	return nil
}

// CreateGithubLink creates a new github link
func CreateGithubLink(projectID string, repos []string, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE project SET github_repos = $2, updated_by = $3::uuid, updated_at = CURRENT_TIMESTAMP
		WHERE project_id = $1::uuid`, projectID, pq.StringArray(repos), updatedBy)
	if err != nil {
		return fmt.Errorf("Error creating github link: %w", err)
	}

	logger.LogMessage("info", "Added github sync for project_id: %s", projectID)
	return nil
}

func UpdateProjectColumns(params project.UpdateProjectColumnsParam) error {
	db := db.GetSQL()
	columnsJSON, err := convertToJSONString(params.Columns)
	if err != nil {
		return fmt.Errorf("Error marshalling columns: %w", err)
	}

	_, err = db.Exec(`UPDATE project SET columns = $2, total_col = $3, updated_by = $4, updated_at = CURRENT_TIMESTAMP
		WHERE project_id = $1::uuid`, params.ProjectID, columnsJSON, params.TotalCol, params.UpdatedBy)
	if err != nil {
		return fmt.Errorf("Error updating project columns: %w", err)
	}

	logger.LogMessage("info", "Updated project columns for project_id: %s", params.ProjectID)
	return nil
}

func UpdateProjectCompleted(projectID string, completed bool, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE project SET completed = $2, updated_by = $3::uuid, updated_at = CURRENT_TIMESTAMP
		WHERE project_id = $1::uuid`, projectID, completed, updatedBy)
	if err != nil {
		return fmt.Errorf("Error updating project completed: %w", err)
	}

	logger.LogMessage("info", "Updated project completed for project_id: %s", projectID)
	return nil
}

func UpdateProjectVisibility(projectID string, visibility project.ProjectVisibility, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE project SET visibility = $2, updated_by = $3::uuid, updated_at = CURRENT_TIMESTAMP
		WHERE project_id = $1::uuid`, projectID, visibility, updatedBy)
	if err != nil {
		return fmt.Errorf("Error updating project visibility: %w", err)
	}

	logger.LogMessage("info", "Updated project visibility for project_id: %s", projectID)
	return nil
}

func UpdateProjectPinned(param project.UpdateProjectPinnedParam) (bool, error) {
	db := db.GetSQL()
	var count int
	if param.Pinned {
		err := db.QueryRow(`SELECT COUNT(*) FROM project WHERE link_id = $1::uuid AND pinned = true`, param.LinkID).Scan(&count)
		if err != nil {
			return false, fmt.Errorf("Error getting pinned project count: %w", err)
		}
	}
	if count < 4 || !param.Pinned {
		_, err := db.Exec(`UPDATE project SET pinned = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
		WHERE project_id = $1::uuid`, param.ProjectID, param.Pinned, param.UpdatedBy)
		if err != nil {
			return false, fmt.Errorf("Error updating project pinned: %w", err)
		}
		logger.LogMessage("info", "Updated project pinned for project_id: %s", param.ProjectID)
		return true, nil
	}

	return false, nil
}

func GetInvestmentForForm(daoID string, formID string) (string, error) {
	db := db.GetSQL()
	var investmentBoard string
	err := db.QueryRow(`SELECT project_id FROM project WHERE link_id = $1::uuid AND form_id = $2 AND project_type = $3`,
		daoID, formID, project.ProjectTypeInvestment).Scan(&investmentBoard)
	if err != nil {
		return investmentBoard, fmt.Errorf("Error getting investment board: %w", err)
	}

	return investmentBoard, nil
}

func GetInvestmentProjectID(daoID string) (string, error) {
	db := db.GetSQL()
	var investmentBoard string
	err := db.QueryRow(`SELECT project_id FROM project WHERE link_id = $1::uuid AND project_type = $2`,
		daoID, project.ProjectTypeInvestment).Scan(&investmentBoard)
	if err != nil {
		return investmentBoard, fmt.Errorf("Error getting investment board: %w", err)
	}

	return investmentBoard, nil
}

func SearchProject(query string, daoID *string) ([]project.Project, error) {
	db := db.GetSQL()
	var projects []project.Project
	rows, err := db.Query(`SELECT project_id, title, description, link_id, type, 
		project_type, total_col, github_repos, completed, visibility, 
		created_by, created_at, updated_by, updated_at
		FROM project 
		WHERE (title ~* $1 OR description ~* $1)
		AND CASE WHEN $2::uuid IS NOT NULL THEN link_id = $2::uuid ELSE true END
		limit 10`, query, daoID)
	if err != nil {
		return projects, fmt.Errorf("Error searching project: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var project project.Project
		err := rows.Scan(&project.ProjectID, &project.Title, &project.Description, &project.LinkID, &project.Type,
			&project.ProjectType, &project.TotalCol, pq.Array(&project.GithubRepos), &project.Completed, &project.Visibility,
			&project.CreatedBy, &project.CreatedAt, &project.UpdatedBy, &project.UpdatedAt)
		if err != nil {
			return projects, fmt.Errorf("Error scanning project: %w", err)
		}
		projects = append(projects, project)
	}

	return projects, nil
}

func GetWorkProgress(linkID string) (project.WorkProgressStats, error) {
	db := db.GetSQL()
	var data project.WorkProgressStats
	err := db.QueryRow(`SELECT COUNT(task_id) as total, SUM(CASE t.col WHEN p.total_col THEN 1 ELSE 0 END) as completed
		FROM project p
		JOIN task t ON t.project_id = p.project_id
		WHERE p.link_id = $1::uuid`, linkID).Scan(&data.TotalTaskCount, &data.CompletedTaskCount)
	if err != nil {
		return data, fmt.Errorf("Error getting work progress: %w", err)
	}

	err = db.QueryRow(`SELECT COUNT(project_id) as total, SUM(CASE completed WHEN true THEN 1 ELSE 0 END) as completed
		FROM project
		WHERE link_id = $1::uuid`, linkID).Scan(&data.TotalProjectCount, &data.CompletedProjectCount)
	if err != nil {
		return data, fmt.Errorf("Error getting work progress: %w", err)
	}

	return data, nil
}

func ArchiveProject(projectID string, archived bool, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE project SET is_archived = $1, updated_by = $2 WHERE project_id = $3::uuid`,
		archived, updatedBy, projectID)
	if err != nil {
		return fmt.Errorf("failed to update subtask: %w", err)
	}
	logger.LogMessage("info", "Archived project: %s completed state: %v", projectID, archived)

	return nil
}

func GetArchivedProjectsByMemberDAO(memberID string, daos []project.DAODetail) ([]project.ProjectResponse, int, error) {
	db := db.GetSQL()
	var total int
	var projects []project.ProjectResponse
	for _, dao := range daos {
		if dao.DAOID != "" {
			rows, err := db.Query(`WITH access_tbl AS (SELECT p.project_id, COALESCE(( SELECT a.access
					FROM access a
					WHERE a.project_id = p.project_id AND ($1::uuid = ANY (a.members) OR a.roles && $2)
					ORDER BY (a.access::integer) DESC LIMIT 1),
					CASE WHEN p.visibility = 'public' THEN 'view'::accesstype
						WHEN p.visibility = 'private' THEN 'hidden'::accesstype
					END) AS access
					FROM project p)
				SELECT COUNT(*) over() as total, p.link_id, p.type, p.project_id, p.title, p.visibility, 
					t.access, p.project_type, p.start_date, p.end_date, p.captain,
					p.department, p.created_at, p.updated_at, total_col, pinned,
					(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id) as task_count,
					(SELECT COUNT(task_id) FROM task t WHERE t.project_id = p.project_id AND col = p.total_col) as completed_task_count,
					ARRAY(SELECT DISTINCT member_id FROM member_assigned WHERE project_id = p.project_id) AS contributors
				FROM project p
				JOIN access_tbl t ON t.project_id = p.project_id
				WHERE p.link_id = $3::uuid AND p.is_archived = $4
				ORDER BY p.created_at DESC`, memberID, pq.Array(dao.Roles), dao.DAOID, true)
			if err != nil {
				return projects, total, fmt.Errorf("Error getting all projects: %w", err)
			}

			defer rows.Close()

			for rows.Next() {
				var project project.ProjectResponse
				err := rows.Scan(&total, &project.LinkID, &project.Type, &project.ProjectID, &project.Title, &project.Visibility,
					&project.Access, &project.ProjectType, &project.StartDate, &project.EndDate, &project.Captain,
					&project.Department, &project.CreatedAt, &project.UpdatedAt, &project.TotalCol, &project.Pinned,
					&project.TaskCount, &project.CompletedTaskCount, pq.Array(&project.Contributors))
				if err != nil {
					return projects, total, fmt.Errorf("Error scanning project: %w", err)
				}
				projects = append(projects, project)
			}
		}
	}

	return projects, total, nil
}

func GetProjectCountForDao(daoId string) (int, error) {
	db := db.GetSQL()

	var Count int
	err := db.QueryRow(`SELECT COUNT(*) FROM project WHERE type = 'dao' AND link_id = $1`, daoId).Scan(&Count)
	if err != nil {
		return Count, err
	}

	return Count, nil
}

func CreateFolder(params project.Folder) (string, error) {
	db := db.GetSQL()
	var folderID string
	err := db.QueryRow(`INSERT INTO folder (project_id, name, description, created_by)
		VALUES ($1, $2, $3, $4)
		RETURNING folder_id`, params.ProjectID, params.Name, params.Description, params.CreatedBy).Scan(&folderID)
	if err != nil {
		return folderID, fmt.Errorf("Error creating folder: %w", err)
	}

	logger.LogMessage("info", "Created folder: %s", folderID)
	return folderID, nil
}

func GetFolderByID(folderID string) (project.FolderResponse, error) {
	db := db.GetSQL()
	var folder project.FolderResponse
	var files *json.RawMessage
	err := db.QueryRow(`SELECT f.folder_id, f.name, f.created_at, f.updated_at,
			f.project_id, f.description, f.created_by, f.updated_by, 
			to_json(ARRAY(SELECT json_build_object('name', pf.name, 
				'project_file_id', pf.project_file_id, 'url', pf.url, 'metadata', pf.metadata, 'created_at', pf.created_at) AS file
			FROM project_files pf WHERE pf.folder_id = f.folder_id)) AS files
   		FROM folder f
		WHERE folder_id = $1::uuid`, folderID).Scan(&folder.FolderID, &folder.Name, &folder.CreatedAt, &folder.UpdatedAt,
		&folder.ProjectID, &folder.Description, &folder.CreatedBy, &folder.UpdatedBy, &files)
	if err != nil {
		return folder, fmt.Errorf("Error getting folder: %w", err)
	}

	if files != nil {
		err = json.Unmarshal(*files, &folder.Files)
		if err != nil {
			return folder, fmt.Errorf("Error unmarshalling folder files: %w", err)
		}
	}

	return folder, nil
}

func GetFolderByProjectID(projectID string) ([]project.FolderResponse, error) {
	db := db.GetSQL()
	var folders []project.FolderResponse
	rows, err := db.Query(`SELECT f.folder_id, f.name, f.created_at, f.updated_at,
			f.project_id, f.description, f.created_by, f.updated_by, 
			to_json(ARRAY(SELECT json_build_object('name', pf.name, 
				'project_file_id', pf.project_file_id, 'url', pf.url, 'metadata', pf.metadata, 'created_at', pf.created_at) AS file
			FROM project_files pf WHERE pf.folder_id = f.folder_id)) AS files
   		FROM folder f
		WHERE project_id = $1::uuid`, projectID)
	if err != nil {
		return folders, fmt.Errorf("Error getting folder: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var folder project.FolderResponse
		var files *json.RawMessage
		err := rows.Scan(&folder.FolderID, &folder.Name, &folder.CreatedAt, &folder.UpdatedAt,
			&folder.ProjectID, &folder.Description, &folder.CreatedBy, &folder.UpdatedBy, &files)
		if err != nil {
			return folders, fmt.Errorf("Error scanning folder: %w", err)
		}

		if files != nil {
			err = json.Unmarshal(*files, &folder.Files)
			if err != nil {
				return folders, fmt.Errorf("Error unmarshalling folder files: %w", err)
			}
		}
		folders = append(folders, folder)
	}

	return folders, nil
}

func UpdateFolder(params project.Folder) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE folder SET name = $2, description = $3, updated_by = $4, updated_at = CURRENT_TIMESTAMP
		WHERE folder_id = $1::uuid`, params.FolderID, params.Name, params.Description, params.UpdatedBy)
	if err != nil {
		return fmt.Errorf("Error updating folder: %w", err)
	}

	logger.LogMessage("info", "Updated folder: %s", params.FolderID)
	return nil
}

func DeleteFolder(folderID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM folder WHERE folder_id = $1::uuid`, folderID)
	if err != nil {
		return fmt.Errorf("Error deleting folder: %w", err)
	}

	logger.LogMessage("info", "Deleted folder: %s", folderID)
	return nil
}
