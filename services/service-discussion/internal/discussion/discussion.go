package discussion

import (
	"database/sql"
	"encoding/json"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discussion/pkg/discussion"
	"github.com/lib/pq"
)

func CreateDiscussion(discussion discussion.Discussion) (string, error) {
	db := db.GetSQL()
	var discussionID string
	err := db.QueryRow(`INSERT INTO discussion (dao_id, topic, description, description_raw, created_by, category, 
		category_id, closed, proposal_id, tags, pinned, visibility, updated_at) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP) 
		RETURNING discussion_id`, discussion.DAOID, discussion.Topic, discussion.Description, discussion.DescriptionRaw, discussion.CreatedBy, discussion.Category,
		discussion.CategoryID, discussion.Closed, discussion.ProposalID, pq.Array(discussion.Tags), discussion.Pinned, discussion.Visibility).Scan(&discussionID)
	if err != nil {
		return discussionID, err
	}

	return discussionID, nil
}

func UpdateDiscussion(discussion discussion.Discussion) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE discussion SET topic = $2, description = $3, category = $4, category_id = $5, 
		closed = $6, updated_by = $7, updated_at = CURRENT_TIMESTAMP, tags = $8, pinned = $9, last_comment_at = CURRENT_TIMESTAMP, description_raw = $10, visibility = $11
		WHERE discussion_id = $1`, discussion.DiscussionID, discussion.Topic, discussion.Description, discussion.Category, discussion.CategoryID,
		discussion.Closed, discussion.UpdatedBy, pq.Array(discussion.Tags), discussion.Pinned, discussion.DescriptionRaw, discussion.Visibility)
	if err != nil {
		return err
	}

	return nil
}

func UpdateBookmark(discussion discussion.UpdateBookmarkParams) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE discussion SET pinned = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
		WHERE discussion_id = $1`, discussion.DiscussionID, discussion.Pinned, discussion.UpdatedBy)
	if err != nil {
		return err
	}

	return nil
}

