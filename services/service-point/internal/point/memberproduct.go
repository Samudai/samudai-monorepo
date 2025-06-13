package point

import (
	"database/sql"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-point/pkg/point"
)

func CreateProductMember(member point.ProductMember) error {
	db := db.GetSQL()
	_, err := db.Exec(`
		INSERT INTO custom_product_members (point_id, member_id, product_id, unique_user_id) 
		VALUES ($1, $2::uuid, $3::uuid, $4) 
		ON CONFLICT (product_id, member_id) DO NOTHING`,
		member.PointID, member.MemberID, member.ProductID, member.UniqueUserID)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	logger.LogMessage("info", "Added Member Point ID: %s to Product ID: %s", member.MemberID, member.ProductID)

	return nil
}

func FetchProductMemberId(uniqueUserID string) (string, error) {
	db := db.GetSQL()
	var memberId string
	err := db.QueryRow(`SELECT member_id FROM custom_product_members WHERE unique_user_id = $1`,
		uniqueUserID).Scan(&memberId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		}
		return memberId, err
	}

	return memberId, nil
}
