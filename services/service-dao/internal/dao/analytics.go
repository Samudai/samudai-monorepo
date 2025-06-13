package dao

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-dao/pkg/dao"
)

func AddAnalytics(data dao.Analytics) error {
	db := db.GetSQL()
	fmt.Println("data", data)
	_, err := db.Exec(`INSERT INTO analytics (dao_id, member_id, visitor_ip) 
		VALUES ($1::uuid, $2::uuid, $3)`, data.DAOID, data.MemberID, data.VisitorIP)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added analytics for DAO ID: %s", data.DAOID)
	return nil
}

func ListAnalyticsForDAO(daoID string) ([]dao.DataPoint, error) {
	db := db.GetSQL()
	var dataPoint []dao.DataPoint
	rows, err := db.Query(` SELECT tmp.date,
    	COALESCE(t.value, 0::bigint) AS value
		FROM ( SELECT a."time"::date AS date,
					count(a.visitor_ip) AS value
				FROM analytics a
				WHERE a.dao_id = $1::uuid AND a."time"::date > (CURRENT_DATE - '365 days'::interval day)
				GROUP BY (a."time"::date)) t
			RIGHT JOIN ( SELECT generate_series((now() - '365 days'::interval day)::date::timestamp with time zone, now()::date::timestamp with time zone, '1 day'::interval)::date AS date) tmp ON tmp.date = t.date
			ORDER BY tmp.date DESC`, daoID)
	if err != nil {
		return dataPoint, err
	}

	defer rows.Close()

	for rows.Next() {
		var data dao.DataPoint
		err := rows.Scan(&data.Date, &data.Value)
		if err != nil {
			return dataPoint, err
		}

		dataPoint = append(dataPoint, data)
	}

	return dataPoint, nil
}
