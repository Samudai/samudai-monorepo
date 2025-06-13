package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discovery/pkg/dao"
	"github.com/Samudai/service-discovery/pkg/discovery"
)

func CreateDAOProjectEvent(event dao.DAOEvent) error {
	db := db.GetSQL()
	_, err := db.Exec("INSERT INTO dao_events (dao_id, event_context, event_type) VALUES ($1, $2, $3)", event.DAOID, event.EventContext, event.EventType)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "DAO project event created")
	return nil
}

func DiscoverDAO(limit, offset *int) ([]discovery.DiscoverDAOResponse, error) {
	db := db.GetSQL()
	var daos []discovery.DiscoverDAOResponse
	rows, err := db.Query(`SELECT dao_id,
		COALESCE(SUM(CASE event_type WHEN 'project_created' THEN 1 WHEN 'project_completed' THEN -1 WHEN 'project_deleted' THEN -1 END), 0) AS project_ongoing, 
		COALESCE(SUM(CASE event_type WHEN 'project_completed' THEN 1 ELSE 0 END), 0) AS project_completed
		FROM dao_events 
		GROUP BY dao_id
		ORDER BY project_ongoing DESC
		LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var event discovery.DiscoverDAOResponse
		err := rows.Scan(&event.DAOID, &event.ProjectsOngoing, &event.ProjectsCompleted)
		if err != nil {
			return nil, err
		}

		daos = append(daos, event)
	}

	return daos, nil
}