func UpdateView(discussionID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE discussion SET views = views + 1 WHERE discussion_id = $1`, discussionID)
	if err != nil {
		return err
	}

	return nil
}

func GetDiscussionByID(discussionID string) (discussion.Discussion, error) {
	db := db.GetSQL()
	var Discussion discussion.Discussion
	err := db.QueryRow(`SELECT discussion_id, dao_id, topic, description, created_by,
		created_at, updated_by, updated_at, category, category_id, 
		closed, proposal_id, tags, pinned, last_comment_at, description_raw, views, visibility
		FROM discussion 
		WHERE discussion_id = $1`, discussionID).Scan(&Discussion.DiscussionID, &Discussion.DAOID, &Discussion.Topic, &Discussion.Description, &Discussion.CreatedBy,
		&Discussion.CreatedAt, &Discussion.UpdatedBy, &Discussion.UpdatedAt, &Discussion.Category, &Discussion.CategoryID,
		&Discussion.Closed, &Discussion.ProposalID, pq.Array(&Discussion.Tags), &Discussion.Pinned, &Discussion.LastCommentAt,
		&Discussion.DescriptionRaw, &Discussion.Views, &Discussion.Visibility)
	if err != nil {
		return Discussion, err
	}

	return Discussion, nil
}

func GetTagsByDAOID(daoID string) ([]string, error) {
	db := db.GetSQL()
	var Tags []string
	err := db.QueryRow(`SELECT array_agg(DISTINCT tag) AS unique_tags
	FROM (
	  SELECT unnest(tags) AS tag
	  FROM discussion
	  WHERE dao_id = $1
	) t;
	`, daoID).Scan(pq.Array(&Tags))
	if err != nil {
		return Tags, err
	}

	return Tags, nil
}

func GetDiscussionsByDAOID(daoID string, empty bool, limit, offset *int) ([]discussion.DiscussionResponse, error) {
	db := db.GetSQL()
	var discussions []discussion.DiscussionResponse
	rows, err := db.Query(`SELECT discussion_id, dao_id, topic, description, created_by, 
		updated_by, category, category_id, closed, created_at, 
		updated_at, participant_count, participants, messages, proposal_id, tags, pinned, last_comment_at, views, message_count, visibility
		FROM discussion_view WHERE dao_id = $1::uuid
		AND CASE WHEN $2 THEN messages::text <> '[]'::text ELSE true END
		ORDER BY last_comment_at DESC
		LIMIT $3 OFFSET $4`, daoID, empty, limit, offset)
	if err != nil {
		return discussions, err
	}
	defer rows.Close()

	for rows.Next() {
		var messages, participants, created_by *json.RawMessage
		var Discussion discussion.DiscussionResponse
		err := rows.Scan(&Discussion.DiscussionID, &Discussion.DAOID, &Discussion.Topic, &Discussion.Description, &created_by,
			&Discussion.UpdatedBy, &Discussion.Category, &Discussion.CategoryID, &Discussion.Closed, &Discussion.CreatedAt,
			&Discussion.UpdatedAt, &Discussion.ParticipantCount, &participants, &messages, &Discussion.ProposalID, pq.Array(&Discussion.Tags), &Discussion.Pinned, &Discussion.LastCommentAt,
			&Discussion.Views, &Discussion.MessageCount, &Discussion.Visibility)
		if err != nil {
			return discussions, err
		}
		if messages != nil {
			err = json.Unmarshal(*messages, &Discussion.Messages)
			if err != nil {
				return discussions, err
			}
		}
		if participants != nil {
			err = json.Unmarshal(*participants, &Discussion.Participants)
			if err != nil {
				return discussions, err
			}
		}
		if created_by != nil {
			err = json.Unmarshal(*created_by, &Discussion.CreatedBy)
			if err != nil {
				return discussions, err
			}
		}

		discussions = append(discussions, Discussion)
	}

	return discussions, nil
}

func GetDiscussionsCountByDAOID(daoId string) (int, error) {
	db := db.GetSQL()

	var Count int
	err := db.QueryRow(`SELECT COUNT(*) FROM discussion_view WHERE dao_id = $1`, daoId).Scan(&Count)
	if err != nil {
		return Count, err
	}

	return Count, nil
}

func GetDiscussionsByProposalID(proposalID string) (*discussion.Discussion, error) {
	db := db.GetSQL()
	var Discussion discussion.Discussion
	logger.LogMessage("info", "proposalID %s", proposalID)
	err := db.QueryRow(`SELECT discussion_id, dao_id, topic, description, created_by,
		created_at, updated_by, updated_at, category, category_id, 
		closed, proposal_id, tags, pinned, last_comment_at, views, visibility
		FROM discussion WHERE proposal_id = $1`,
		proposalID).Scan(&Discussion.DiscussionID, &Discussion.DAOID, &Discussion.Topic, &Discussion.Description, &Discussion.CreatedBy,
		&Discussion.CreatedAt, &Discussion.UpdatedBy, &Discussion.UpdatedAt, &Discussion.Category, &Discussion.CategoryID,
		&Discussion.Closed, &Discussion.ProposalID, pq.Array(&Discussion.Tags), &Discussion.Pinned, &Discussion.LastCommentAt,
		&Discussion.Views, &Discussion.Visibility)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &Discussion, nil
}

func GetDiscussionsByMemberID(memberID, daoID string, limit, offset *int) ([]discussion.DiscussionResponse, error) {
	db := db.GetSQL()
	var discussions []discussion.DiscussionResponse
	rows, err := db.Query(`WITH opted_in_cte AS (
		SELECT dw.discussion_id,
			   COALESCE((SELECT true AS bool
						  FROM participant p
						  WHERE p.discussion_id = dw.discussion_id AND p.member_id = $1::uuid LIMIT 1), false) AS opted_in
		FROM discussion_view dw
		WHERE dw.dao_id = $2::uuid
	)
	
	SELECT dw.discussion_id, dao_id, topic, description, created_by, 
			updated_by, category, category_id, closed, dw.created_at, 
			dw.updated_at, participant_count, participants, messages, proposal_id, tags, pinned, last_comment_at, views, message_count, visibility, oi.opted_in
	FROM discussion_view dw
	JOIN opted_in_cte oi ON dw.discussion_id = oi.discussion_id
	WHERE visibility != 'private' OR (visibility = 'private' AND oi.opted_in = true)
	ORDER BY created_at DESC
	LIMIT $3 OFFSET $4;`, memberID, daoID, limit, offset)
	if err != nil {
		return discussions, err
	}
	defer rows.Close()

	for rows.Next() {
		var messages, participants, created_by *json.RawMessage
		var Discussion discussion.DiscussionResponse
		err := rows.Scan(&Discussion.DiscussionID, &Discussion.DAOID, &Discussion.Topic, &Discussion.Description, &created_by,
			&Discussion.UpdatedBy, &Discussion.Category, &Discussion.CategoryID, &Discussion.Closed, &Discussion.CreatedAt,
			&Discussion.UpdatedAt, &Discussion.ParticipantCount, &participants, &messages, &Discussion.ProposalID, pq.Array(&Discussion.Tags),
			&Discussion.Pinned, &Discussion.LastCommentAt, &Discussion.Views, &Discussion.MessageCount, &Discussion.Visibility, &Discussion.OptedIn)
		if err != nil {
			return discussions, err
		}
		if messages != nil {
			err = json.Unmarshal(*messages, &Discussion.Messages)
			if err != nil {
				return discussions, err
			}
		}
		if participants != nil {
			err = json.Unmarshal(*participants, &Discussion.Participants)
			if err != nil {
				return discussions, err
			}
		}
		if created_by != nil {
			err = json.Unmarshal(*created_by, &Discussion.CreatedBy)
			if err != nil {
				return discussions, err
			}
		}

		discussions = append(discussions, Discussion)
	}

	return discussions, nil
}

func GetActiveForum(daoID string) ([]discussion.DataPoint, error) {
	db := db.GetSQL()
	var dataPoints []discussion.DataPoint

	rows, err := db.Query(`
		SELECT
		tmp.date,
		SUM(COALESCE(total_forum.value, 0)) OVER (ORDER BY tmp.date) AS value
	FROM (
		SELECT generate_series(
				(NOW() - INTERVAL '1 YEAR')::date,
				NOW()::date,
				'1 day'::interval
			) AS date
	) tmp
	LEFT JOIN (
		SELECT
			date_trunc('day', dis.created_at) AS date,
			count(*) AS value
		FROM discussion dis
		WHERE dis.dao_id = $1 AND dis.closed = false AND dis.created_at >= NOW() - INTERVAL '1 YEAR'
		GROUP BY date_trunc('day', dis.created_at)
	) total_forum ON tmp.date = total_forum.date
	ORDER BY tmp.date DESC;
	`, daoID)
	if err != nil {
		return dataPoints, err
	}

	defer rows.Close()

	for rows.Next() {
		var data discussion.DataPoint
		err := rows.Scan(&data.Date, &data.Value)
		if err != nil {
			return dataPoints, err
		}

		dataPoints = append(dataPoints, data)
	}

	return dataPoints, nil
}

func CloseDiscussion(discussionID string, closed bool, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE discussion SET closed = $2, updated_by = $3, closed_on = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
		WHERE discussion_id = $1::uuid`, discussionID, closed, updatedBy)
	if err != nil {
		return err
	}

	return nil
}
