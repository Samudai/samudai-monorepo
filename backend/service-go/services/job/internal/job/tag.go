package job

import "github.com/Samudai/backend/shared/sqldb"

func ListJobTags() ([]string, error) {
	db := sqldb.Job()
	var tags []string
	rows, err := db.Query("SELECT tag FROM job_tags")
	if err != nil {
		return tags, err
	}

	defer rows.Close()

	for rows.Next() {
		var tag string
		err := rows.Scan(&tag)
		if err != nil {
			return tags, err
		}
		tags = append(tags, tag)
	}

	return tags, nil
}

func ListBountyTags() ([]string, error) {
	db := sqldb.Job()
	var tags []string
	rows, err := db.Query("SELECT tag FROM bounty_tags")
	if err != nil {
		return tags, err
	}

	defer rows.Close()

	for rows.Next() {
		var tag string
		err := rows.Scan(&tag)
		if err != nil {
			return tags, err
		}
		tags = append(tags, tag)
	}

	return tags, nil
}
