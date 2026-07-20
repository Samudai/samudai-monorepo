package member

import "github.com/Samudai/backend/shared/sqldb"

func ListDomainTags() ([]string, error) {
	db := sqldb.Member()
	var domainTags []string
	rows, err := db.Query("SELECT domain_tags_for_work FROM domain_tags_for_work")
	if err != nil {
		return domainTags, err
	}

	defer rows.Close()

	for rows.Next() {
		var domainTag string
		err := rows.Scan(&domainTag)
		if err != nil {
			return domainTags, err
		}
		domainTags = append(domainTags, domainTag)
	}

	return domainTags, nil
}
