package discussion

import (
	"encoding/json"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-discussion/pkg/discussion"
	"github.com/lib/pq"
)

func CreateMessage(message discussion.Message) (string, error) {
	db := db.GetSQL()
	var messageID string
	err := db.QueryRow(`INSERT INTO message (discussion_id, type, content, sender_id, attachment_link, metadata, parent_id, edited, all_tagged, tagged)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING message_id`, message.DiscussionID, message.Type, message.Content, message.SenderID, message.AttachmentLink, message.Metadata, 
		message.ParentID, message.Edited, message.AllTagged, pq.Array(message.Tagged)).Scan(&messageID)
	if err != nil {
		return messageID, err
	}

	return messageID, nil
}

func GetMessagesByDiscussionID(discussionID string, limit, offset *int) ([]discussion.MessageResponse, error) {
	db := db.GetSQL()
	var messages []discussion.MessageResponse
	rows, err := db.Query(`SELECT message_id, discussion_id, type, content, sender_id, sender, 
		attachment_link, metadata, created_at, updated_at, parent_message, edited, all_tagged, tagged
		FROM message_view WHERE discussion_id = $1::uuid
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, discussionID, limit, offset)
	if err != nil {
		return messages, err
	}
	defer rows.Close()

	for rows.Next() {
		var message discussion.MessageResponse
		var parentMessageJSON, senderJSON, taggedJSON *json.RawMessage
		err := rows.Scan(&message.MessageID, &message.DiscussionID, &message.Type, &message.Content, &message.SenderID, &senderJSON,
			&message.AttachmentLink, &message.Metadata, &message.CreatedAt, &message.UpdatedAt, &parentMessageJSON, &message.Edited,
			&message.AllTagged, &taggedJSON)
		if err != nil {
			return messages, err
		}

		if parentMessageJSON != nil {
			err = json.Unmarshal(*parentMessageJSON, &message.ParentMessage)
			if err != nil {
				return messages, err
			}
		}
		
		if senderJSON != nil {
			err = json.Unmarshal(*senderJSON, &message.Sender)
			if err != nil {
				return messages, err
			}
		}
		
		if taggedJSON != nil {
			err = json.Unmarshal(*taggedJSON, &message.Tagged)
			if err != nil {
				return messages, err
			}
		}

		messages = append(messages, message)
	}

	return messages, nil
}

func UpdateMessageContent(messageID string, content string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE message SET content = $2, edited = TRUE, updated_at = CURRENT_TIMESTAMP WHERE message_id = $1::uuid`, messageID, content)
	if err != nil {
		return err
	} 

	return nil
}

func DeleteMessage(messageID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM message WHERE message_id = $1::uuid`, messageID)
	if err != nil {
		return err
	}

	return nil
}