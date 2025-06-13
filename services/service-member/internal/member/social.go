package member

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-member/pkg/member"
)

func CreateMemberSocial(socials []member.Social) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, social := range socials {
		_, err = tx.Exec(`INSERT INTO social (member_id, type, url) 
		VALUES ($1::uuid, $2, $3)`, social.MemberID, social.Type, social.URL)
		if err != nil {
			return fmt.Errorf("Error executing statement: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

func UpdateMemberSocial(socials []member.Social) error {
	db := db.GetSQL()

	if len(socials) == 0 {
		return nil
	}

	memberID := socials[0].MemberID

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	_, err = tx.Exec(`DELETE FROM social WHERE member_id = $1::uuid`, memberID)
	if err != nil {
		return fmt.Errorf("Error executing statement: %w", err)
	}

	for _, social := range socials {
		_, err = tx.Exec(`INSERT INTO social (member_id, type, url) 
		VALUES ($1::uuid, $2, $3)`, social.MemberID, social.Type, social.URL)
		if err != nil {
			return fmt.Errorf("Error executing statement: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

func ListMemberSocials(MemberID string) ([]member.Social, error) {
	db := db.GetSQL()
	var socials []member.Social
	rows, err := db.Query(`SELECT id, member_id, type, url FROM social WHERE member_id = $1::uuid`, MemberID)
	if err != nil {
		return socials, err
	}

	defer rows.Close()

	for rows.Next() {
		var social member.Social
		err := rows.Scan(&social.ID, &social.MemberID, &social.Type, &social.URL)
		if err != nil {
			return socials, err
		}
		socials = append(socials, social)
	}

	return socials, nil
}

func DeleteMemberSocial(socialID int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM social WHERE id = $1`, socialID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted Member social ID: %d", socialID)

	return nil
}
