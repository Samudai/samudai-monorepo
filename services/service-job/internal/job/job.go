package job

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-job/pkg/job"
	"github.com/lib/pq"
)

func CreateOpportunity(Job job.Opportunity) (string, error) {
	db := db.GetSQL()
	var jobID string

	err := db.QueryRow(`INSERT INTO opportunity (dao_id, type, project_id, task_id, subtask_id, title, 
		description, description_raw, req_people_count, start_date, 
		end_date, github, skills, tags, questions, 
		status, visibility, created_by, poc_member_id, captain,
		department, open_to, experience, job_format, remaining_req, transaction_count)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $9, $25)
		RETURNING job_id`, Job.DAOID, Job.Type, Job.ProjectID, Job.TaskID, Job.SubtaskId, Job.Title,
		Job.Description, Job.DescriptionRaw, Job.ReqPeopleCount, Job.StartDate,
		Job.EndDate, Job.Github, pq.Array(Job.Skills), pq.Array(Job.Tags), Job.Questions,
		Job.Status, Job.Visibility, Job.CreatedBy, Job.POCMemberID, Job.Captain, Job.Department, pq.Array(Job.OpenTo), Job.Experience, 
		Job.JobFormat, Job.TransactionCount).Scan(&jobID)
	if err != nil {
		return jobID, fmt.Errorf("Error executing statement: %w", err)
	}

	logger.LogMessage("info", "Added Job ID: %s", jobID)
	return jobID, nil
}

func GetTotalJobsPosted(daoID string, projectID string) (int, error) {
	db := db.GetSQL()
	fmt.Println(
		"I am in GetTotalJobsPosted",
	)
	var totaljobs int
	err := db.QueryRow(`SELECT count(*) FROM opportunity WHERE dao_id = $1 and project_id = $2`, daoID, projectID).Scan(&totaljobs)

	if err != nil {
		return totaljobs, err
	}

	return totaljobs, nil

}

