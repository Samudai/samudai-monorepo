package project

import (
	"encoding/json"
	"time"
)

type TaskStatus string

const (
	TaskStatusBacklog    TaskStatus = "backlog"
	TaskStatusToDo       TaskStatus = "to-do"
	TaskStatusInProgress TaskStatus = "in-progress"
	TaskStatusInReview   TaskStatus = "in-review"
	TaskStatusDone       TaskStatus = "done"
)

type PayoutPaymentStatus string

const (
	PayoutPaymentStatusUnInitiated PayoutPaymentStatus = "un-initiated"
	PayoutPaymentStatusInitiated   PayoutPaymentStatus = "payment-initiated"
	PayoutPaymentCompleted         PayoutPaymentStatus = "completed"
)

type TaskCreatedSource string

const (
	TaskCreatedSourceJob     TaskCreatedSource = "job"
	TaskCreatedSourceProject TaskCreatedSource = "project"
)

// Task represents a task
type Task struct {
	TaskID      string          `json:"task_id"`
	ProjectID   string          `json:"project_id"`
	ProjectName string          `json:"project_name"`
	Columns     []ProjectColumn `json:"columns"`
	DaoId       string          `json:"dao_id"`
	DaoName     string          `json:"dao_name"`
	Department  *string         `json:"department"`
	Title       string          `json:"title"`

	Col            int     `json:"col"`
	CreatedBy      *string `json:"created_by"`
	Position       float64 `json:"position"`
	UpdatedBy      *string `json:"updated_by"`
	Description    *string `json:"description"`
	DescriptionRaw *string `json:"description_raw"`
	// optional fields
	POCMemberID           *string            `json:"poc_member_id,omitempty"`
	GithubIssue           *int               `json:"github_issue,omitempty"`
	NotionPage            *string            `json:"notion_page,omitempty"`
	NotionProperty        *string            `json:"notion_property,omitempty"`
	Tags                  []string           `json:"tags,omitempty"`
	Deadline              *time.Time         `json:"deadline,omitempty"`
	AssigneeMember        []string           `json:"assignee_member"`
	AssigneeClan          []string           `json:"assignee_clan"`
	Feedback              *string            `json:"feedback,omitempty"`
	GithubPR              *GithubPR          `json:"github_pr,omitempty"`
	ResponseID            *string            `json:"response_id,omitempty"`
	ResponseType          ResponseType       `json:"response_type,omitempty"`
	MongoObject           *string            `json:"mongo_object,omitempty"`
	DiscussionID          *string            `json:"discussion_id,omitempty"`
	CompletedSubtaskCount *int               `json:"completed_subtask_count,omitempty"`
	AssociatedJobType     AssociatedJobType  `json:"associated_job_type,omitempty"`
	AssociatedJobId       *string            `json:"associated_job_id,omitempty"`
	Payout                []Payout           `json:"payout"`
	VCClaim               []string           `json:"vc_claim"`
	PaymentCreated        bool               `json:"payment_created"`
	Archived              bool               `json:"archived"`
	Files                 []TaskFile         `json:"files"`
	Subtasks              []Subtask          `json:"subtasks"`
	Comments              []Comment          `json:"comments"`
	Source                *TaskCreatedSource `json:"source"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

// Subtask is a subtask
type Subtask struct {
	SubtaskID      string  `json:"subtask_id"`
	ProjectID      string  `json:"project_id"`
	TaskID         string  `json:"task_id"`
	Title          string  `json:"title"`
	CreatedBy      *string `json:"created_by"`
	UpdatedBy      *string `json:"updated_by"`
	Description    *string `json:"description"`
	Position       float64 `json:"position"`
	Deadline       *string `json:"deadline"`
	Col            int     `json:"col"`
	DescriptionRaw *string `json:"description_raw"`

	GithubPR          *GithubPR         `json:"github_pr,omitempty"`
	GithubIssue       *int              `json:"github_issue,omitempty"`
	NotionPage        *string           `json:"notion_page,omitempty"`
	NotionProperty    *string           `json:"notion_property,omitempty"`
	AssigneeMember    []string          `json:"assignee_member,omitempty"`
	Archived          bool              `json:"archived,omitempty"`
	AssociatedJobType AssociatedJobType `json:"associated_job_type,omitempty"`
	AssociatedJobId   *string           `json:"associated_job_id,omitempty"`
	POCMemberID       *string           `json:"poc_member_id,omitempty"`
	Completed         bool              `json:"completed,omitempty"`

	Payout         []Payout `json:"payout"`
	PaymentCreated bool     `json:"payment_created"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type GithubPR struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	HTMLURL string `json:"html_url"`
	State   string `json:"state"`
}

type Payout struct {
	PayoutID        string              `json:"payout_id"`
	LinkType        string              `json:"link_type"`
	LinkID          string              `json:"link_id"`
	Name            string              `json:"name"`
	MemberID        *string             `json:"member_id"`
	ProviderID      string              `json:"provider_id"`
	ReceiverAddress string              `json:"receiver_address"`
	PayoutAmount    float64             `json:"payout_amount"`
	PayoutCurrency  *PayoutCurrency     `json:"payout_currency"`
	TokenAddress    *string             `json:"token_address"`
	Completed       bool                `json:"completed"`
	CreatedAt       *time.Time          `json:"created_at"`
	UpdatedAt       *time.Time          `json:"updated_at"`
	PaymentStatus   PayoutPaymentStatus `json:"payment_status"`
	PaymentType     *string             `json:"payment_type"`
}

type PendingPayout struct {
	PayoutID        string         `json:"payout_id"`
	DAOID           string         `json:"dao_id"`
	LinkType        string         `json:"link_type"`
	LinkID          string         `json:"link_id"`
	ProjectID       string         `json:"project_id"`
	MemberID        *string        `json:"member_id"`
	Provider        Provider       `json:"provider"`
	ReceiverAddress string         `json:"receiver_address"`
	PayoutAmount    float64        `json:"payout_amount"`
	PayoutCurrency  PayoutCurrency `json:"payout_currency"`
	TokenAddress    *string        `json:"token_address"`
	PaymentCreated  bool           `json:"payment_created"`
	Completed       bool           `json:"completed"`
	InitiatedBy     IMember        `json:"initiated_by"`
	CreatedAt       *time.Time     `json:"created_at"`
	UpdatedAt       *time.Time     `json:"updated_at"`
}

type PayoutCurrency struct {
	TokenAddress string  `json:"token_address"`
	Symbol       string  `json:"symbol"`
	Name         string  `json:"name"`
	Decimals     float64 `json:"decimals"`
	LogoUri      string  `json:"logo_uri"`
}

// Provider - copied from service-dao
type Provider struct {
	ID           int    `json:"id"`
	ProviderID   string `json:"provider_id"`
	DAOID        string `json:"dao_id"`
	ProviderType string `json:"provider_type"`
	Address      string `json:"address"`
	CreatedBy    string `json:"created_by"`
	ChainID      int    `json:"chain_id"`
	IsDefault    bool   `json:"is_default"`
	Name         string `json:"name"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type TaskFile struct {
	TaskFileID string           `json:"task_file_id"`
	TaskID     string           `json:"task_id"`
	Name       string           `json:"name"`
	URL        string           `json:"url"`
	Metadata   *json.RawMessage `json:"metadata"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
}

type TaskCredentials struct {
	TaskID   string `json:"task_id"`
	MemberID string `json:"member_id"`
	Claim    bool   `json:"claim"`

	CreatedAt *time.Time `json:"created_at"`
}

type DataPoint struct {
	Date  string `json:"date"`
	Value int    `json:"value"`
}
