package point

import (
	"database/sql"
	"encoding/json"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

func CreateCustomProduct(CustomProduct point.CustomProduct) (string, error) {
	db := db.GetSQL()
	var productID string
	var err = db.QueryRow(`INSERT INTO custom_products (point_id, name, logo, description, whitelisted_origins) 
		VALUES ($1, $2, $3, $4, $5) RETURNING point_id`,
		CustomProduct.PointID, CustomProduct.Name, CustomProduct.Logo, CustomProduct.Description, pq.Array(CustomProduct.WhitelistedOrigins)).Scan(&productID)
	if err != nil {
		return productID, err
	}

	logger.LogMessage("info", "Added Product ID: %s", productID)
	return productID, nil
}

func UpdateCustomProduct(CustomProduct point.CustomProduct) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE custom_products SET name = $2, logo = $3, description = $4, 
	updated_at = CURRENT_TIMESTAMP WHERE product_id = $1`, CustomProduct.ProductID,
		CustomProduct.Name, CustomProduct.Logo, CustomProduct.Description)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated Product ID: %s", CustomProduct.ProductID)
	return nil
}

func GetProductByProductID(productID string) (point.CustomProduct, error) {
	db := db.GetSQL()
	var product point.CustomProduct
	err := db.QueryRow(`SELECT product_id, point_id, name, logo, description, is_active, whitelisted_origins, referral_points_num, same_referral_points_user_joining FROM custom_products WHERE product_id = $1`,
		productID).Scan(&product.ProductID, &product.PointID, &product.Name, &product.Logo, &product.Description, &product.IsActive, pq.Array(&product.WhitelistedOrigins), &product.ReferralPoints, &product.SamePoints)
	if err != nil {
		return product, err
	}

	return product, nil
}

func GetProductBypointID(pointID string) (point.CustomProductView, error) {
	db := db.GetSQL()
	var product point.CustomProductView
	var eventsJson *json.RawMessage
	err := db.QueryRow(`SELECT 
    cp.product_id, 
    cp.point_id, 
    cp.name, 
    cp.logo, 
    cp.description,
	cp.is_active,
	cp.referral_points_num,
	cp.same_referral_points_user_joining,
	cp.referral_is_active,
    COALESCE(json_object_agg(cpe.event_name, cpe.points_num) FILTER (WHERE cpe.event_name IS NOT NULL AND cpe.points_num IS NOT NULL), '{}'::json) AS events_json
FROM 
    custom_products cp
LEFT JOIN 
    custom_product_events cpe ON cp.product_id = cpe.product_id AND cp.point_id = cpe.point_id
WHERE 
    cp.point_id = $1
GROUP BY 
    cp.product_id, cp.point_id, cp.name, cp.logo, cp.description,cp.is_active,cp.referral_points_num,cp.referral_is_active,cp.same_referral_points_user_joining;`,
		pointID).Scan(&product.ProductID, &product.PointID, &product.Name, &product.Logo, &product.Description, &product.IsActive, &product.ReferralPoints, &product.SamePoints, &product.ReferralIsActive, &eventsJson)
	if err != nil {
		return product, err
	}

	if eventsJson != nil {
		err = json.Unmarshal(*eventsJson, &product.Events)
		if err != nil {
			return product, err
		}
	}

	return product, nil
}

func UpdateCustomProductStatus(productID string, status bool) error {
	db := db.GetSQL()

	_, err := db.Exec(`UPDATE custom_products SET is_active = $1 WHERE product_id =$2`, status, productID)
	if err != nil {
		return err
	}

	return nil
}
func AddandUpdateReferralPoints(pointID string, productID string, points float64, samePoints bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE custom_products SET referral_points_num = $3, same_referral_points_user_joining = $4  WHERE point_id = $1 AND product_id =$2`, pointID, productID, points, samePoints)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added Referral Points ID: %s", productID)
	return nil
}
func UpdateReferralStatus(pointID string, productID string, status bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE custom_products SET referral_is_active = $3 WHERE point_id = $1 AND product_id =$2`, pointID, productID, status)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added Referral Points ID: %s", productID)
	return nil
}

func RequestReferralCode(pointID string, productID string, uniqueUserID string) (string, error) {
	db := db.GetSQL()
	var referralCode string
	err := db.QueryRow(`SELECT referral_code FROM referral_members WHERE point_id = $1 AND product_id = $2 AND unique_user_id = $3`, pointID, productID, uniqueUserID).Scan(&referralCode)
	if err == sql.ErrNoRows {
		var err = db.QueryRow(`INSERT INTO referral_members (point_id,product_id,unique_user_id) VALUES ($1, $2, $3) RETURNING referral_code`,
			pointID, productID, uniqueUserID).Scan(&referralCode)
		if err != nil {
			return "", err
		}
	} else if err != nil {
		return "", err
	}

	logger.LogMessage("info", "Retrieved referral code for the unique user id: %s", uniqueUserID)
	return referralCode, nil
}
func VerifyReferralCode(product_id string, referralCode string, uniqueUserID string) (point.ReferralObject, error) {
	db := db.GetSQL()

	var referralObj point.ReferralObject
	err := db.QueryRow(`SELECT r.point_id, r.unique_user_id, r.product_id, cp.referral_points_num, cp.same_referral_points_user_joining, cp.referral_is_active, cp.whitelisted_origins
	 FROM referral_members r 
	 LEFT JOIN custom_products cp ON r.point_id = cp.point_id AND r.product_id = cp.product_id AND r.referral_code = $1 
	 WHERE r.product_id = $2`, referralCode, product_id).Scan(&referralObj.PointID, &referralObj.ReferrerUniqueUserId, &referralObj.ProductID, &referralObj.ReferralPoints, &referralObj.SamePoints, &referralObj.ReferralIsActive, pq.Array(&referralObj.WhitelistedOrigins))

	if err != nil {
		return point.ReferralObject{}, err
	}

	referralObj.ReferringUniqueUserId = uniqueUserID

	logger.LogMessage("info", "Retrieved referral object for referral code: %s", referralCode)
	return referralObj, nil
}

func UpdateUsersInvited(product_id string, uniqueUserID string, refreeUniqueUserId string) error {
	db := db.GetSQL()

	_, err := db.Exec(`UPDATE referral_members SET users_invited = users_invited + 1 , invited_user_ids = array_append(invited_user_ids, $3) WHERE product_id = $1 AND unique_user_id = $2`,
		product_id, uniqueUserID, refreeUniqueUserId)
	if err != nil {
		return err
	}

	return nil
}

func GetProductNameByProductID(productID string) (string, string, error) {
	db := db.GetSQL()
	var pointId string
	var productName string
	err := db.QueryRow(`SELECT point_id, name FROM custom_products WHERE product_id = $1`,
		productID).Scan(&pointId, &productName)
	if err != nil {
		return pointId, productName, err
	}

	return pointId, productName, nil
}
