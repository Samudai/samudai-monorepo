package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateToken(token dao.Token) (int, error) {
	db := db.GetSQL()
	var tokenID int
	err := db.QueryRow(`INSERT INTO token (dao_id, ticker, contract_address, average_time_held, holders) 
		VALUES ($1::uuid, $2, $3, $4, $5) RETURNING id`,
		token.DAOID, token.Ticker, token.ContractAddress, token.AverageTimeHeld, token.Holders).Scan(&tokenID)
	if err != nil {
		return tokenID, err
	}

	return tokenID, nil
}

func GetTokenByDAOID(daoID string) ([]dao.Token, error) {
	db := db.GetSQL()
	var tokens []dao.Token
	rows, err := db.Query(`SELECT id, dao_id, ticker, contract_address, average_time_held, 
		holders, created_at, updated_at 
		FROM token WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return tokens, err
	}

	for rows.Next() {
		var token dao.Token
		err := rows.Scan(&token.ID, &token.DAOID, &token.Ticker, &token.ContractAddress, &token.AverageTimeHeld,
			&token.Holders, &token.CreatedAt, &token.UpdatedAt)
		if err != nil {
			return tokens, err
		}

		tokens = append(tokens, token)
	}

	return tokens, nil
}

func UpdateToken(token dao.Token) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE token SET ticker = $1, contract_address = $2, average_time_held = $3, holders = $4, 
		updated_at = CURRENT_TIMESTAMP WHERE id = $5`,
		token.Ticker, token.ContractAddress, token.AverageTimeHeld, token.Holders, token.ID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteToken(tokenID int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM token WHERE id = $1`, tokenID)
	if err != nil {
		return err
	}

	return nil
}
