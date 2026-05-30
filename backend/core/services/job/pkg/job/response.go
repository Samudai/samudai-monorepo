package job

type GetApplicantListResponse struct {
	Members []Applicant `json:"members"`
	Clans   []Applicant `json:"clans"`
}

type GetSubmissionListResponse struct {
	Members []Submission `json:"members"`
	Clans   []Submission `json:"clans"`
}

type IMember struct {
	MemberID       string `json:"member_id,omitempty"`
	Username       string `json:"username,omitempty"`
	Name           string `json:"name,omitempty"`
	ProfilePicture string `json:"profile_picture,omitempty"`
}
