package discovery

type DiscoverDAOResponse struct {
	DAOID string `json:"dao_id"`
	// Name           string  `json:"name"`
	// ProfilePicture *string `json:"profile_picture"`

	BountiesOpen  int `json:"bounties_open"`
	BountiesTotal int `json:"bounties_total"`

	OpportunitiesOpen  int `json:"opportunities_open"`
	OpportunitiesTotal int `json:"opportunities_total"`

	// TeamSize int `json:"team_size"`

	ProjectsOngoing   int `json:"projects_ongoing"`
	ProjectsCompleted int `json:"projects_completed"`
}

type DiscoverMemberResponse struct {
	MemberID string `json:"member_id"`
	// Username       string   `json:"username"`
	// Name           string   `json:"name"`
	// ProfilePicture *string  `json:"profile_picture"`
	// Skills         []string `json:"skills"`

	BadgesEarned int `json:"badges_earned"` // /api/web3/verifiablecred/add

	TasksOngoing   int `json:"tasks_ongoing"`
	TasksCompleted int `json:"tasks_completed"`

	// DAOCount int `json:"dao_count"`
}
