package member

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/logger"

	"github.com/Samudai/backend/shared/sqldb"
)

func CreateWaitlistEntry(email string) error {
	db := sqldb.Member()
	_, err := db.Exec(`INSERT INTO waitlist (email) VALUES ($1)`, email)
	if err != nil {
		return fmt.Errorf("error inserting waitlist: %w", err)
	}

	logger.LogMessage("info", "Added waitlist ID: %s", email)
	return nil
}
