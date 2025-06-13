package member

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
)


func CreateWaitlistEntry(email string) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO waitlist (email) VALUES ($1)`, email)
	if err != nil {
		return fmt.Errorf("error inserting waitlist: %w", err)
	}

	logger.LogMessage("info", "Added waitlist ID: %s", email)
	return nil
}