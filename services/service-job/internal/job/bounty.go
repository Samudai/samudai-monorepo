package job

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-job/pkg/job"
	"github.com/lib/pq"
)

func CreateBounty(bounty job.Bounty) (string, error) {
	db := db.GetSQL()
	var bountyID string

	err := db.QueryRow(`INSERT INTO bounty (dao_id, title, project_id, task_id, subtask_id, description, 
		description_raw, winner_count, start_date, end_date, status,
		poc_member_id, created_by, skills, tags, visibility, req_people_count, department, remaining_req) 
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $17) 
		RETURNING bounty_id`,
		bounty.DAOID, bounty.Title, bounty.ProjectID, bounty.TaskID, bounty.SubtaskId, bounty.Description, bounty.DescriptionRaw,
		bounty.WinnerCount, bounty.StartDate, bounty.EndDate, bounty.Status,
		bounty.POCMemberID, bounty.CreatedBy, pq.Array(bounty.Skills), pq.Array(bounty.Tags),
		bounty.Visibility, bounty.ReqPeopleCount, bounty.Department).Scan(&bountyID)
	if err != nil {
		return bountyID, err
	}

	return bountyID, nil
}

func GetBountyByID(bountyID string) (job.BountyView, error) {
	db := db.GetSQL()
	var payout, files *string
	var created_by, poc, updated_by *string
	var bounty job.BountyView
	err := db.QueryRow(`SELECT bounty_id, dao_id, dao_name, project_id, project_name, task_id, task_name, subtask_id, subtask_name, title, description, 
		description_raw, winner_count, start_date, end_date, 
		status, poc_member, created_by, skills, tags, payout, files,
		visibility, req_people_count, created_at, updated_at, updated_by, department, accepted_submissions
		FROM bounty_view
		WHERE bounty_id = $1::uuid
		ORDER BY created_at DESC`, bountyID).Scan(&bounty.BountyID, &bounty.DAOID, &bounty.DAOName, &bounty.ProjectID, &bounty.ProjectName, &bounty.TaskID, &bounty.TaskName, &bounty.SubtaskId, &bounty.SubtaskName,
		&bounty.Title, &bounty.Description, &bounty.DescriptionRaw, &bounty.WinnerCount, &bounty.StartDate,
		&bounty.EndDate, &bounty.Status, &created_by, &poc, pq.Array(&bounty.Skills), pq.Array(&bounty.Tags), &payout, &files,
		&bounty.Visibility, &bounty.ReqPeopleCount, &bounty.CreatedAt, &bounty.UpdatedAt, &updated_by,
		&bounty.Department, &bounty.AcceptedSubmissions)
	if err != nil {
		return bounty, err
	}

	if payout != nil {
		err = json.Unmarshal([]byte(*payout), &bounty.JobPayout)
		if err != nil {
			return bounty, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	if files != nil {
		err = json.Unmarshal([]byte(*files), &bounty.BountyFiles)
		if err != nil {
			return bounty, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	if created_by != nil {
		err = json.Unmarshal([]byte(*created_by), &bounty.CreatedBy)
		if err != nil {
			return bounty, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	if updated_by != nil {
		err = json.Unmarshal([]byte(*updated_by), &bounty.UpdatedBy)
		if err != nil {
			return bounty, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	if poc != nil {
		err = json.Unmarshal([]byte(*poc), &bounty.POCMemberID)
		if err != nil {
			return bounty, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	return bounty, nil
}

func GetBountyByDAOID(daoID string, limit, offset *int) ([]job.BountyView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var bounties []job.BountyView
	rows, err := db.Query(`SELECT count(*) over() as total, bounty_id, dao_id, dao_name, project_id, project_name, task_id, task_name, subtask_id, subtask_name,
		title, description, description_raw,
		winner_count, start_date, end_date, 
		status, poc_member, created_by, skills, tags, payout, files,
		visibility, req_people_count, total_applicant_count, created_at, updated_at, updated_by, department, accepted_submissions
		FROM bounty_view WHERE dao_id = $1::uuid
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, daoID, limit, offset)
	if err != nil {
		return bounties, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var bounty job.BountyView
		err := rows.Scan(&total, &bounty.BountyID, &bounty.DAOID, &bounty.DAOName, &bounty.ProjectID, &bounty.ProjectName, &bounty.TaskID, &bounty.TaskName, &bounty.SubtaskId, &bounty.SubtaskName, &bounty.Title,
			&bounty.Description, &bounty.DescriptionRaw,
			&bounty.WinnerCount, &bounty.StartDate, &bounty.EndDate,
			&bounty.Status, &poc, &created_by, pq.Array(&bounty.Skills), pq.Array(&bounty.Tags), &payout, &files,
			&bounty.Visibility, &bounty.ReqPeopleCount, &bounty.TotalApplicantCount, &bounty.CreatedAt, &bounty.UpdatedAt, &updated_by, 
			&bounty.Department, &bounty.AcceptedSubmissions)
		if err != nil {
			return bounties, total, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &bounty.JobPayout)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &bounty.BountyFiles)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &bounty.CreatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &bounty.POCMemberID)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &bounty.UpdatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		bounties = append(bounties, bounty)
	}

	return bounties, total, nil
}

func GetOpenBounties(query string, limit, offset *int, DaoNamesList *[]string, skillList *[]string) ([]job.BountyView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var bounties []job.BountyView

	var daoNames *pq.StringArray
	if DaoNamesList != nil && len(*DaoNamesList) > 0 {
		DaoNames := pq.StringArray(*DaoNamesList)
		daoNames = &DaoNames
	}

	var skills *pq.StringArray
	if skillList != nil && len(*skillList) > 0 {
		Skills := pq.StringArray(*skillList)
		skills = &Skills
	}

	rows, err := db.Query(`SELECT count(*) over() as total, bounty_id, dao_id, dao_name, 
		project_id, project_name, task_id, task_name, subtask_id, subtask_name, title, description, description_raw,
		winner_count, start_date, end_date, 
		status, poc_member, created_by, skills, tags, payout, files,
		visibility, req_people_count, created_at, updated_at, updated_by, department, accepted_submissions
		FROM bounty_view 
		WHERE visibility = $1
		AND title ~* $6 
		AND (CASE WHEN $4::text[] IS NOT NULL THEN dao_name = ANY($4::text[]) ELSE true END)
		AND (CASE WHEN $5::text[] IS NOT NULL THEN skills && $5::text[] ELSE true END)
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, job.VisibilityTypePublic, limit, offset, daoNames, skills, query)
	if err != nil {
		return bounties, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var bounty job.BountyView
		err := rows.Scan(&total, &bounty.BountyID, &bounty.DAOID, &bounty.DAOName, &bounty.ProjectID, &bounty.ProjectName, &bounty.TaskID, &bounty.TaskName, &bounty.SubtaskId, &bounty.SubtaskName,
			&bounty.Title, &bounty.Description, &bounty.DescriptionRaw,
			&bounty.WinnerCount, &bounty.StartDate, &bounty.EndDate,
			&bounty.Status, &poc, &created_by, pq.Array(&bounty.Skills), pq.Array(&bounty.Tags), &payout, &files,
			&bounty.Visibility, &bounty.ReqPeopleCount, &bounty.CreatedAt, &bounty.UpdatedAt, &updated_by,
			&bounty.Department, &bounty.AcceptedSubmissions)
		if err != nil {
			return bounties, total, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &bounty.JobPayout)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &bounty.BountyFiles)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &bounty.CreatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &bounty.POCMemberID)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &bounty.UpdatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		bounties = append(bounties, bounty)
	}

	return bounties, total, nil
}

func GetBountyCreatedBy(memberID string, limit, offset *int) ([]job.BountyView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var bounties []job.BountyView
	rows, err := db.Query(`SELECT count(*) over() as total, bounty_id, dao_id, dao_name, project_id, project_name, task_id, task_name, subtask_id, subtask_name,
		title, description, description_raw, winner_count, start_date, end_date, 
		status, poc_member, created_by, skills, tags, payout, files,
		visibility, req_people_count, created_at, updated_at, updated_by, department, accepted_submissions
		FROM bounty_view
		WHERE json_extract_path_text(bounty_view.created_by, 'member_id')::uuid = $1::uuid
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, memberID, limit, offset)
	if err != nil {
		return bounties, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var bounty job.BountyView
		err := rows.Scan(&total, &bounty.BountyID, &bounty.DAOID, &bounty.DAOName, &bounty.ProjectID, &bounty.ProjectName, &bounty.TaskID, &bounty.TaskName, &bounty.SubtaskId, &bounty.SubtaskName,
			&bounty.Title, &bounty.Description, &bounty.DescriptionRaw,
			&bounty.WinnerCount, &bounty.StartDate, &bounty.EndDate,
			&bounty.Status, &poc, &created_by, pq.Array(&bounty.Skills), pq.Array(&bounty.Tags), &payout, &files,
			&bounty.Visibility, &bounty.ReqPeopleCount, &bounty.CreatedAt, &bounty.UpdatedAt, &updated_by,
			&bounty.Department, &bounty.AcceptedSubmissions)
		if err != nil {
			return bounties, total, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &bounty.JobPayout)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &bounty.BountyFiles)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &bounty.CreatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &bounty.POCMemberID)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &bounty.UpdatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		bounties = append(bounties, bounty)
	}

	return bounties, total, nil
}

func GetBountyListForMember(userDAOIDs []string, filter *job.FilterBounty, limit, offset *int) ([]job.BountyView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var bounties []job.BountyView
	var daos *pq.StringArray
	if filter != nil && filter.DaoIDs != nil && len(*filter.DaoIDs) > 0 {
		daoIDs := pq.StringArray(*filter.DaoIDs)
		daos = &daoIDs
	}
	var tags *pq.StringArray
	if filter != nil && filter.Tags != nil && len(*filter.Tags) > 0 {
		Tags := pq.StringArray(*filter.Tags)
		tags = &Tags
	}
	var skills *pq.StringArray
	if filter != nil && filter.Skills != nil && len(*filter.Skills) > 0 {
		Skills := pq.StringArray(*filter.Skills)
		skills = &Skills
	}
	var payoutAmountMin *int
	if filter != nil && filter.PayoutAmount != nil {
		payoutAmountMin = &filter.PayoutAmount.Min
	}
	var payoutAmountMax *int
	if filter != nil && filter.PayoutAmount != nil {
		payoutAmountMax = &filter.PayoutAmount.Max
	}
	rows, err := db.Query(`SELECT count(*) over() as total, bounty_id, dao_id, dao_name, project_id, project_name, task_id, task_name, subtask_id, subtask_name,
		title, description, description_raw, winner_count, start_date, end_date, 
		status, poc_member, created_by, skills, tags, payout, files,
		visibility, req_people_count, created_at, updated_at, updated_by, department, accepted_submissions
		FROM bounty_view
		WHERE status = 'open' AND (dao_id = ANY($1) OR visibility = 'public')
		AND CASE WHEN $2::uuid[] IS NOT NULL THEN dao_id = ANY($2) ELSE true END
		AND CASE WHEN $3::text[] IS NOT NULL THEN tags && $3 ELSE true END
		AND CASE WHEN $4::text[] IS NOT NULL THEN skills && $4 ELSE true END
		AND CASE WHEN $5::int IS NOT NULL THEN (json_extract_path_text(bounty_view.payout, 'payout_amount')::integer) >= $5 ELSE true END
		AND CASE WHEN $6::int IS NOT NULL THEN (json_extract_path_text(bounty_view.payout, 'payout_amount')::integer) <= $6 ELSE true END
		ORDER BY created_at DESC
		LIMIT $7 OFFSET $8`, pq.Array(userDAOIDs), daos, tags, skills, payoutAmountMin, payoutAmountMax, limit, offset)
	if err != nil {
		return bounties, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var bounty job.BountyView
		err := rows.Scan(&total, &bounty.BountyID, &bounty.DAOID, &bounty.DAOName, &bounty.ProjectID, &bounty.ProjectName, &bounty.TaskID, &bounty.TaskName, &bounty.SubtaskId, &bounty.SubtaskName,
			&bounty.Title, &bounty.Description, &bounty.DescriptionRaw,
			&bounty.WinnerCount, &bounty.StartDate, &bounty.EndDate,
			&bounty.Status, &poc, &created_by, pq.Array(&bounty.Skills), pq.Array(&bounty.Tags), &payout, &files,
			&bounty.Visibility, &bounty.ReqPeopleCount, &bounty.CreatedAt, &bounty.UpdatedAt, &updated_by, 
			&bounty.Department, &bounty.AcceptedSubmissions)
		if err != nil {
			return bounties, total, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &bounty.JobPayout)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &bounty.BountyFiles)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &bounty.CreatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &bounty.POCMemberID)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &bounty.UpdatedBy)
			if err != nil {
				return bounties, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		bounties = append(bounties, bounty)
	}

	return bounties, total, nil
}

func UpdateBounty(bounty job.Bounty) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE bounty SET title = $2, description = $3, 
		winner_count = $4, start_date = $5, end_date = $6, status = $7, poc_member_id = $8, 
		created_by = $9, skills = $10, tags = $11, visibility = $12, req_people_count = $13, 
		updated_by = $14, department = $15, description_raw = $16, updated_at = CURRENT_TIMESTAMP 
		WHERE bounty_id = $1::uuid`,
		bounty.BountyID, bounty.Title, bounty.Description,
		bounty.WinnerCount, bounty.StartDate, bounty.EndDate, bounty.Status, bounty.POCMemberID,
		bounty.CreatedBy, pq.Array(bounty.Skills), pq.Array(bounty.Tags), bounty.Visibility,
		bounty.ReqPeopleCount, bounty.UpdatedBy, bounty.Department, bounty.DescriptionRaw)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated bounty_id: %s", bounty.BountyID)
	return nil
}

func UpdateBountyStatus(bountyId string, status job.StatusType) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE bounty SET status = $2
	WHERE bounty_id = $1::uuid`,
		bountyId, status)
	if err != nil {
		return fmt.Errorf("failed to update bounty status: %w", err)
	}
	logger.LogMessage("info", "Updated bounty: %s status : %s", bountyId, status)

	return nil
}

func UpdateBountyRemainingRequired(bountyID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE bounty SET remaining_req = remaining_req - 1,
	status = CASE WHEN remaining_req = 1 THEN 'closed' ELSE status END
	WHERE bounty_id = $1::uuid`,
		bountyID)
	if err != nil {
		return fmt.Errorf("failed to update bounty status: %w", err)
	}
	logger.LogMessage("info", "Updated bounty: %s", bountyID)

	return nil
}

func DeleteBounty(bountyID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM bounty WHERE bounty_id = $1::uuid`, bountyID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted bounty_id: %s", bountyID)
	return nil
}

// CreateBountyFile creates a new job file in the database
func CreateBountyFile(params job.BountyFile) (string, error) {
	db := db.GetSQL()
	var bountyFileID string
	err := db.QueryRow(`INSERT INTO bounty_files (bounty_id, name, url, metadata)
		VALUES ($1::uuid, $2, $3, $4) RETURNING bounty_file_id`,
		params.BountyID, params.Name, params.URL, params.Metadata).Scan(&bountyFileID)
	if err != nil {
		return bountyFileID, fmt.Errorf("Error creating job file: %w", err)
	}

	logger.LogMessage("info", "Added file for bounty_id: %s", params.BountyID)
	return bountyFileID, nil
}

// GetBountyFiles returns all job files for a given job
func GetBountyFiles(bountyID string) ([]job.BountyFile, error) {
	db := db.GetSQL()
	var bountyFiles []job.BountyFile
	rows, err := db.Query(`SELECT bounty_file_id, bounty_id, name, url, metadata, created_at
		FROM bounty_files WHERE bounty_id = $1::uuid`, bountyID)
	if err != nil {
		return bountyFiles, fmt.Errorf("Error getting job files: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var bountyFile job.BountyFile
		err := rows.Scan(&bountyFile.BountyFileID, &bountyFile.BountyID, &bountyFile.Name, &bountyFile.URL, &bountyFile.Metadata, &bountyFile.CreatedAt)
		if err != nil {
			return bountyFiles, fmt.Errorf("Error scanning job file: %w", err)
		}
		bountyFiles = append(bountyFiles, bountyFile)
	}

	return bountyFiles, nil
}

// DeleteBountyFile deletes a job file from the database
func DeleteBountyFile(bountyFileID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM bounty_files WHERE bounty_file_id = $1::uuid`, bountyFileID)
	if err != nil {
		return fmt.Errorf("Error deleting job file: %w", err)
	}

	logger.LogMessage("info", "Deleted job file ID: %s", bountyFileID)
	return nil
}
