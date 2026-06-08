package point

import "time"

type CustomProduct struct {
	ProductID          string   `json:"product_id"`
	PointID            string   `json:"point_id"`
	Name               string   `json:"name"`
	Logo               string   `json:"logo"`
	Description        string   `json:"description"`
	WhitelistedOrigins []string `json:"whitelisted_origins"`
	IsActive           bool     `json:"is_active"`
	ReferralPoints     float64  `json:"referral_points_num"`
	SamePoints         bool     `json:"same_referral_points_user_joining"`
	ReferralIsActive   bool     `json:"referral_is_active"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

type CustomProductView struct {
	ProductID          string   `json:"product_id"`
	PointID            string   `json:"point_id"`
	Name               string   `json:"name"`
	Logo               string   `json:"logo"`
	Description        string   `json:"description"`
	WhitelistedOrigins []string `json:"whitelisted_origins,omitempty"`
	IsActive           bool     `json:"is_active"`
	ReferralPoints     float64  `json:"referral_points_num"`
	SamePoints         bool     `json:"same_referral_points_user_joining"`
	ReferralIsActive   bool     `json:"referral_is_active"`

	Events map[string]float64 `json:"events"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

type ReferralObject struct {
	ProductID             string   `json:"product_id"`
	PointID               string   `json:"point_id"`
	ReferralPoints        float64  `json:"referral_points_num"`
	SamePoints            bool     `json:"same_referral_points_user_joining"`
	ReferrerUniqueUserId  string   `json:"referrer_unique_user_id"`
	ReferringUniqueUserId string   `json:"referring_unique_user_id"`
	ReferralIsActive      bool     `json:"referral_is_active"`
	WhitelistedOrigins    []string `json:"whitelisted_origins"`
}

type ReferralPointsParam struct {
	PointID        string  `json:"point_id"`
	ProductID      string  `json:"product_id"`
	ReferralPoints float64 `json:"referral_points_num"`
	SamePoints     bool    `json:"same_referral_points_user_joining"`
}
type ReferralStatusParam struct {
	PointID   string `json:"point_id"`
	ProductID string `json:"product_id"`
	Status    bool   `json:"status"`
}
