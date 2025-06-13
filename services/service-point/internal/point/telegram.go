package point

import (
	"database/sql"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-point/pkg/point"
)

func AddTelegramForMember(telegramInfo point.Telegram) error {
	db := db.GetSQL()

	result, err := db.Exec(`UPDATE telegram SET chat_id = $2, username = $3, first_name = $4, last_name = $5 WHERE otp = $1`,
		telegramInfo.OTP, telegramInfo.ChatID, telegramInfo.Username, telegramInfo.FirstName, telegramInfo.LastName)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("No rows found for the specified otp")
	}

	return nil
}

func CreateOrUpdateOTP(pointId *string, memberId string, otp string, chatType string) (string, error) {
	db := db.GetSQL()
	var telegramID string

	var existingTelegramID string
	if pointId == nil {
		err := db.QueryRow(`SELECT telegram_id FROM telegram WHERE member_id = $1 AND chat_type = $2`, memberId, chatType).Scan(&existingTelegramID)

		if err == sql.ErrNoRows {
			err = db.QueryRow(`INSERT INTO telegram (member_id, otp, chat_type) VALUES ($1::uuid, $2, $3) RETURNING 
			telegram_id`, memberId, otp, chatType).Scan(&telegramID)
			if err != nil {
				return telegramID, err
			}
		} else if err != nil {
			return telegramID, err
		} else {
			_, err = db.Exec(`UPDATE telegram SET otp = $1 WHERE member_id = $2 AND chat_type = $3`, otp, memberId, chatType)
			if err != nil {
				return telegramID, err
			}
			telegramID = existingTelegramID
		}
	} else {
		err := db.QueryRow(`SELECT telegram_id FROM telegram WHERE member_id = $1 AND point_id = $2 AND chat_type = $3`, memberId, pointId, chatType).Scan(&existingTelegramID)

		if err == sql.ErrNoRows {
			err = db.QueryRow(`INSERT INTO telegram (point_id, member_id, otp, chat_type) VALUES ($1::uuid, $2::uuid, $3, $4) RETURNING 
			telegram_id`, pointId, memberId, otp, chatType).Scan(&telegramID)
			if err != nil {
				return telegramID, err
			}
		} else if err != nil {
			return telegramID, err
		} else {
			_, err = db.Exec(`UPDATE telegram SET otp = $1 WHERE member_id = $2 AND point_id = $3 AND chat_type = $4`, otp, memberId, pointId, chatType)
			if err != nil {
				return telegramID, err
			}
			telegramID = existingTelegramID
		}
	}

	return telegramID, nil
}

func GetTelegramForMember(memberId string) (point.Telegram, error) {
	db := db.GetSQL()
	var telegram point.Telegram
	err := db.QueryRow(`SELECT telegram_id, member_id, username, chat_id, chat_type, first_name, last_name
	from telegram where member_id=$1 AND chat_type='member'`, memberId).Scan(&telegram.TelegramID, &telegram.MemberID,
		&telegram.Username, &telegram.ChatID, &telegram.ChatType, &telegram.FirstName, &telegram.LastName)

	if err != nil {
		if err == sql.ErrNoRows {
			return telegram, nil
		}
		return telegram, err
	}

	return telegram, err
}

func GetTelegramMemberByChatId(joinee_chat_id string) (string, error) {
	db := db.GetSQL()
	var member_id string
	err := db.QueryRow(`SELECT member_id from telegram where chat_id=$1 AND chat_type='member'`,
		joinee_chat_id).Scan(&member_id)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		}
		return member_id, err
	}

	return member_id, err
}

func GetTelegramMemberByUsername(username string) (string, error) {
	db := db.GetSQL()
	var member_id string
	err := db.QueryRow(`SELECT member_id from telegram where username=$1 AND chat_type='member'`,
		username).Scan(&member_id)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		}
		return member_id, err
	}

	return member_id, err
}

func GetTelegramForPoint(pointId string) (point.Telegram, error) {
	db := db.GetSQL()
	var telegram point.Telegram
	err := db.QueryRow(`SELECT telegram_id, point_id, username, chat_id, chat_type, first_name, last_name
	from telegram where point_id=$1 AND chat_type='group'`, pointId).Scan(&telegram.TelegramID, &telegram.PointID,
		&telegram.Username, &telegram.ChatID, &telegram.ChatType, &telegram.FirstName, &telegram.LastName)

	if err != nil {
		if err == sql.ErrNoRows {
			return telegram, nil
		}
		return telegram, err
	}

	return telegram, err
}

func AddTelegramEventsPoint(params point.TelegramEvent) error {
	db := db.GetSQL()
	for i := 0; i < len(params.EventName); i++ {
		_, err := db.Exec(`INSERT INTO telegram_points (point_id, event_name, points_num) VALUES ($1::uuid, $2, $3)`,
			params.PointID, params.EventName[i], params.PointsNum[i])
		if err != nil {
			return fmt.Errorf("failed to add product events: %w", err)
		}
	}
	return nil
}

func UpdateTelegramEventsPoint(params point.TelegramEvent) error {
	db := db.GetSQL()
	for i := 0; i < len(params.EventName); i++ {
		updateResult, err := db.Exec(`UPDATE telegram_points SET points_num = $3, updated_at = CURRENT_TIMESTAMP WHERE 
        point_id = $1 AND event_name = $2`, params.PointID, params.EventName[i], params.PointsNum[i])
		if err != nil {
			return fmt.Errorf("failed to update product events: %w", err)
		}

		rowsAffected, err := updateResult.RowsAffected()
		if err != nil {
			return fmt.Errorf("failed to check rows affected: %w", err)
		}

		if rowsAffected == 0 {
			_, err := db.Exec(`INSERT INTO telegram_points (point_id, event_name, points_num) VALUES ($1::uuid, $2, $3)`,
				params.PointID, params.EventName[i], params.PointsNum[i])
			if err != nil {
				return fmt.Errorf("failed to add product events: %w", err)
			}
		}
	}
	return nil
}

func GetTelegramEventForPoint(pointId string) (point.TelegramEventView, error) {
	db := db.GetSQL()
	var telegramEventView point.TelegramEventView
	err := db.QueryRow(`SELECT point_id, event_name, points_num from telegram_points WHERE point_id=$1`, pointId).Scan(&telegramEventView.PointID,
		&telegramEventView.EventName, &telegramEventView.PointsNum)

	if err != nil {
		if err == sql.ErrNoRows {
			return telegramEventView, nil
		}
		return telegramEventView, err
	}

	return telegramEventView, err
}

func GetPointIdAndPointsForGroups(event_name, group_chat_id string) (string, float64, error) {
	db := db.GetSQL()
	var pointId string
	var points float64
	err := db.QueryRow(`SELECT point_id from telegram where chat_id=$1 AND chat_type='group'`,
		group_chat_id).Scan(&pointId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", 0, nil
		}
		return pointId, 0, err
	}

	err = db.QueryRow(`SELECT points_num from telegram_points where point_id=$1 AND event_name=$2`,
		pointId, event_name).Scan(&points)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", 0, nil
		}
		return pointId, 0, err
	}

	return pointId, points, err
}

func GetPointIdByChatID(group_chat_id string) (string, error) {
	db := db.GetSQL()
	var pointId string
	err := db.QueryRow(`SELECT point_id from telegram where chat_id=$1 AND chat_type='group'`,
		group_chat_id).Scan(&pointId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		}
		return pointId, err
	}

	return pointId, err
}
