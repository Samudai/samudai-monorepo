package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateCollaborationPass(collaborationPass dao.CollaborationPass) (string, error) {
	db := db.GetSQL()
	var collaborationPassID string
	err := db.QueryRow(`INSERT INTO collaboration_pass (dao_id, claimed) 
		VALUES ($1::uuid, $2) RETURNING collaboration_pass_id`, collaborationPass.DAOID, collaborationPass.Claimed).Scan(&collaborationPassID)
	if err != nil {
		return collaborationPassID, err
	}

	return collaborationPassID, nil
}

func GetCollaborationPassByDaoId(daoId string) (dao.CollaborationPass, error) {
	db := db.GetSQL()
    var collaborationPass dao.CollaborationPass

	err := db.QueryRow(`SELECT collaboration_pass_id, dao_id, claimed, created_at, updated_at
		FROM collaboration_pass WHERE dao_id = $1`, daoId).Scan(&collaborationPass.CollaborationPassID, &collaborationPass.DAOID,
		&collaborationPass.Claimed, &collaborationPass.CreatedAt, &collaborationPass.UpdatedAt)
	if err != nil {
		return collaborationPass, err
	}

	return collaborationPass, nil
}

func UpdateCollaborationPass(collaborationPass dao.CollaborationPass) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE collaboration_pass SET dao_id = $2, claimed = $3 WHERE collaboration_pass_id = $1::uuid`, 
	collaborationPass.CollaborationPassID, collaborationPass.DAOID, collaborationPass.Claimed)
	if err != nil {
		return err
	}
	return nil
}

func DeleteCollaborationPass(collaborationPassID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM collaboration_pass WHERE collaboration_pass_id = $1::uuid`, collaborationPassID)
	if err != nil {
		return err
	}
	return nil
}