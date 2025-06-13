package project

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-project/pkg/project"
	"github.com/lib/pq"
)

func GetNotionTasks(memberID string, daos []project.DAODetail) ([]project.GetNotionTasksResp, error) {
	db := db.GetSQL()
	var tasks []project.GetNotionTasksResp
	for _, dao := range daos {
		rows, err := db.Query(`SELECT task_id, notion_page, notion_property
			FROM (SELECT t.task_id, p.project_id, t.notion_page, t.notion_property,
					p.link_id, t.created_at,
					COALESCE(( SELECT a.access
					FROM access a
					WHERE a.project_id = p.project_id AND (($1::uuid = ANY (a.members)) OR a.roles && $2)
					ORDER BY (a.access::integer) DESC LIMIT 1),
					CASE
						WHEN p.visibility = 'public' THEN 'view'::accesstype
						WHEN p.visibility = 'private' THEN 'hidden'::accesstype
						ELSE NULL::accesstype
					END) AS access
				FROM project p
				JOIN task t ON t.project_id = p.project_id) tmp
			WHERE link_id = $3
			AND access <> 'hidden'
			AND notion_page IS NOT NULL
			ORDER BY created_at DESC;`, memberID, pq.Array(dao.Roles), dao.DAOID)
		if err != nil {
			return tasks, fmt.Errorf("Error getting all notion tasks: %w", err)
		}

		defer rows.Close()

		for rows.Next() {
			var task project.GetNotionTasksResp
			err := rows.Scan(&task.TaskID, &task.NotionPage, &task.NotionProperty)
			if err != nil {
				return tasks, fmt.Errorf("Error scanning notion task: %w", err)
			}
			tasks = append(tasks, task)
		}
	}

	return tasks, nil
}
