package job

import (
	"encoding/json"
	"time"
)

type PayoutStatusType string

const (
	PayoutStatusTypeUnassigned       PayoutStatusType = "unassigned"
	PayoutStatusTypeMTP              PayoutStatusType = "moved_to_project"
	PayoutStatusTypePaymentInitiated PayoutStatusType = "payment_initiated"
	PayoutStatusTypeCompleted        PayoutStatusType = "completed"
)

// Favourite is struct for favourite
type Favourite struct {
	FavouriteID string     `json:"favourite_id"`
	MemberID    string     `json:"member_id"`
	JobID       string     `json:"job_id"`
	CreatedAt   *time.Time `json:"created_at"`
}

// Favourite Bounty is struct for favourite bounty
type FavouriteBounty struct {
	FavouriteID string     `json:"favourite_id"`
	MemberID    string     `json:"member_id"`
	BountyID    string     `json:"bounty_id"`
	CreatedAt   *time.Time `json:"created_at"`
}

// Payout is struct for Payout
type Payout struct {
	PayoutID        string           `json:"payout_id"`
	LinkType        string           `json:"link_type"`
	LinkID          string           `json:"link_id"`
	Name            string           `json:"name"`
	MemberID        *string          `json:"member_id"`
	ProviderID      string           `json:"provider_id"`
	ReceiverAddress string           `json:"receiver_address"`
	PayoutAmount    float64          `json:"payout_amount"`
	PayoutCurrency  *PayoutCurrency  `json:"payout_currency"`
	TokenAddress    *string          `json:"token_address"`
	Completed       bool             `json:"completed"`
	Status          PayoutStatusType `json:"status"`
	Rank            int              `json:"rank"`
	InitiatedBy     *string          `json:"initiated_by"`
	CreatedAt       *time.Time       `json:"created_at"`
	UpdatedAt       *time.Time       `json:"updated_at"`
}

type PayoutCurrency struct {
	TokenAddress string  `json:"token_address"`
	Symbol       string  `json:"symbol"`
	Name         string  `json:"name"`
	Decimals     float64 `json:"decimals"`
	LogoUri      string  `json:"logo_uri"`
}

type PendingPayout struct {
	PayoutID        string           `json:"payout_id"`
	DAOID           string           `json:"dao_id"`
	LinkType        string           `json:"link_type"`
	LinkID          string           `json:"link_id"`
	Name            string           `json:"name"`
	MemberID        *string          `json:"member_id"`
	Provider        Provider         `json:"provider"`
	ReceiverAddress string           `json:"receiver_address"`
	PayoutAmount    float64          `json:"payout_amount"`
	PayoutCurrency  *PayoutCurrency  `json:"payout_currency"`
	TokenAddress    *string          `json:"token_address"`
	Completed       bool             `json:"completed"`
	Status          PayoutStatusType `json:"status"`
	Rank            int              `json:"rank"`
	InitiatedBy     IMember          `json:"initiated_by"`
	CreatedAt       *time.Time       `json:"created_at"`
	UpdatedAt       *time.Time       `json:"updated_at"`
}

type Provider struct {
	ID           int    `json:"id"`
	ProviderID   string `json:"provider_id"`
	DAOID        string `json:"dao_id"`
	ProviderType string `json:"provider_type"`
	Address      string `json:"address"`
	CreatedBy    string `json:"created_by"`
	ChainID      int    `json:"chain_id"`
	IsDefault    bool   `json:"is_default"`
	Name         string `json:"name"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

// JobFile is the structure of attachment for a job
type JobFile struct {
	JobFileID string           `json:"job_file_id"`
	JobID     string           `json:"job_id"`
	Name      string           `json:"name"`
	URL       string           `json:"url"`
	Metadata  *json.RawMessage `json:"metadata"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

// BountyFile is the structure of attachment for a bounty
type BountyFile struct {
	BountyFileID string           `json:"bounty_file_id"`
	BountyID     string           `json:"bounty_id"`
	Name         string           `json:"name"`
	URL          string           `json:"url"`
	Metadata     *json.RawMessage `json:"metadata"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type JobFileResponse struct {
	JobFileID string           `json:"job_file_id"`
	Name      string           `json:"name"`
	URL       string           `json:"url"`
	Metadata  *json.RawMessage `json:"metadata"`

	CreatedAt string `json:"created_at"`
}

type BountyFileResponse struct {
	BountyFileID string           `json:"bounty_file_id"`
	Name         string           `json:"name"`
	URL          string           `json:"url"`
	Metadata     *json.RawMessage `json:"metadata"`

	CreatedAt string `json:"created_at"`
}
