package discussion

import (
	"database/sql"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discussion/pkg/discussion"
)

func AddParticipant(participant discussion.Participant) (int, error) {
	db := db.GetSQL()

	var id int
	err := db.QueryRow(`SELECT id FROM participant WHERE discussion_id = $1::uuid AND member_id = $2::uuid`, participant.DiscussionID, participant.MemberID).Scan(&id)
	if err != nil {
		if err != sql.ErrNoRows {
			return id, err
		}
	}

	if id == 0 {
		err := db.QueryRow(`INSERT INTO participant (discussion_id, member_id) 
			VALUES ($1::uuid, $2::uuid) RETURNING id`, participant.DiscussionID, participant.MemberID).Scan(&id)
		if err != nil {
			return id, err
		}
	}

	return id, nil
}

func AddParticipants(participants []discussion.Participant) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	stmt, err := tx.Prepare(`
	INSERT INTO participant (discussion_id, member_id) 
	VALUES ($1, $2)
	ON CONFLICT DO NOTHING`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Iterate over participants and execute the prepared statement
	for _, participant := range participants {
		if _, err := stmt.Exec(participant.DiscussionID, participant.MemberID); err != nil {
			tx.Rollback()
			return err
		}
	}
	
	// Commit the SQL transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func RemoveParticipant(participant discussion.Participant) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM participant WHERE discussion_id = $1 AND member_id = $2`, participant.DiscussionID, participant.MemberID)
	if err != nil {
		return err
	}

	return nil
}

func IsParticipant(discussionID string, memberID string) (bool, error) {
	db := db.GetSQL()
	var id *int
	err := db.QueryRow(`SELECT id FROM participant WHERE discussion_id = $1::uuid AND member_id = $2::uuid`, discussionID, memberID).Scan(&id)
	if err != nil {
		logger.LogMessage("error", err.Error())
		return false, nil
	}

	return id != nil, nil
}

func GetParticipantsByDiscussionID(discussionID string) ([]discussion.Participant, error) {
	db := db.GetSQL()
	var participants []discussion.Participant
	rows, err := db.Query(`SELECT id, discussion_id, member_id FROM participant WHERE discussion_id = $1`, discussionID)
	if err != nil {
		return participants, err
	}
	defer rows.Close()

	for rows.Next() {
		var participant discussion.Participant
		err := rows.Scan(&participant.ID, &participant.DiscussionID, &participant.MemberID)
		if err != nil {
			return participants, err
		}
		participants = append(participants, participant)
	}

	return participants, nil
}
