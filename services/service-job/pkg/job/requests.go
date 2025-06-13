package job

// Pagination is the pagination param
type Pagination struct {
	Offset *int `json:"offset"`
	Limit  *int `json:"limit"`
}

type CreateApplicantParam struct {
	Applicant Applicant     `json:"applicant"`
	Type      ApplicantType `json:"type"`
}

type CreateSubmissionParam struct {
	Submission Submission    `json:"submission"`
	Type       ApplicantType `json:"type"`
}

type GetJobListForMemberParam struct {
	UserDaoIDs []string   `json:"user_dao_ids"`
	Query      *string    `json:"query"`
	Filter     *FilterJob `json:"filter"`
	Pagination
}

type FilterJob struct {
	DaoIDs       *[]string `json:"dao_ids"`
	Tags         *[]string `json:"tags"`
	Skills       *[]string `json:"skills"`
	PayoutAmount *Limit    `json:"payout_amount"`
}

type Limit struct {
	Min int `json:"min"`
	Max int `json:"max"`
}

type GetBountyListForMemberParam struct {
	UserDaoIDs []string      `json:"user_dao_ids"`
	Query      *string       `json:"query"`
	Filter     *FilterBounty `json:"filter"`
	Pagination
}

type FilterBounty struct {
	DaoIDs       *[]string `json:"dao_ids"`
	Tags         *[]string `json:"tags"`
	Skills       *[]string `json:"skills"`
	PayoutAmount *Limit    `json:"payout_amount"`
}
