package project

import "time"

type AccessType string

/* enum for access
0. hidden
1. view
2. create_task
3. manage_project
*/

const (
	AccessTypeHidden        AccessType = "hidden"
	AccessTypeView          AccessType = "view"
	AccessTypeCreateTask    AccessType = "create_task"
	AccessTypeManageProject AccessType = "manage_project"
)

type Access struct {
	AccessID   string     `json:"id"`
	ProjectID  string     `json:"project_id"`
	Access     AccessType `json:"access"`
	Members    []string   `json:"members"`
	Roles      []string   `json:"roles"`
	InviteLink string     `json:"invite_link"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

func GetDefaultAccess(projectID string) []Access {
	return []Access{
		{
			ProjectID: projectID,
			Access:    AccessTypeManageProject,
			Members:   []string{},
			Roles:     []string{},
		},
		{
			ProjectID: projectID,
			Access:    AccessTypeCreateTask,
			Members:   []string{},
			Roles:     []string{},
		},
		{
			ProjectID: projectID,
			Access:    AccessTypeView,
			Members:   []string{},
			Roles:     []string{},
		},
	}
}
