package dao

import "time"

type FavouriteResponse struct {
	FavouriteID string `json:"favourite_id"`
	MemberID    string `json:"member_id"`
	DAOID       string `json:"dao_id"`

	CreatedAt *time.Time `json:"created_at"`

	Name           string  `json:"name"`
	ProfilePicture *string `json:"profile_picture"`
}

type IMember struct {
	MemberID       string `json:"member_id"`
	Username       string `json:"username"`
	Name           string `json:"name"`
	ProfilePicture string `json:"profile_picture"`
}

type DAOMemberResponse struct {
	MemberID       string `json:"member_id"`
	LicensedMember string `json:"licensed_member"`
}

type SearchDAOResponse struct {
	DAOID      string  `json:"dao_id"`
	GuildID    string  `json:"guild_id"`
	Name       string  `json:"name"`
	Onboarding bool    `json:"onboarding"`
	DAOType    DAOType `json:"dao_type"`

	About           *string `json:"about"`
	OwnerID         *string `json:"owner_id"`
	ProfilePicture  *string `json:"profile_picture"`
	ContractAddress *string `json:"contract_address"`
	Snapshot        *string `json:"snapshot"`

	Members                []IMember    `json:"members"`
	MembersProfilePictures []string     `json:"members_profile_pictures,omitempty"`
	MembersCount           int          `json:"members_count,omitempty"`
	Roles                  []Role       `json:"roles"`
	Departments            []Department `json:"department"`
	Socials                []Social     `json:"socials"`
	Tokens                 []Token      `json:"tokens"`
	TokenGating            bool         `json:"token_gating"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`

	Tags                 []string             `json:"tags"`
	JoinDAOLink          *string              `json:"join_dao_link"`
	DaoCollaborationPass DaoCollaborationPass `json:"collaboration_pass"`
	OpenToCollaboration  bool                 `json:"open_to_collaboration"`
	POCMember            IMember              `json:"poc_member"`
	IsMember             string               `json:"ismember"`
}
