package point

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-point/pkg/point"
)

func AddProdcutEvents(params point.ProdcutEvents) error {
	db := db.GetSQL()
	for i := 0; i < len(params.EventName); i++ {
		_, err := db.Exec(`INSERT INTO custom_product_events (product_id, point_id, event_name, points_num) VALUES ($1, $2::uuid, $3, $4)`,
			params.ProductID, params.PointID, params.EventName[i], params.PointsNum[i])
		if err != nil {
			return fmt.Errorf("failed to add product events: %w", err)
		}
	}
	return nil
}

func UpdateProdcutEvents(params point.ProdcutEvents) error {
	db := db.GetSQL()
	for i := 0; i < len(params.EventName); i++ {
		updateResult, err := db.Exec(`UPDATE custom_product_events SET points_num = $3, updated_at = CURRENT_TIMESTAMP WHERE 
        product_id = $1 AND event_name = $2`, params.ProductID, params.EventName[i], params.PointsNum[i])
		if err != nil {
			return fmt.Errorf("failed to update product events: %w", err)
		}

		rowsAffected, err := updateResult.RowsAffected()
		if err != nil {
			return fmt.Errorf("failed to check rows affected: %w", err)
		}

		if rowsAffected == 0 {
			_, err := db.Exec(`INSERT INTO custom_product_events (product_id, point_id, event_name, points_num) VALUES ($1, $2::uuid, $3, $4)`,
				params.ProductID, params.PointID, params.EventName[i], params.PointsNum[i])
			if err != nil {
				return fmt.Errorf("failed to add product events: %w", err)
			}
		}
	}
	return nil
}

func UpdateProdcutEventsPoint(params point.UpdateProdcutEvents) error {
	db := db.GetSQL()
	for i := 0; i < len(params.EventName); i++ {
		_, err := db.Exec(`UPDATE custom_product_events SET points_num = $3, updated_at = CURRENT_TIMESTAMP WHERE 
        product_id = $1 AND event_name = $2`, params.ProductID,
			params.EventName[i], params.PointsNum[i])
		if err != nil {
			return fmt.Errorf("failed to update contract: %w", err)
		}
	}
	return nil
}

func DeleteProdcutEvents(pointID string, ProductID string, eventName string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM custom_product_events WHERE point_id = $1::uuid AND product_id = $2 AND event_name =$3`,
		pointID, ProductID, eventName)
	if err != nil {
		return fmt.Errorf("failed to delete contract: %w", err)
	}

	return nil
}

func FetchPointsOnProductEvent(eventname, product_id string) (string, float64, string, error) {
	db := db.GetSQL()
	var PointsNum float64
	var pointId string
	var productName string
	err := db.QueryRow(`SELECT cpe.point_id, cpe.points_num, cp.name FROM custom_product_events cpe LEFT JOIN custom_products cp ON cp.product_id = cpe.product_id WHERE cpe.product_id = $1 AND cpe.event_name = $2`,
		product_id, eventname).Scan(&pointId, &PointsNum, &productName)
	if err != nil {
		return pointId, PointsNum, productName, err
	}

	return pointId, PointsNum, productName, nil
}
