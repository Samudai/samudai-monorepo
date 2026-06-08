package point

import "time"

type Contract struct {
	PointID           string     `json:"point_id"`
	Name              string     `json:"name"`
	ContractAddress   string     `json:"contract_address"`
	Topic             []string   `json:"topic"`
	PointsNum         []int      `json:"points_num"`
	PerTokenPointsNum []int      `json:"pertoken_points_num"`
	Event             []string   `json:"event"`
	ChainId           string     `json:"chain_id"`
	CreatedAt         *time.Time `json:"created_at"`
	UpdatedAt         *time.Time `json:"updated_at"`
	AllEvents         string     `json:"all_events"`
	EventNftAddress   []string   `json:"event_nft_address"`
}

type UpdateContract struct {
	PointID           string     `json:"point_id"`
	ContractAddress   string     `json:"contract_address"`
	Topic             []string   `json:"topic"`
	PointsNum         []int      `json:"points_num"`
	PerTokenPointsNum []int      `json:"pertoken_points_num"`
	EventNftAddresses string     `json:"event_nft_address"`
	UpdatedAt         *time.Time `json:"updated_at"`
}

type Webhook struct {
	PointID         string `json:"point_id"`
	ContractAddress string `json:"contract_address"`
	WebhookID       string `json:"webhook_id"`
	IsActive        bool   `json:"is_active"`
}

type ContractView struct {
	PointID           string     `json:"point_id,omitempty"`
	Name              *string    `json:"name,omitempty"`
	ContractAddress   string     `json:"contract_address,omitempty"`
	Topic             string     `json:"topic"`
	PointsNum         int        `json:"points_num"`
	PerTokenPointsNum int        `json:"pertoken_points_num"`
	Event             *string    `json:"event"`
	ChainId           *string    `json:"chain_id,omitempty"`
	CreatedAt         *time.Time `json:"created_at,omitempty"`
	UpdatedAt         *time.Time `json:"updated_at,omitempty"`
	WebhookID         string     `json:"webhook_id,omitempty"`
	IsActive          bool       `json:"is_active,omitempty"`
	EventNftAddress   string     `json:"event_nft_address"`
	AllEvents         string     `json:"all_events,omitempty"`
}

type ContractGroup struct {
	ContractAddress string         `json:"contract_address"`
	Name            string         `json:"name"`
	ChainId         string         `json:"chain_id,omitempty"`
	Events          []ContractView `json:"events"`
	WebhookID       string         `json:"webhook_id"`
	IsActive        bool           `json:"is_active"`
	AllEvents       string         `json:"all_events"`
}
