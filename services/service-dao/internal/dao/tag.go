package dao

import (

	"github.com/Samudai/samudai-pkg/db"
)


func ListTags() ([]string, error) {
	db := db.GetSQL()
	var tags []string
	rows, err := db.Query("SELECT tag FROM dao_tags")
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
