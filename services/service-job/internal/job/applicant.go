package job

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-job/pkg/job"
)

func CreateApplicant(Type job.ApplicantType, applicant job.Applicant) (string, error) {
	db := db.GetSQL()
	var applicantID string
	var err error
	if Type == job.ApplicantTypeMember {
		err = db.QueryRow(`INSERT INTO applicants (job_id, member_id, answers, status, application) 
			VALUES ($1::uuid, $2::uuid, $3, $4, $5) RETURNING applicant_id`,
			applicant.OpportunityID, applicant.MemberID, applicant.Answers, applicant.Status, applicant.Application).Scan(&applicantID)
	} else if Type == job.ApplicantTypeClan {
		err = db.QueryRow(`INSERT INTO applicants (job_id, clan_id, answers, status, application) 
			VALUES ($1::uuid, $2::uuid, $3, $4, $5) RETURNING applicant_id`,
			applicant.OpportunityID, applicant.ClanID, applicant.Answers, applicant.Status, applicant.Application).Scan(&applicantID)
	}
	if err != nil {
		return applicantID, err
	}

	logger.LogMessage("info", "Added applicant type: %s ID: %s", Type, applicantID)
	return applicantID, nil
}

func GetApplicantList(jobID string) (job.GetApplicantListResponse, error) {
	db := db.GetSQL()
	var applicants job.GetApplicantListResponse
	var members []job.Applicant
	var clans []job.Applicant
	rows, err := db.Query(`SELECT applicant_id, job_id, member_id, clan_id, answers, status, application, created_at, updated_at
		FROM applicants 
		WHERE job_id = $1::uuid
		ORDER BY created_at DESC`, jobID)
	if err != nil {
		return applicants, err
	}
	defer rows.Close()

	for rows.Next() {
		var applicant job.Applicant
		err := rows.Scan(&applicant.ApplicantID, &applicant.OpportunityID, &applicant.MemberID, &applicant.ClanID, &applicant.Answers, &applicant.Status, &applicant.Application,
		&applicant.CreatedAt, &applicant.UpdatedAt)
		if err != nil {
			return applicants, err
		}
		if applicant.MemberID == nil {
			clans = append(clans, applicant)
		} else {
			members = append(members, applicant)
		}
	}

	applicants.Members = members
	applicants.Clans = clans

	return applicants, nil
}

func GetApplicantListByMemberID(memberID string) ([]job.Applicant, error) {
	db := db.GetSQL()
	var applicants []job.Applicant
	rows, err := db.Query(`SELECT applicant_id, job_id, member_id, answers, status, application, created_at, updated_at
		FROM applicants 
		WHERE member_id = $1::uuid
		ORDER BY (status::integer) ASC, created_at DESC`, memberID)
	if err != nil {
		return applicants, err
	}
	defer rows.Close()

	for rows.Next() {
		var applicant job.Applicant
		err := rows.Scan(&applicant.ApplicantID, &applicant.OpportunityID, &applicant.MemberID, &applicant.Answers, &applicant.Status, &applicant.Application,
		&applicant.CreatedAt, &applicant.UpdatedAt)
		if err != nil {
			return applicants, err
		}
		applicants = append(applicants, applicant)
	}

	return applicants, nil
}

func GetApplicantListByClanID(clanID string) ([]job.Applicant, error) {
	db := db.GetSQL()
	var applicants []job.Applicant
	rows, err := db.Query(`SELECT applicant_id, job_id, clan_id, answers, status, application, created_at, updated_at
		FROM applicants
		WHERE clan_id = $1::uuid
		ORDER BY (status::integer) ASC, created_at DESC`, clanID)
	if err != nil {
		return applicants, err
	}
	defer rows.Close()

	for rows.Next() {
		var applicant job.Applicant
		err := rows.Scan(&applicant.ApplicantID, &applicant.OpportunityID, &applicant.ClanID, &applicant.Answers, &applicant.Status, &applicant.Application,
		&applicant.CreatedAt, &applicant.UpdatedAt)
		if err != nil {
			return applicants, err
		}

		applicants = append(applicants, applicant)
	}

	return applicants, nil
}

func GetApplicantByID(applicantID string) (job.Applicant, error) {
	db := db.GetSQL()
	var applicant job.Applicant
	err := db.QueryRow(`SELECT applicant_id, job_id, member_id, clan_id, answers, status, application, created_at, updated_at
		FROM applicants 
		WHERE applicant_id = $1::uuid`, applicantID).Scan(&applicant.ApplicantID, &applicant.OpportunityID, &applicant.MemberID, &applicant.ClanID, &applicant.Answers, &applicant.Status, &applicant.Application, 
		&applicant.CreatedAt, &applicant.UpdatedAt)
	if err != nil {
		return applicant, err
	}

	return applicant, nil
}

func UpdateApplicant(applicant job.Applicant) error {
	db := db.GetSQL()
	_, err := db.Exec("UPDATE applicants SET answers = $2, application = $3  WHERE applicant_id = $1::uuid", 
	applicant.ApplicantID, applicant.Answers, applicant.Application)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated applicant ID: %s", applicant.ApplicantID)
	return nil
}

func UpdateApplicantStatus(applicant job.Applicant) error {
	db := db.GetSQL()
	_, err := db.Exec("UPDATE applicants SET status = $2  WHERE applicant_id = $1::uuid", 
	applicant.ApplicantID, applicant.Status)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated applicant ID: %s", applicant.ApplicantID)
	return nil
}

func DeleteApplicant(applicantID string) error {
	db := db.GetSQL()
	_, err := db.Exec("DELETE FROM applicants WHERE applicant_id = $1::uuid", applicantID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted applicant ID: %s", applicantID)
	return nil
}

func GetNewApplicantsCount(daoID string) ([]job.DataPoint, error) {
	db := db.GetSQL()
	var dataPoints []job.DataPoint

	rows, err := db.Query(`
			SELECT tmp.date,
			COALESCE(t.value, 0::bigint) AS value
		FROM (
		SELECT date_trunc('day', app.created_at) AS date,
				count(*) AS value
		FROM applicants app
		JOIN opportunity opp ON app.job_id = opp.job_id
		WHERE opp.dao_id = $1 AND app.created_at >= NOW() - INTERVAL '1 YEAR'
		GROUP BY date_trunc('day', app.created_at)
		) t
		RIGHT JOIN (
		SELECT generate_series((NOW() - INTERVAL '1 YEAR')::date, NOW()::date, '1 day'::interval) AS date
		) tmp ON tmp.date = t.date
		ORDER BY tmp.date DESC
	`, daoID)
	if err != nil {
		return dataPoints, err
	}

	defer rows.Close()

	for rows.Next() {
		var data job.DataPoint
		err := rows.Scan(&data.Date, &data.Value)
		if err != nil {
			return dataPoints, err
		}

		dataPoints = append(dataPoints, data)
	}

	return dataPoints, nil
}