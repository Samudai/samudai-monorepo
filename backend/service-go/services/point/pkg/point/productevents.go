package point

import "time"

type ProdcutEvents struct {
	ProductID string     `json:"product_id"`
	PointID   string     `json:"point_id"`
	PointsNum []float64  `json:"points_num"`
	EventName []string   `json:"event_name"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type UpdateProdcutEvents struct {
	ProductID string     `json:"product_id"`
	PointID   string     `json:"point_id"`
	EventName []string   `json:"event_name"`
	PointsNum []float64  `json:"points_num"`
	UpdatedAt *time.Time `json:"updated_at"`
}
