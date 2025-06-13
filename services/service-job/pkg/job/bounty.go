package job

import "time"

type Bounty struct {
	BountyID       string         `json:"bounty_id"`
	DAOID          string         `json:"dao_id"`
	Title          string         `json:"title"`
	Description    *string        `json:"description"`
	DescriptionRaw *string        `json:"description_raw"`
	PayoutAmount   int            `json:"payout_amount"`
	PayoutCurrency string         `json:"payout_currency"`
	WinnerCount    int            `json:"winner_count"`
	CreatedBy      string         `json:"created_by"`
	Visibility     VisibilityType `json:"visibility"`
	Status         StatusType     `json:"status"`

	ProjectID *string `json:"project_id"`
	TaskID    *string `json:"task_id"`
	SubtaskId *string `json:"subtask_id"`

	// Time
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	// Optional
	UpdatedBy      *string `json:"updated_by"`
	ReqPeopleCount int     `json:"req_people_count"` // default to 1
	Department     *string `json:"department"`
	POCMemberID    *string `json:"poc_member_id"`

	Tags   []string `json:"tags"`
	Skills []string `json:"skills"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type BountyView struct {
	BountyID       string         `json:"bounty_id"`
	DAOID          string         `json:"dao_id"`
	DAOName        *string        `json:"dao_name"`
	Title          string         `json:"title"`
	Description    *string        `json:"description"`
	DescriptionRaw *string        `json:"description_raw"`
	PayoutAmount   int            `json:"payout_amount"`
	PayoutCurrency string         `json:"payout_currency"`
	WinnerCount    int            `json:"winner_count"`
	CreatedBy      IMember        `json:"created_by"`
	Visibility     VisibilityType `json:"visibility"`
	Status         StatusType     `json:"status"`

	TotalApplicantCount int                  `json:"total_applicant_count"`
	ProjectID           *string              `json:"project_id"`
	ProjectName         *string              `json:"project_name"`
	TaskID              *string              `json:"task_id"`
	TaskName            *string              `json:"task_name"`
	SubtaskId           *string              `json:"subtask_id"`
	SubtaskName         *string              `json:"subtask_name"`
	JobPayout           []Payout             `json:"payout"`
	BountyFiles         []BountyFileResponse `json:"files"`
	AcceptedSubmissions int			 		 `json:"accepted_submissions"`

	// Time
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
	// Optional
	UpdatedBy      IMember `json:"updated_by"`
	ReqPeopleCount int     `json:"req_people_count"` // default to 1
	Department     *string `json:"department"`
	POCMemberID    IMember `json:"poc_member"`

	Tags   []string `json:"tags"`
	Skills []string `json:"skills"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type Submission struct {
	SubmissionID string              `json:"submission_id"`
	BountyID     string              `json:"bounty_id"`
	MemberID     *string             `json:"member_id"`
	ClanID       *string             `json:"clan_id"`
	Submission   string              `json:"submission"`
	File         string              `json:"file"`
	Status       ApplicantStatusType `json:"status"`
	Rank         int                 `json:"rank"`
	Feedback     *string             `json:"feedback"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