func SearchNFilterJob(query *string, userDAOIDs []string, filter *job.FilterJob, Type job.JobType, limit, offset *int) ([]job.OpportunityView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var opportunities []job.OpportunityView
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
	rows, err := db.Query(`SELECT count(*) over() as total, job_id, dao_id, dao_name, type, project_id, project_name, task_id, task_name,
		subtask_id, subtask_name, title, description, description_raw, req_people_count, 
		start_date, end_date, github, skills, tags, payout,
		questions, status, visibility, created_by, poc_member, files,
		captain, created_at, updated_at, department, open_to, experience, job_format, updated_by
		FROM opportunity_view
		WHERE status = 'open' AND captain = false AND (dao_id = ANY($1) OR visibility = 'public') AND type = $7
		AND CASE WHEN $2::uuid[] IS NOT NULL THEN dao_id = ANY($2) ELSE true END
		AND CASE WHEN $3::text[] IS NOT NULL THEN tags && $3 ELSE true END
		AND CASE WHEN $4::text[] IS NOT NULL THEN skills && $4 ELSE true END
		AND CASE WHEN $5::int IS NOT NULL THEN (json_extract_path_text(opportunity_view.payout, 'payout_amount')::integer) >= $5 ELSE true END
		AND CASE WHEN $6::int IS NOT NULL THEN (json_extract_path_text(opportunity_view.payout, 'payout_amount')::integer) <= $6 ELSE true END
		ORDER BY created_at DESC
		LIMIT $8 OFFSET $9`,
		pq.StringArray(userDAOIDs), daos, tags, skills, payoutAmountMin, payoutAmountMax, Type, limit, offset)
	if err != nil {
		return opportunities, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var Job job.OpportunityView
		err := rows.Scan(&total, &Job.OpportunityID, &Job.DAOID, &Job.DAOName, &Job.Type, &Job.ProjectID, &Job.ProjectName, &Job.TaskID, &Job.TaskName, &Job.SubtaskId, &Job.SubtaskName,
			&Job.Title, &Job.Description, &Job.DescriptionRaw, &Job.ReqPeopleCount,
			&Job.StartDate, &Job.EndDate, &Job.Github, pq.Array(&Job.Skills), pq.Array(&Job.Tags), &payout,
			&Job.Questions, &Job.Status, &Job.Visibility, &created_by, &poc, &files,
			&Job.Captain, &Job.CreatedAt, &Job.UpdatedAt, &Job.Department, pq.Array(&Job.OpenTo), &Job.Experience, &Job.JobFormat, &updated_by)
		if err != nil {
			return opportunities, total, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &Job.JobPayout)
			if err != nil {
				return opportunities, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &Job.JobFiles)
			if err != nil {
				return opportunities, total, fmt.Errorf("error unmarshalling files: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &Job.CreatedBy)
			if err != nil {
				return opportunities, total, fmt.Errorf("error unmarshalling create_by: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &Job.POCMemberID)
			if err != nil {
				return opportunities, total, fmt.Errorf("error unmarshalling poc: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &Job.UpdatedBy)
			if err != nil {
				return opportunities, total, fmt.Errorf("error unmarshalling updated_by: %w", err)
			}
		}
		opportunities = append(opportunities, Job)
	}

	return opportunities, total, nil
}

func GetOpportunityCreatedBy(memberID string, limit, offset *int) ([]job.OpportunityView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var jobs []job.OpportunityView
	rows, err := db.Query(`SELECT count(*) over() as total, job_id, dao_id, dao_name, type, project_id, project_name, task_id, task_name, subtask_id, subtask_name, 
		title, description, description_raw, req_people_count, 
		start_date, end_date, github, skills, tags, payout, 
		questions, status, visibility, created_by, poc_member, files,
		captain, created_at, updated_at, department, open_to, experience, job_format, updated_by
		FROM opportunity_view
		WHERE json_extract_path_text(opportunity_view.created_by, 'member_id')::uuid = $1::uuid
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, memberID, limit, offset)
	if err != nil {
		return jobs, total, err
	}
	defer rows.Close()

	for rows.Next() {
		var Job job.OpportunityView
		err := rows.Scan(&total, &Job.OpportunityID, &Job.DAOID, &Job.DAOName, &Job.Type, &Job.ProjectID, &Job.ProjectName, &Job.TaskID, &Job.TaskName, &Job.SubtaskId, &Job.SubtaskName,
			&Job.Title, &Job.Description, &Job.DescriptionRaw, &Job.ReqPeopleCount,
			&Job.StartDate, &Job.EndDate, &Job.Github, pq.Array(&Job.Skills), pq.Array(&Job.Tags), &payout,
			&Job.Questions, &Job.Status, &Job.Visibility, &created_by, &poc, &files,
			&Job.Captain, &Job.CreatedAt, &Job.UpdatedAt, &Job.Department, pq.Array(&Job.OpenTo), &Job.Experience, &Job.JobFormat, &updated_by)
		if err != nil {
			return jobs, total, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &Job.JobPayout)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &Job.JobFiles)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling files: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &Job.CreatedBy)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling created_by: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &Job.POCMemberID)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling poc: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &Job.UpdatedBy)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling updated_by: %w", err)
			}
		}

		jobs = append(jobs, Job)
	}

	return jobs, total, nil
}

func GetOpportunityByDAOID(daoID string, limit, offset *int) ([]job.OpportunityView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var jobs []job.OpportunityView
	rows, err := db.Query(`SELECT count(*) over() as total, job_id, dao_id, dao_name, type, project_id, project_name, task_id, task_name,
		subtask_id, subtask_name, title, description, description_raw, req_people_count, total_applicant_count, 
		start_date, end_date, github, skills, tags, payout, 
		questions, status, visibility, created_by, poc_member, files,
		captain, created_at, updated_at, department, open_to, experience, job_format, updated_by
		FROM opportunity_view
		WHERE dao_id = $1::uuid
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, daoID, limit, offset)
	if err != nil {
		return jobs, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var Job job.OpportunityView
		err := rows.Scan(&total, &Job.OpportunityID, &Job.DAOID, &Job.DAOName, &Job.Type, &Job.ProjectID, &Job.ProjectName, &Job.TaskID, &Job.TaskName,
			&Job.SubtaskId, &Job.SubtaskName, &Job.Title, &Job.Description, &Job.DescriptionRaw, &Job.ReqPeopleCount, &Job.TotalApplicantCount,
			&Job.StartDate, &Job.EndDate, &Job.Github, pq.Array(&Job.Skills), pq.Array(&Job.Tags), &payout,
			&Job.Questions, &Job.Status, &Job.Visibility, &created_by, &poc, &files,
			&Job.Captain, &Job.CreatedAt, &Job.UpdatedAt, &Job.Department, pq.Array(&Job.OpenTo), &Job.Experience, &Job.JobFormat, &updated_by)
		if err != nil {
			return jobs, total, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &Job.JobPayout)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &Job.JobFiles)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling files: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &Job.CreatedBy)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling created_by: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &Job.POCMemberID)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling poc: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &Job.UpdatedBy)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling updated_by: %w", err)
			}
		}

		jobs = append(jobs, Job)
	}

	return jobs, total, nil
}

