package project

import (
	"github.com/Samudai/samudai-pkg/db"
	gh "github.com/google/go-github/v45/github"
	"github.com/lib/pq"
)

func GetProjectIDsFromGithubRepo(daoID string, repo string) ([]string, error) {
	db := db.GetSQL()
	var projectIDs []string
	rows, err := db.Query("SELECT project_id FROM project WHERE link_id = $1::uuid AND $2 = ANY(github_repos)", daoID, repo)
	if err != nil {
		return projectIDs, err
	}

	defer rows.Close()

	for rows.Next() {
		var projectID string
		err := rows.Scan(&projectID)
		if err != nil {
			return projectIDs, err
		}
		projectIDs = append(projectIDs, projectID)
	}

	return projectIDs, nil
}

// CreateTaskFromGithubIssue creates a task from a github issue
func CreateTaskFromGithubIssue(issue *gh.Issue, projectIDs []string, assignees []string) error {
	db := db.GetSQL()
	var labels *pq.StringArray
	if issue.Labels != nil {
		l := parseLabels(issue.Labels)
		Labels := pq.StringArray(l)
		labels = &Labels
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	for _, projectID := range projectIDs {
		var count int
		err := tx.QueryRow(`SELECT COUNT(*) over() as total FROM task_view WHERE project_id = $1::uuid`, projectID).Scan(&count)
		if err != nil {
			return err
		}

		_, err = tx.Exec(`INSERT INTO task (project_id, title, description, created_at, col, 
			tags, github_issue, assignee_member, position)
			VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9)`,
			projectID, issue.GetTitle(), issue.GetBody(), issue.GetCreatedAt(), 1,
			labels, issue.GetID(), pq.StringArray(assignees), count)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func UpdateTaskFromGithubIssue(issue *gh.Issue, projectIDs []string, assignees []string) error {
	db := db.GetSQL()
	var labels *pq.StringArray
	if issue.Labels != nil {
		l := parseLabels(issue.Labels)
		Labels := pq.StringArray(l)
		labels = &Labels
	}

	for _, projectID := range projectIDs {
		_, err := db.Exec(`UPDATE task SET title = $3, description = $4, updated_at = $5, tags = $6, assignee_member = $7
			WHERE project_id = $1::uuid AND github_issue = $2`,
			projectID, issue.GetID(), issue.GetTitle(), issue.GetBody(), issue.GetUpdatedAt(), labels, pq.StringArray(assignees))
		if err != nil {
			return err
		}
	}
	return nil
}
