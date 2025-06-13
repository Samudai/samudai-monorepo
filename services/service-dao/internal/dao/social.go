package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateDAOSocial(socials []dao.Social) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	for _, social := range socials {
		_, err := tx.Exec(`INSERT INTO social (dao_id, type, url) VALUES ($1::uuid, $2, $3) RETURNING id`, social.DAOID, social.Type, social.URL)
		if err != nil {
			return err
		}
		logger.LogMessage("info", "Added DAO social for DAO ID: %s", social.DAOID)
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func UpdateDAOSocial(socials []dao.Social) error {
	db := db.GetSQL()

	daoID := socials[0].DAOID

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	_, err = tx.Exec(`DELETE FROM social WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return err
	}

	for _, social := range socials {
		_, err := tx.Exec(`INSERT INTO social (dao_id, type, url) 
		VALUES ($1::uuid, $2, $3) RETURNING id`, social.DAOID, social.Type, social.URL)
		if err != nil {
			return err
		}
		logger.LogMessage("info", "Added DAO social for DAO ID: %s", social.DAOID)
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func ListDAOSocials(daoID string) ([]dao.Social, error) {
	db := db.GetSQL()
	var socials []dao.Social
	rows, err := db.Query(`SELECT id, dao_id, type, url FROM social WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return socials, err
	}

	defer rows.Close()

	for rows.Next() {
		var social dao.Social
		err := rows.Scan(&social.ID, &social.DAOID, &social.Type, &social.URL)
		if err != nil {
			return socials, err
		}
		socials = append(socials, social)
	}

	return socials, nil
}

func DeleteDAOSocial(socialID int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM social WHERE id = $1`, socialID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted DAO social ID: %d", socialID)

	return nil
}
