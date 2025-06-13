package member

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discovery/pkg/discovery"
	"github.com/Samudai/service-discovery/pkg/member"
)

func CreateMemberProjectEvent(event member.MemberEvent) error {
	db := db.GetSQL()
	_, err := db.Exec("INSERT INTO member_events (member_id, dao_id, event_context, event_type) VALUES ($1, $2, $3, $4)", event.MemberID, event.DAOID, event.EventContext, event.EventType)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Member task event created")
	return nil
}

func DiscoverMember(limit, offset *int) ([]discovery.DiscoverMemberResponse, error) {
	db := db.GetSQL()
	var members []discovery.DiscoverMemberResponse
	rows, err := db.Query(`SELECT member_id,
		COALESCE(SUM(CASE event_type WHEN 'task_assigned' THEN 1 WHEN 'task_unassigned' THEN -1 WHEN 'task_completed' THEN -1 END), 0) AS task_ongoing, 
		COALESCE(SUM(CASE event_type WHEN 'task_completed' THEN 1 ELSE 0 END), 0) AS task_completed
		FROM member_events 
		GROUP BY member_id
		ORDER BY task_ongoing DESC
		LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var event discovery.DiscoverMemberResponse
		err := rows.Scan(&event.MemberID, &event.TasksOngoing, &event.TasksCompleted)
		if err != nil {
			return nil, err
		}

		members = append(members, event)
	}

	return members, nil
}
