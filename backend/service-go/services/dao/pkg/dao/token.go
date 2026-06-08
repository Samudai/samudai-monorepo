package dao

import "time"

type Token struct {
	ID              int    `json:"id"`
	DAOID           string `json:"dao_id"`
	Ticker          string `json:"ticker"`
	ContractAddress string `json:"contract_address"`
	AverageTimeHeld string `json:"average_time_held"`
	Holders         int    `json:"holders"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
