package discussion

import (
    "time"
)
type DiscussionResponse struct {
    DiscussionID string             `json:"discussion_id"`
    DAOID        string             `json:"dao_id"`
    Topic        string             `json:"topic"`
    Description  *string            `json:"description"`
    DescriptionRaw  *string         `json:"description_raw"`
    CreatedBy    IMember            `json:"created_by"`
    UpdatedBy    *string            `json:"updated_by"`
    Category     DiscussionCategory `json:"category"`
    CategoryID   *string            `json:"category_id"`
    Closed       bool               `json:"closed"`
    ClosedOn     *time.Time         `json:"closed_on"`
    Pinned       bool               `json:"pinned"` 
    Tags         []string           `json:"tags"`
    LastCommentAt *time.Time        `json:"last_comment_at"`
    Views        int                `json:"views"`
    Visibility   VisibilityType     `json:"visibility"`

    ProposalID *string `json:"proposal_id"`

    CreatedAt *time.Time `json:"created_at"`
    UpdatedAt *time.Time `json:"updated_at"`

    ParticipantCount int       `json:"participant_count"`
    Participants     []IMember  `json:"participants"`
    Messages         []Message `json:"messages"`
    MessageCount     int        `json:"message_count"`

    // OptedIn is true if the member is opted in to the discussion
    OptedIn *bool `json:"opted_in,omitempty"`
}


type IMember struct {
	MemberId		string `json:"member_id"`
	Username        string `json:"username"`
	ProfilePicture  string `json:"profile_picture"`
	Name 			string `json:"name"`
}