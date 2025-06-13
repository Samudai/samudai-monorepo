package job

import (
	"github.com/Samudai/samudai-pkg/db"
)

func GetTotalJobsAppliedCountForMember(memberID string) (int, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT SUM(tasks + bounty) AS totaljobapplied 
		FROM (
	 		SELECT ( SELECT count(*) FROM applicants WHERE member_id = $1) AS tasks,
			 	   ( SELECT count(*) FROM submission WHERE member_id = $1) AS bounty
		) subquery_counts`, memberID).Scan(&count)
	if err != nil {
		return count, err
	}

	return count, nil
}

func FetchApplicantCountForMember(daoIDs []string, memberID string) (int, error) {
	db := db.GetSQL()
	var totalCount int

	for _, daoID := range daoIDs {
		var count int
		err := db.QueryRow(`
			SELECT SUM(applicants + submissions) AS totalapplicants
			FROM (
				SELECT 
					( SELECT count(*) FROM applicants app JOIN opportunity opp ON opp.job_id = app.job_id WHERE opp.dao_id = $1) AS applicants,
					( SELECT count(*) FROM submission sub JOIN bounty b ON b.bounty_id = sub.bounty_id WHERE b.dao_id = $1) AS submissions
			) subquery_counts`, daoID).Scan(&count)
		
		if err != nil {
			return 0, err
		}
		
		totalCount += count
	}

	return totalCount, nil
}