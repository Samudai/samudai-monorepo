package dao

import "time"

// AccessType represents the type of access a DAO has to a member.
type AccessType string

const (
	AccessTypeHidden        	AccessType = "hidden"
	AccessTypeView          	AccessType = "view"
	AccessTypeManageProject 	AccessType = "manage_project"
	AccessTypeManageDAO     	AccessType = "manage_dao"
	AccessTypeManagePayment     AccessType = "manage_payment"
	AccessTypeManageJob    	 	AccessType = "manage_job"
	AccessTypeManageForum 	 	AccessType = "manage_forum"
)

// Access represents a permission for a user to access a DAO.
type Access struct {
	AccessID string     `json:"id"`
	DAOID    string     `json:"dao_id"`
	Access   AccessType `json:"access"`
	Members  []string   `json:"members"`
	Roles    []string   `json:"roles"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
