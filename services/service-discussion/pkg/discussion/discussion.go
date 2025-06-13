package discussion

import (
	"encoding/json"
	"time"
)

type DiscussionCategory string
type VisibilityType string

const (
	DiscussionCategoryProposal   DiscussionCategory = "proposal"
	DiscussionCategoryProject    DiscussionCategory = "project"
	DiscussionCategoryInvestment DiscussionCategory = "investment"
	DiscussionCategoryCommunity  DiscussionCategory = "community"
)

const (
	VisibilityTypePublic   VisibilityType = "public"
	VisibilityTypePrivate  VisibilityType = "private"
)

type Discussion struct {
	DiscussionID string             `json:"discussion_id"`
	DAOID        string             `json:"dao_id"`
	Topic        string             `json:"topic"`
	Description  *string            `json:"description"`
	DescriptionRaw  *string         `json:"description_raw"`
	CreatedBy    *string            `json:"created_by"`
	UpdatedBy    *string            `json:"updated_by"`
	Category     DiscussionCategory `json:"category"`
	CategoryID   *string            `json:"category_id"`
	Closed       bool               `json:"closed"`
	ClosedOn     *time.Time         `json:"closed_on"`
	Pinned       bool               `json:"pinned"` 
	Tags         []string			`json:"tags"`
	LastCommentAt *time.Time        `json:"last_comment_at"`
	Views		 int				`json:"views"`
	Visibility   VisibilityType 	`json:"visibility"`

	ProposalID *string `json:"proposal_id"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type UpdateBookmarkParams struct {
	DiscussionID string `json:"discussion_id"`
	Pinned bool `json:"pinned"`
	UpdatedBy string `json:"updated_by"`
}

type MessageType string

const (
	MessageTypeText MessageType = "text"
	MessageTypeFile MessageType = "file"
)

type Message struct {
	MessageID      string           `json:"message_id"`
	DiscussionID   string           `json:"discussion_id"`
	Type           MessageType      `json:"type"`
	Content        *string          `json:"content"`
	SenderID       string           `json:"sender_id"`
	AttachmentLink *string          `json:"attachment_link"`
	Metadata       *json.RawMessage `json:"metadata"`
	ParentID       *string 			`json:"parent_id"`
	Edited         bool 			`json:"edited"`
	AllTagged      bool 			`json:"all_tagged"`
	Tagged		   []string			`json:"tagged"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type MessageResponse struct {
	MessageID      string           `json:"message_id"`
	DiscussionID   string           `json:"discussion_id"`
	Type           MessageType      `json:"type"`
	Content        *string          `json:"content"`
	SenderID       string           `json:"sender_id"`
	Sender         IMember          `json:"sender"`
	AttachmentLink *string          `json:"attachment_link"`
	Metadata       *json.RawMessage `json:"metadata"`
	Edited         bool 			`json:"edited"`
	ParentMessage  ParentMessage 	`json:"parent_message"`
	AllTagged      bool 			`json:"all_tagged"`
	Tagged		   []IMember		`json:"tagged"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

func (m *Message) UnmarshalJSON(data []byte) error {
	type Alias Message
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

type ParentMessage struct {
	MessageID      string           `json:"message_id"`
	DiscussionID   string           `json:"discussion_id"`
	Type           MessageType      `json:"type"`
	Content        *string          `json:"content"`
	Sender         IMember          `json:"sender"`
	AttachmentLink *string          `json:"attachment_link"`
	Metadata       *json.RawMessage `json:"metadata"`

}

type Participant struct {
	ID           int    `json:"id"`
	DiscussionID string `json:"discussion_id"`
	MemberID     string `json:"member_id"`

	CreatedAt *time.Time `json:"created_at"`
}

type DataPoint struct {
	Date  string `json:"date"`
	Value int    `json:"value"`
}