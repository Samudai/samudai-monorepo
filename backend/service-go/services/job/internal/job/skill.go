package job

import "github.com/Samudai/backend/shared/sqldb"

func ListJobSkills() ([]string, error) {
	db := sqldb.Job()
	var skills []string
	rows, err := db.Query("SELECT skill FROM job_skills")
	if err != nil {
		return skills, err
	}

	defer rows.Close()

	for rows.Next() {
		var skill string
		err := rows.Scan(&skill)
		if err != nil {
			return skills, err
		}
		skills = append(skills, skill)
	}

	return skills, nil
}

func ListBountySkills() ([]string, error) {
	db := sqldb.Job()
	var skills []string
	rows, err := db.Query("SELECT skill FROM bounty_skills")
	if err != nil {
		return skills, err
	}

	defer rows.Close()

	for rows.Next() {
		var skill string
		err := rows.Scan(&skill)
		if err != nil {
			return skills, err
		}
		skills = append(skills, skill)
	}

	return skills, nil
}
