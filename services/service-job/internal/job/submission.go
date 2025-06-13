package job

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-job/pkg/job"
)

func CreateSubmission(Type job.ApplicantType, submission job.Submission) (string, error) {
	db := db.GetSQL()
	var submissionID string
	var err error
	if Type == job.ApplicantTypeMember {
		err = db.QueryRow(`INSERT INTO submission (bounty_id, member_id, submission, file, status) 
			VALUES ($1::uuid, $2::uuid, $3, $4, $5) RETURNING submission_id`, submission.BountyID, submission.MemberID, submission.Submission, submission.File, submission.Status).Scan(&submissionID)
	} else if Type == job.ApplicantTypeClan {
		err = db.QueryRow(`INSERT INTO submission (bounty_id, clan_id, submission, file, status) 
			VALUES ($1::uuid, $2::uuid, $3, $4, $5) RETURNING submission_id`, submission.BountyID, submission.ClanID, submission.Submission, submission.File, submission.Status).Scan(&submissionID)
	}
	if err != nil {
		return submissionID, err
	}

	logger.LogMessage("info", "Added submission type: %s ID: %s", Type, submissionID)
	return submissionID, nil
}

func GetSubmissionByID(submissionID string) (job.Submission, error) {
	db := db.GetSQL()
	var submission job.Submission
	err := db.QueryRow(`SELECT submission_id, bounty_id, member_id, clan_id, 
		submission, file, status, rank, feedback, created_at, updated_at
		FROM submission WHERE submission_id = $1::uuid
		ORDER BY created_at DESC`, submissionID).Scan(&submission.SubmissionID, &submission.BountyID, &submission.MemberID, &submission.ClanID, &submission.Submission,
		&submission.File, &submission.Status, &submission.Rank, &submission.Feedback, &submission.CreatedAt, &submission.UpdatedAt)
	if err != nil {
		return submission, err
	}

	return submission, nil
}

func GetSubmissionByBountyID(bountyID string) (job.GetSubmissionListResponse, error) {
	db := db.GetSQL()
	var submissions job.GetSubmissionListResponse
	var members []job.Submission
	var clans []job.Submission
	rows, err := db.Query(`SELECT submission_id, bounty_id, member_id, clan_id, 
		submission, file, status, rank, feedback, created_at, updated_at
		FROM submission WHERE bounty_id = $1::uuid
		ORDER BY created_at DESC`, bountyID)
	if err != nil {
		return submissions, err
	}

	defer rows.Close()

	for rows.Next() {
		var submission job.Submission
		err := rows.Scan(&submission.SubmissionID, &submission.BountyID, &submission.MemberID, &submission.ClanID,
			&submission.Submission, &submission.File, &submission.Status, &submission.Rank, &submission.Feedback,
			&submission.CreatedAt, &submission.UpdatedAt)
		if err != nil {
			return submissions, err
		}
		if submission.MemberID == nil {
			members = append(members, submission)
		} else if submission.ClanID == nil {
			clans = append(clans, submission)
		}
	}

	submissions.Members = members
	submissions.Clans = clans

	return submissions, nil
}

func GetSubmissionListByMemberID(memberID string) ([]job.Submission, error) {
	db := db.GetSQL()
	var submissions []job.Submission
	rows, err := db.Query(`SELECT submission_id, bounty_id, member_id,
		submission, file, status, rank, feedback, created_at, updated_at
		FROM submission WHERE member_id = $1::uuid
		ORDER BY (status::integer) ASC, created_at DESC`, memberID)
	if err != nil {
		return submissions, err
	}

	defer rows.Close()

	for rows.Next() {
		var submission job.Submission
		err := rows.Scan(&submission.SubmissionID, &submission.BountyID, &submission.MemberID,
			&submission.Submission, &submission.File, &submission.Status, &submission.Rank, &submission.Feedback,
			&submission.CreatedAt, &submission.UpdatedAt)
		if err != nil {
			return submissions, err
		}
		submissions = append(submissions, submission)
	}

	return submissions, nil
}

func GetSubmissionListByClanID(clanID string) ([]job.Submission, error) {
	db := db.GetSQL()
	var submissions []job.Submission
	rows, err := db.Query(`SELECT submission_id, bounty_id, clan_id,
		submission, file, status, rank, feedback, created_at, updated_at
		FROM submission WHERE clan_id = $1::uuid
		ORDER BY (status::integer) ASC, created_at DESC`, clanID)
	if err != nil {
		return submissions, err
	}

	defer rows.Close()

	for rows.Next() {
		var submission job.Submission
		err := rows.Scan(&submission.SubmissionID, &submission.BountyID, &submission.ClanID,
			&submission.Submission, &submission.File, &submission.Status, &submission.Rank, &submission.Feedback,
			&submission.CreatedAt, &submission.UpdatedAt)
		if err != nil {
			return submissions, err
		}
		submissions = append(submissions, submission)
	}

	return submissions, nil
}

func DeleteSubmission(submissionID string) error {
	db := db.GetSQL()
	_, err := db.Exec("DELETE FROM submission WHERE submission_id = $1::uuid", submissionID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted submission ID: %s", submissionID)
	return nil
}

func ReviewSubmission(submission job.Submission) error {
	db := db.GetSQL()

	if submission.Status == "accepted" {
		var count int
		err := db.QueryRow(`
			SELECT COUNT(*)
			FROM submission
			WHERE bounty_id = $1::uuid AND rank = $2
		`, submission.BountyID, submission.Rank).Scan(&count)
		if err != nil {
			return err
		}

		if count == 0 {
			_, err = db.Exec(`
				UPDATE submission
				SET status = $2, feedback = $3, rank = $4, updated_at = CURRENT_TIMESTAMP
				WHERE submission_id = $1::uuid
			`, submission.SubmissionID, submission.Status, submission.Feedback, submission.Rank)
			if err != nil {
				return err
			}

			logger.LogMessage("info", "Reviewed submission ID: %s", submission.SubmissionID)
		} else {
			logger.LogMessage("info", "Cannot accept submission ID: %s", submission.SubmissionID)
			return fmt.Errorf("Rank %d is already been granted", submission.Rank)
		}
	} else {
		_, err := db.Exec(`
			UPDATE submission
			SET status = $2, feedback = $3, rank = $4, updated_at = CURRENT_TIMESTAMP
			WHERE submission_id = $1::uuid
		`, submission.SubmissionID, submission.Status, submission.Feedback, submission.Rank)
		if err != nil {
			return err
		}

		logger.LogMessage("info", "Reviewed submission ID: %s", submission.SubmissionID)
	}

	return nil
}