func GetPublicOpportunities(query string, limit, offset *int, DaoNamesList *[]string, skillList *[]string) ([]job.OpportunityView, int, error) {
	db := db.GetSQL()
	var total int
	var payout, files *string
	var created_by, poc, updated_by *string
	var jobs []job.OpportunityView

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

	rows, err := db.Query(`SELECT count(*) over() as total, job_id, dao_id, dao_name, type, project_id, project_name, task_id, task_name,
		subtask_id, subtask_name, title, description, description_raw, req_people_count, 
		start_date, end_date, github, skills, tags, payout, 
		questions, status, visibility, created_by, poc_member, files,
		captain, created_at, updated_at, department, open_to, experience, job_format, updated_by
		FROM opportunity_view
		WHERE visibility = $1 
		AND title ~* $6 
		AND (CASE WHEN $4::text[] IS NOT NULL THEN dao_name = ANY($4::text[]) ELSE true END)
		AND (CASE WHEN $5::text[] IS NOT NULL THEN skills && $5::text[] ELSE true END)
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, job.VisibilityTypePublic, limit, offset, daoNames, skills, query)
	if err != nil {
		return jobs, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var Job job.OpportunityView
		err := rows.Scan(&total, &Job.OpportunityID, &Job.DAOID, &Job.DAOName, &Job.Type, &Job.ProjectID, &Job.ProjectName, &Job.TaskID, &Job.TaskName, &Job.SubtaskId, &Job.SubtaskName,
			&Job.Title, &Job.Description, &Job.DescriptionRaw, &Job.ReqPeopleCount,
			&Job.StartDate, &Job.EndDate, &Job.Github, pq.Array(&Job.Skills), pq.Array(&Job.Tags), &payout,
			&Job.Questions, &Job.Status, &Job.Visibility, &created_by, &poc, &files,
			&Job.Captain, &Job.CreatedAt, &Job.UpdatedAt, &Job.Department, pq.Array(&Job.OpenTo), &Job.Experience, &Job.JobFormat, &updated_by)

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &Job.JobPayout)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &Job.JobFiles)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling files: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &Job.CreatedBy)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling created_by: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &Job.POCMemberID)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling poc: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &Job.UpdatedBy)
			if err != nil {
				return jobs, total, fmt.Errorf("error unmarshalling updated_by: %w", err)
			}
		}

		if err != nil {
			return jobs, total, err
		}
		jobs = append(jobs, Job)
	}

	return jobs, total, nil
}

func GetOpportunityByID(jobID string) (job.OpportunityView, error) {
	db := db.GetSQL()
	var payout, files *string
	var created_by, poc, updated_by *string
	var Job job.OpportunityView
	err := db.QueryRow(`SELECT job_id, dao_id, dao_name, type, project_id, project_name, task_id, task_name,
		subtask_id, subtask_name, title, description, description_raw, req_people_count, 
		start_date, end_date, github, skills, tags, payout,  
		questions, status, visibility, created_by, poc_member, files,
		captain, created_at, updated_at, department, open_to, experience, job_format, updated_by, 
		transaction_count, accepted_applicants
		FROM opportunity_view
		WHERE job_id = $1::uuid`, jobID).Scan(&Job.OpportunityID, &Job.DAOID, &Job.DAOName, &Job.Type, &Job.ProjectID, &Job.ProjectName, &Job.TaskID, &Job.TaskName,
		&Job.SubtaskId, &Job.SubtaskName, &Job.Title, &Job.Description, &Job.DescriptionRaw, &Job.ReqPeopleCount,
		&Job.StartDate, &Job.EndDate, &Job.Github, pq.Array(&Job.Skills), pq.Array(&Job.Tags), &payout,
		&Job.Questions, &Job.Status, &Job.Visibility, &created_by, &poc, &files,
		&Job.Captain, &Job.CreatedAt, &Job.UpdatedAt, &Job.Department, pq.Array(&Job.OpenTo), &Job.Experience, 
		&Job.JobFormat, &updated_by, &Job.TransactionCount, &Job.AcceptedApplicants)

	if payout != nil {
		err = json.Unmarshal([]byte(*payout), &Job.JobPayout)
		if err != nil {
			return Job, fmt.Errorf("error unmarshalling payout: %w", err)
		}
	}

	if files != nil {
		err = json.Unmarshal([]byte(*files), &Job.JobFiles)
		if err != nil {
			return Job, fmt.Errorf("error unmarshalling files: %w", err)
		}
	}

	if created_by != nil {
		err = json.Unmarshal([]byte(*created_by), &Job.CreatedBy)
		if err != nil {
			return Job, fmt.Errorf("error unmarshalling created_by: %w", err)
		}
	}

	if poc != nil {
		err = json.Unmarshal([]byte(*poc), &Job.POCMemberID)
		if err != nil {
			return Job, fmt.Errorf("error unmarshalling poc: %w", err)
		}
	}

	if updated_by != nil {
		err = json.Unmarshal([]byte(*updated_by), &Job.UpdatedBy)
		if err != nil {
			return Job, fmt.Errorf("error unmarshalling updated_by: %w", err)
		}
	}

	if err != nil {
		return Job, err
	}

	return Job, nil
}

func UpdateOpportunity(param job.Opportunity) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE opportunity SET title = $2, description = $3, 
		req_people_count = $4, start_date = $5, end_date = $6, github = $7, poc_member_id = $8, 
		task_id = $9, skills = $10, tags = $11, questions = $12, status = $13, 
		visibility = $14, captain = $15, department = $16, open_to = $17, experience = $18, job_format = $19, updated_by = $20, 
		description_raw = $21, updated_at = CURRENT_TIMESTAMP 
		WHERE job_id = $1::uuid`,
		param.OpportunityID, param.Title, param.Description,
		param.ReqPeopleCount, param.StartDate, param.EndDate, param.Github, param.POCMemberID,
		param.TaskID, pq.Array(param.Skills), pq.Array(param.Tags), param.Questions, param.Status,
		param.Visibility, param.Captain, param.Department, pq.Array(param.OpenTo), param.Experience, param.JobFormat, param.UpdatedBy, param.DescriptionRaw)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated Job ID: %s", param.OpportunityID)
	return nil
}

