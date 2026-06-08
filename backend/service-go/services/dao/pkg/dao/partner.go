package dao

import "time"

type Partner struct {
	DAOID        string `json:"dao_id"`
	DAOPartnerID string `json:"dao_partner_id"`
	Name         string `json:"name"`
	Logo         string `json:"logo"`
	Website      string `json:"website"`
	Email        string `json:"email"`
	Phone        string `json:"phone"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type PartnerSocial struct {
	ID           int    `json:"id"`
	DAOPartnerID string `json:"dao_partner_id"`
	Type         string `json:"type"`
	URL          string `json:"url"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
