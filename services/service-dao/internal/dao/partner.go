package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateDAOPartner(partner dao.Partner) (string, error) {
	db := db.GetSQL()
	var partnerID string
	err := db.QueryRow(`INSERT INTO dao_partner (dao_id, name, logo, 
		website, email, phone) 
		VALUES ($1::uuid, $2, $3, $4, $5, $6) RETURNING dao_partner_id`,
		partner.DAOID, partner.Name, partner.Logo, partner.Website, partner.Email, partner.Phone).Scan(&partnerID)
	if err != nil {
		return partnerID, err
	}

	logger.LogMessage("info", "Added DAO partner ID: %s to DAO ID: %s", partnerID, partner.DAOID)
	return partnerID, nil
}

func ListDAOPartners(daoID string) ([]dao.Partner, error) {
	db := db.GetSQL()
	var partners []dao.Partner
	rows, err := db.Query(`SELECT dao_partner_id, dao_id, name, logo, 
	website, email, phone FROM dao_partner WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return partners, err
	}
	defer rows.Close()

	for rows.Next() {
		var partner dao.Partner
		err := rows.Scan(&partner.DAOPartnerID, &partner.DAOID, &partner.Name, &partner.Logo, &partner.Website, &partner.Email, &partner.Phone)
		if err != nil {
			return partners, err
		}
		partners = append(partners, partner)
	}

	return partners, nil
}

func DeleteDAOPartner(daoID, partnerID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM dao_partner WHERE dao_id = $1::uuid AND dao_partner_id = $2::uuid`, daoID, partnerID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted DAO partner ID: %s from DAO ID: %s", partnerID, daoID)
	return nil
}

func CreateDAOPartnerSocial(partnerSocial dao.PartnerSocial) (int, error) {
	db := db.GetSQL()
	var partnerSocialID int
	err := db.QueryRow(`INSERT INTO partner_social (dao_partner_id, type, url) VALUES ($1::uuid, $2, $3) RETURNING id`, partnerSocial.DAOPartnerID, partnerSocial.Type, partnerSocial.URL).Scan(&partnerSocialID)
	if err != nil {
		return partnerSocialID, err
	}

	logger.LogMessage("info", "Added DAO partner social ID: %d to DAO Partner ID: %s", partnerSocialID, partnerSocial.DAOPartnerID)

	return partnerSocialID, nil
}

func UpdateDAOPartnerSocial(partnerSocial dao.PartnerSocial) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE partner_social SET type = $1, url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $3`, partnerSocial.Type, partnerSocial.URL, partnerSocial.ID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO partner social ID: %d", partnerSocial.ID)

	return nil
}

func ListDAOPartnerSocials(daoID string) ([]dao.PartnerSocial, error) {
	db := db.GetSQL()
	var partnerSocials []dao.PartnerSocial
	rows, err := db.Query(`SELECT id, dao_partner_id, type, url FROM partner_social WHERE dao_partner_id = $1::uuid`, daoID)
	if err != nil {
		return partnerSocials, err
	}

	defer rows.Close()

	for rows.Next() {
		var partnerSocial dao.PartnerSocial
		err := rows.Scan(&partnerSocial.ID, &partnerSocial.DAOPartnerID, &partnerSocial.Type, &partnerSocial.URL)
		if err != nil {
			return partnerSocials, err
		}
		partnerSocials = append(partnerSocials, partnerSocial)
	}

	return partnerSocials, nil
}

func DeleteDAOPartnerSocial(daoID string, partnerSocialID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM partner_social WHERE dao_partner_id = $1::uuid AND id = $2`, daoID, partnerSocialID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted DAO partner social ID: %s from DAO Partner ID: %s", partnerSocialID, daoID)

	return nil
}
