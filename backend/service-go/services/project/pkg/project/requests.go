package project

import (
	gh "github.com/google/go-github/v45/github"
)

// Pagination is the pagination param
type Pagination struct {
	Offset *int `json:"offset"`
	Limit  *int `json:"limit"`
}

/*** Project ***/

type GetProjectsByMemberDAOParam struct {
	MemberID string      `json:"member_id" binding:"required"`
	DAOs     []DAODetail `json:"daos"`
}

type DAODetail struct {
	DAOID string   `json:"dao_id"`
	Roles []string `json:"roles"`
}

type UpdateProjectColumnsParam struct {
	ProjectID string          `json:"project_id" binding:"required"`
	Columns   []ProjectColumn `json:"columns" binding:"required"`
	TotalCol  int             `json:"total_col" binding:"required"`
	UpdatedBy string          `json:"updated_by"`
}

type UpdateProjectPinnedParam struct {
	ProjectID string `json:"project_id" binding:"required"`
	LinkID    string `json:"link_id" binding:"required"`
	Pinned    bool   `json:"pinned"`
	UpdatedBy string `json:"updated_by"`
}

/*** Task ***/

// UpdateTaskPositionParam is a struct for updating task position
type UpdateTaskPositionParam struct {
	ProjectID string  `json:"project_id" binding:"required"`
	TaskID    string  `json:"task_id" binding:"required"`
	Position  float64 `json:"position" binding:"required"`
	UpdatedBy string  `json:"updated_by"`
}

type CreateGithubTaskParam struct {
	DAOID     string    `json:"dao_id" binding:"required"`
	Repo      string    `json:"repo" binding:"required"`
	Issue     *gh.Issue `json:"issue"`
	Assignees []string  `json:"assignees"`
}

type UpdateTaskStatusParam struct {
	TaskID    string `json:"task_id" binding:"required"`
	Col       int    `json:"col" binding:"required"`
	UpdatedBy string `json:"updated_by"`
}

type UpdateSubTaskStatusParam struct {
	SubTaskID string `json:"subtask_id" binding:"required"`
	Col       int    `json:"col" binding:"required"`
	UpdatedBy string `json:"updated_by"`
}

type UpdateSubTaskPositionParam struct {
	SubtaskID string  `json:"subtask_id" binding:"required"`
	Position  float64 `json:"position"`
	UpdatedBy string  `json:"updated_by"`
}

type ArchiveSubTaskParam struct {
	SubtaskID string `json:"subtask_id" binding:"required"`
	Archived  bool   `json:"archived"`
	UpdatedBy string `json:"updated_by"`
}

type ApplicantType string

const (
	ApplicantTypeMember ApplicantType = "member"
	ApplicantTypeClan   ApplicantType = "clan"
)

type AssignTaskParam struct {
	Type           ApplicantType `json:"type" binding:"required"`
	TaskID         string        `json:"task_id" binding:"required"`
	AsigneeMembers *[]string     `json:"assignee_member"`
	AsigneeClans   *[]string     `json:"assignee_clan"`
	UpdatedBy      string        `json:"updated_by"`
}

/*** Response ***/

type UpdateResponseStatusParam struct {
	ResponseID string `json:"response_id" binding:"required"`
	Col        int    `json:"col" binding:"required"`
	UpdatedBy  string `json:"updated_by"`
}

type UpdateResponsePositionParam struct {
	ProjectID  string  `json:"project_id" binding:"required"`
	ResponseID string  `json:"response_id" binding:"required"`
	Position   float64 `json:"position" binding:"required"`
	UpdatedBy  string  `json:"updated_by"`
}

type AssignResponseParam struct {
	Type           ApplicantType `json:"type" binding:"required"`
	ResponseID     string        `json:"response_id" binding:"required"`
	AsigneeMembers *[]string     `json:"assignee_member"`
	AsigneeClans   *[]string     `json:"assignee_clan"`
	UpdatedBy      string        `json:"updated_by" binding:"required"`
}
