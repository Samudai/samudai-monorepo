package member

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-member/pkg/member"
)

// CreateWallet adds a wallet for a member
func CreateWallet(params member.Wallet) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO member_wallet (member_id, wallet_address, chain_id, "default") VALUES ($1, $2, $3, $4)`, params.MemberID, params.WalletAddress, params.ChainID, params.Default)
	if err != nil {
		return fmt.Errorf("error inserting wallet: %w", err)
	}

	logger.LogMessage("info", "Added wallet for member ID: %s", params.MemberID)
	return nil
}

func UpdateDefaultWallet(memberID, wallet string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE member_wallet SET "default" = false WHERE member_id = $1`, memberID)
	if err != nil {
		return fmt.Errorf("error updating wallet: %w", err)
	}

	_, err = db.Exec(`UPDATE member_wallet SET "default" = true WHERE member_id = $1 AND wallet_address = $2`, memberID, wallet)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated wallet for member ID: %s", memberID)
	return nil
}

func DeleteWallet(memberID string, walletAddress string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM member_wallet WHERE member_id = $1::uuid AND wallet_address = $2 
		AND COUNT(SELECT * FROM member_wallet WHERE member_id = $1::uuid) > 1`, memberID, walletAddress)
	if err != nil {
		return fmt.Errorf("error deleting wallet: %w", err)
	}

	logger.LogMessage("info", "Deleted wallet for member ID: %s", memberID)
	return nil
}

func GetDefaultWallet(memberID string) (member.Wallet, error) {
	db := db.GetSQL()
	var wallet member.Wallet
	err := db.QueryRow(`SELECT id, member_id, wallet_address, chain_id, "default" 
		FROM member_wallet WHERE member_id = $1 AND "default" = true`,
		memberID).Scan(&wallet.WalletID, &wallet.MemberID, &wallet.WalletAddress, &wallet.ChainID, &wallet.Default)
	if err != nil {
		return member.Wallet{}, fmt.Errorf("error getting default wallet: %w", err)
	}

	return wallet, nil
}
