package member

import "github.com/Samudai/backend/shared/sqldb"

func ListSkills() ([]string, error) {
	db := sqldb.Member()
	var skills []string
	rows, err := db.Query("SELECT skill FROM skills")
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
