package project

type ProjectResponse struct {
	Project

	Access *string `json:"access,omitempty"` // member's access for the project

	TaskCount          *int `json:"task_count"`
	CompletedTaskCount *int `json:"completed_task_count"`
}

type FolderResponse struct {
	Folder
	Files []ProjectFile `json:"files"`
}

/*** Task ***/

type GetNotionTasksResp struct {
	TaskID         string  `json:"task_id"`
	NotionPage     *string `json:"notion_page"`
	NotionProperty *string `json:"notion_property"`
}

/*** SubTask ***/

// GetSubtaskByTaskResp is a subtask
type GetSubtaskByTaskResp struct {
	SubtaskID string `json:"subtask_id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}

type WorkProgressStats struct {
	TotalProjectCount     int `json:"total_project_count"`
	CompletedProjectCount int `json:"completed_project_count"`

	TotalTaskCount     int `json:"total_task_count"`
	CompletedTaskCount int `json:"completed_task_count"`
}

type IMember struct {
	MemberID       string	`json:"member_id,omitempty"`
	Username       string	`json:"username,omitempty"`
	Name 	 	   string	`json:"name,omitempty"`
	ProfilePicture string   `json:"profile_picture,omitempty"`
}