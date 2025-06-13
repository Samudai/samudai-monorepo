package project

import (
	"encoding/json"
	"time"
)

type LinkType string

const (
	ProjectTypeMember LinkType = "member"
	ProjectTypeClan   LinkType = "clan"
	ProjectTypeDAO    LinkType = "dao"
)

type ProjectType string

const (
	ProjectTypeDefault    ProjectType = "default"
	ProjectTypeInternal   ProjectType = "internal"
	ProjectTypeInvestment ProjectType = "investment"
)

type ProjectVisibility string

const (
	ProjectVisibilityPrivate ProjectVisibility = "private"
	ProjectVisibilityPublic  ProjectVisibility = "public"
)

// Project is a struct that represents a project
type Project struct {
	ProjectID   string      `json:"project_id"`
	LinkID      string      `json:"link_id"`
	Type        LinkType    `json:"type"`
	ProjectType ProjectType `json:"project_type"`
	Title       string      `json:"title"`
	Description    *string           `json:"description"`
	DescriptionRaw *string           `json:"description_raw"`
	Visibility     ProjectVisibility `json:"visibility"`
	StartDate      *time.Time        `json:"start_date"`
	EndDate        *time.Time        `json:"end_date"`
	CreatedBy      string            `json:"created_by"`
	UpdatedBy      *string           `json:"updated_by"`
	Department     *string           `json:"department"`
	Columns        []ProjectColumn   `json:"columns"`
	TotalCol       int               `json:"total_col"`
	
	// optional fields
	GithubRepos    []string          `json:"github_repos,omitempty"`
	NotionDatabase *string           `json:"notion_database,omitempty"`
	POCMemberID    *string           `json:"poc_member_id,omitempty"`
	DiscordChannel *string           `json:"discord_channel,omitempty"`
	Captain        *string           `json:"captain,omitempty"`
	BudgetAmount   *float64          `json:"budget_amount,omitempty"`
	BudgetCurrency *string           `json:"budget_currency,omitempty"`
	Completed      bool              `json:"completed"`
	Pinned         bool              `json:"pinned"`
	FormID 		   *string 			 `json:"form_id,omitempty"`	

	Contributors []string `json:"contributors"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type ProjectColumn struct {
	ColumnID int    `json:"column_id"`
	Name     string `json:"name"`
}

var DefaultColumns []ProjectColumn = []ProjectColumn{
	{
		ColumnID: 1,
		Name:     string(TaskStatusBacklog),
	},
	{
		ColumnID: 2,
		Name:     string(TaskStatusToDo),
	},
	{
		ColumnID: 3,
		Name:     string(TaskStatusInProgress),
	},
	{
		ColumnID: 4,
		Name:     string(TaskStatusInReview),
	},
	{
		ColumnID: 5,
		Name:     string(TaskStatusDone),
	},
}

type Folder struct {
	FolderID  string `json:"folder_id"`
	ProjectID string `json:"project_id"`
	Name      string `json:"name"`

	Description *string `json:"description"`
	CreatedBy   string  `json:"created_by"`
	UpdatedBy   *string `json:"updated_by"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

// ProjectFile is a struct that represents a project attachment
type ProjectFile struct {
	ProjectFileID string           `json:"project_file_id"`
	FolderID      string           `json:"folder_id"`
	Name          string           `json:"name"`
	URL           string           `json:"url"`
	Metadata      *json.RawMessage `json:"metadata"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

func (m *ProjectFile) UnmarshalJSON(data []byte) error {
	type Alias ProjectFile
	temp := &struct {
		*Alias
	}{
		Alias: (*Alias)(m),
	}
	if err := json.Unmarshal(data, &temp); err != nil {
		aux := &struct {
			CreatedAt *string `json:"created_at"`
			UpdatedAt *string `json:"updated_at"`
			*Alias
		}{
			Alias: (*Alias)(m),
		}
		if err := json.Unmarshal(data, &aux); err != nil {
			return err
		}
		if aux.CreatedAt != nil {
			createdAt, err := time.Parse("2006-01-02T15:04:05", *aux.CreatedAt)
			if err != nil {
				return err
			}
			m.CreatedAt = &createdAt
		}
		if aux.UpdatedAt != nil {
			updatedAt, err := time.Parse("2006-01-02T15:04:05", *aux.UpdatedAt)
			if err != nil {
				return err
			}
			m.UpdatedAt = &updatedAt
		}
	}

	return nil
}
