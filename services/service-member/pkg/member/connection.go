package member

import "time"

// ConnectionRequest represents a connection between two members.
type ConnectionRequest struct {
	ID         int          `json:"id"`
	SenderID   string       `json:"sender_id"`
	ReceiverID string       `json:"receiver_id"`
	Status     InviteStatus `json:"status"`
	Message    string       `json:"message"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type Connection struct {
	Member
	ID         int          `json:"id"`
	SenderID   string       `json:"sender_id,omitempty"`
	ReceiverID string       `json:"receiver_id,omitempty"`
	Status     InviteStatus `json:"status"`
	Message    string       `json:"message"`
}
