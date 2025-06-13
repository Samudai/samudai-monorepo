package member

import (
	"fmt"
	
	"database/sql"
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
)


func AddTelegramForMember(telegramInfo member.Telegram) error {
	db := db.GetSQL()

	result, err := db.Exec(`UPDATE telegram SET chat_id = $2, username = $3, first_name = $4, last_name = $5 WHERE generated_telegram_id = $1`, 
		telegramInfo.GeneratedTelegramId, telegramInfo.ChatID, telegramInfo.Username, telegramInfo.FirstName, telegramInfo.LastName)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("No rows found for the specified generated_telegram_id")
	}
	
	return nil
}

func CreateOrUpdateGeneratedTelegramId(memberId string, generated_tele_id string) (string, error) {
    db := db.GetSQL()
    var telegramID string

    // Check if a record with member_id exists in telegram
    var existingTelegramID string
    err := db.QueryRow(`SELECT telegram_id FROM telegram WHERE member_id = $1`, memberId).Scan(&existingTelegramID)

    if err == sql.ErrNoRows {
        // No existing record found, perform the insert
        err = db.QueryRow(`INSERT INTO telegram (member_id, generated_telegram_id) VALUES ($1::uuid, $2) RETURNING telegram_id`, memberId, generated_tele_id).Scan(&telegramID)
        if err != nil {
            return telegramID, err
        }
    } else if err != nil {
        return telegramID, err
    } else {
        // Existing record found, perform the update
        _, err = db.Exec(`UPDATE telegram SET generated_telegram_id = $1 WHERE member_id = $2`, generated_tele_id, memberId)
        if err != nil {
            return telegramID, err
        }
        telegramID = existingTelegramID
    }

    return telegramID, nil
}

func CheckTelegramExist(memberId string) (bool, *string, error) {
	db := db.GetSQL()
	var member member.Telegram
	err := db.QueryRow(`SELECT username, chat_id from telegram where member_id=$1`, memberId).Scan(&member.Username, &member.ChatID)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil, nil
		} else {
			return false, nil, err
		}
	}

	if ( member.Username == nil && member.ChatID == nil){
		return false, nil, nil
	}

	return true, member.Username, nil
}

func GetTelegramForMember(memberId string) (member.Telegram, error) {
	db := db.GetSQL()
	var telegram member.Telegram
	err := db.QueryRow(`SELECT telegram_id, member_id, username, chat_id, first_name, last_name
	from telegram where member_id=$1`, memberId).Scan(&telegram.TelegramID, &telegram.MemberID, 
	&telegram.Username, &telegram.ChatID, &telegram.FirstName, &telegram.LastName)

	if err != nil {
		if err == sql.ErrNoRows {
			return telegram, nil
		}
		return telegram, err
	}

	return telegram, nil
}

func DeleteTelegramForMember(memberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM telegram WHERE member_id = $1`, memberID)
	if err != nil {
		return err
	}

	return nil
}