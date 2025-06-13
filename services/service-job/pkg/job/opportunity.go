package job

import (
	"encoding/json"
	"time"
)

type JobType string

type VisibilityType string

type StatusType string

type OpenTo string

type JobFormat string

const (
	JobTypeProject JobType = "project"
	JobTypeTask    JobType = "task"

	VisibilityTypePublic  VisibilityType = "public"
	VisibilityTypePrivate VisibilityType = "private"

	StatusTypeOpen     StatusType = "open"
	StatusTypeDraft    StatusType = "draft"
	StatusTypeClosed   StatusType = "closed"
	StatusTypeArchived StatusType = "archived"

	OpenToDAOs         OpenTo = "DAOs"
	OpenToDAOMembers   OpenTo = "DAO Members"
	OpenToCaptains     OpenTo = "Captains"
	OpenToContributors OpenTo = "Contributors"

	JobFormatFullTime  JobFormat = "full_time"
	JobFormatRemote    JobFormat = "remote"
	JobFormatFreelance JobFormat = "freelance"
)

type Opportunity struct {
	OpportunityID  string         `json:"job_id"`
	DAOID          string         `json:"dao_id"`
	Type           JobType        `json:"type"`
	Title          string         `json:"title"`
	Description    *string        `json:"description"`
	DescriptionRaw *string        `json:"description_raw"`
	CreatedBy      string         `json:"created_by"`
	Visibility     VisibilityType `json:"visibility"`
	Status         StatusType     `json:"status"`
	// Time
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	// Optional
	UpdatedBy      *string          `json:"updated_by"`
	ReqPeopleCount int              `json:"req_people_count"` // default to 1
	Department     *string          `json:"department"`
	ProjectID      *string          `json:"project_id"`
	TaskID         *string          `json:"task_id"`
	SubtaskId      *string          `json:"subtask_id"`
	Github         *string          `json:"github"`
	POCMemberID    *string          `json:"poc_member_id"`
	Questions      *json.RawMessage `json:"questions"`
	Captain        bool             `json:"captain"`
	OpenTo         []string         `json:"open_to"`
	Experience     int              `json:"experience"`
	JobFormat      *string          `json:"job_format"`
	TransactionCount int			`json:"transaction_count"`

	Skills []string `json:"skills"`
	Tags   []string `json:"tags"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	// Bounty
	PayoutAmount   int    `json:"payout_amount"`
	PayoutCurrency string `json:"payout_currency"`
}

type OpportunityView struct {
	OpportunityID  string         `json:"job_id"`
	DAOID          string         `json:"dao_id"`
	DAOName        *string        `json:"dao_name"`
	Type           JobType        `json:"type"`
	Title          string         `json:"title"`
	Description    *string        `json:"description"`
	DescriptionRaw *string        `json:"description_raw"`
	CreatedBy      IMember        `json:"created_by"`
	Visibility     VisibilityType `json:"visibility"`
	Status         StatusType     `json:"status"`
	// Time
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	// Optional
	JobPayout           []Payout         `json:"payout"`
	UpdatedBy           IMember          `json:"updated_by"`
	ReqPeopleCount      int              `json:"req_people_count"` // default to 1
	Department          *string          `json:"department"`
	ProjectID           *string          `json:"project_id"`
	ProjectName         *string          `json:"project_name"`
	TaskID              *string          `json:"task_id"`
	TaskName            *string          `json:"task_name"`
	SubtaskId           *string          `json:"subtask_id"`
	SubtaskName         *string          `json:"subtask_name"`
	Github              *string          `json:"github"`
	POCMemberID         IMember          `json:"poc_member"`
	Questions           *json.RawMessage `json:"questions"`
	Captain             bool             `json:"captain"`
	OpenTo              []string         `json:"open_to"`
	Experience          int              `json:"experience"`
	JobFormat           *string          `json:"job_format"`
	TotalApplicantCount int              `json:"total_applicant_count"`
	TransactionCount 	int				 `json:"transaction_count"`
	AcceptedApplicants  int 			 `json:"accepted_applicants"`

	Skills   []string          `json:"skills"`
	Tags     []string          `json:"tags"`
	JobFiles []JobFileResponse `json:"files"`

	CreatedAt      *time.Time `json:"created_at"`
	UpdatedAt      *time.Time `json:"updated_at"`
	PayoutAmount   int        `json:"payout_amount"`
	PayoutCurrency string     `json:"payout_currency"`
}

type ApplicantType string

type ApplicantStatusType string

const (
	ApplicantTypeMember ApplicantType = "member"
	ApplicantTypeClan   ApplicantType = "clan"

	ApplicantStatusTypeApplied  ApplicantStatusType = "applied"
	ApplicantStatusTypeAccepted ApplicantStatusType = "accepted"
	ApplicantStatusTypeRejected ApplicantStatusType = "rejected"
)

type Applicant struct {
	ApplicantID   string              `json:"applicant_id"`
	OpportunityID string              `json:"job_id"`
	MemberID      *string             `json:"member_id"`
	ClanID        *string             `json:"clan_id"`
	Answers       *json.RawMessage    `json:"answers"`
	Status        ApplicantStatusType `json:"status"`
	Application   string              `json:"application"`
	UpdatedBy     *string             `json:"updated_by"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type DataPoint struct {
	Date  string `json:"date"`
	Value int    `json:"value"`
}