package deal

import "time"

func getTime() *time.Time {
	now := time.Now().UTC()
	return &now
}
