package member

import (
	"github.com/Samudai/samudai-pkg/db"
)

func ListSkills() ([]string, error) {
	db := db.GetSQL()
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
