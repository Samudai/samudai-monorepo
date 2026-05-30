package project

import "time"

type CommentType string

const (
	CommentTypeProject CommentType = "project"
	CommentTypeTask    CommentType = "task"
)

type Comment struct {
	CommentID string      `json:"id"`
	LinkID    string      `json:"link_id"`
	Body      string      `json:"body"`
	Author    string      `json:"author"`
	Type      CommentType `json:"type"`

	TaggedMembers []string `json:"tagged_members"`

	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type ResponseType string

const (
	ResponseTypeDeal ResponseType = "deal"
)

type AssociatedJobType string

const (
	AssociatedJobTypeTask   AssociatedJobType = "task"
	AssociatedJobTypeBounty AssociatedJobType = "bounty"
	AssociatedJobTypeNone   AssociatedJobType = "none"
)

type FormResponse struct {
	ResponseID   string       `json:"response_id"`
	ProjectID    string       `json:"project_id"`
	ResponseType ResponseType `json:"response_type"`
	MongoObject  string       `json:"mongo_object"`
	Title        string       `json:"title"`
	Col          int          `json:"col"`
	Position     float64      `json:"position"`
	// Optional fields
	DiscussionID   *string  `json:"discussion_id"`
	AssigneeMember []string `json:"assignee_member,omitempty"`
	AssigneeClan   []string `json:"assignee_clan,omitempty"`
	UpdatedBy      *string  `json:"updated_by"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