func UpdateJobStatus(opportunityId string, status job.StatusType, updatedBy string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE opportunity SET status = $2, updated_by = $3
	WHERE job_id = $1::uuid`,
		opportunityId, status, updatedBy)
	if err != nil {
		return fmt.Errorf("failed to update opportunity status: %w", err)
	}
	logger.LogMessage("info", "Updated opportunity: %s status : %s", opportunityId, status)

	return nil
}

func UpdateJobRemainingRequired(jobID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE opportunity SET remaining_req = remaining_req - 1,
	status = CASE WHEN remaining_req = 1 THEN 'closed' ELSE status END
	WHERE job_id = $1::uuid`,
		jobID)
	if err != nil {
		return fmt.Errorf("failed to update opportunity status: %w", err)
	}
	logger.LogMessage("info", "Updated opportunity: %s", jobID)

	return nil
}

func DeleteOpportunity(jobID string) error {
	db := db.GetSQL()
	_, err := db.Exec("DELETE FROM opportunity WHERE job_id = $1::uuid", jobID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted Job ID: %s", jobID)
	return nil
}

// CreateJobFile creates a new job file in the database
func CreateJobFile(params job.JobFile) (string, error) {
	db := db.GetSQL()
	var jobFileID string
	err := db.QueryRow(`INSERT INTO job_files (job_id, name, url, metadata)
		VALUES ($1::uuid, $2, $3, $4) RETURNING job_file_id`,
		params.JobID, params.Name, params.URL, params.Metadata).Scan(&jobFileID)
	if err != nil {
		return jobFileID, fmt.Errorf("Error creating job file: %w", err)
	}

	logger.LogMessage("info", "Added file for job_id: %s", params.JobID)
	return jobFileID, nil
}

// GetJobFiles returns all job files for a given job
func GetJobFiles(jobID string) ([]job.JobFile, error) {
	db := db.GetSQL()
	var jobFiles []job.JobFile
	rows, err := db.Query(`SELECT job_file_id, job_id, name, url, metadata, created_at
		FROM job_files WHERE job_id = $1::uuid`, jobID)
	if err != nil {
		return jobFiles, fmt.Errorf("Error getting job files: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var jobFile job.JobFile
		err := rows.Scan(&jobFile.JobFileID, &jobFile.JobID, &jobFile.Name, &jobFile.URL, &jobFile.Metadata, &jobFile.CreatedAt)
		if err != nil {
			return jobFiles, fmt.Errorf("Error scanning job file: %w", err)
		}
		jobFiles = append(jobFiles, jobFile)
	}

	return jobFiles, nil
}

// DeleteJobFile deletes a job file from the database
func DeleteJobFile(jobFileID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM job_files WHERE job_file_id = $1::uuid`, jobFileID)
	if err != nil {
		return fmt.Errorf("Error deleting job file: %w", err)
	}

	logger.LogMessage("info", "Deleted job file ID: %s", jobFileID)
	return nil
}
