package job

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-job/pkg/job"
	"github.com/lib/pq"
)

func CreateFavourite(favourite job.Favourite) (string, error) {
	db := db.GetSQL()
	var favouriteID string
	err := db.QueryRow(`INSERT INTO favourite_job (job_id, member_id) 
		VALUES ($1::uuid, $2::uuid) ON CONFLICT (job_id, member_id) DO NOTHING RETURNING id`,
		favourite.JobID, favourite.MemberID).Scan(&favouriteID)
	if err != nil {
		return favouriteID, err
	}

	return favouriteID, nil
}

func GetFavouriteList(memberID string) ([]job.OpportunityView, error) {
	db := db.GetSQL()
	var created_by, poc *string
	var jobs []job.OpportunityView
	rows, err := db.Query(`SELECT opp.job_id, dao_id, dao_name, type, project_id, project_name, task_id, task_name, subtask_id, subtask_name,
		title, description, req_people_count, 
		start_date, end_date, github, skills, tags, 
		questions, status, visibility, created_by, poc_member, 
		captain, opp.created_at, opp.updated_at, opp.open_to, opp.experience, opp.job_format
		FROM opportunity_view opp 
		JOIN favourite_job fj ON opp.job_id = fj.job_id
		WHERE fj.member_id = $1::uuid 
		ORDER BY created_at DESC`, memberID)
	if err != nil {
		return jobs, err
	}

	defer rows.Close()

	for rows.Next() {
		var Job job.OpportunityView
		err := rows.Scan(&Job.OpportunityID, &Job.DAOID, &Job.DAOName, &Job.Type, &Job.ProjectID, &Job.ProjectName, &Job.TaskID, &Job.TaskName, &Job.SubtaskId, &Job.SubtaskName,
			&Job.Title, &Job.Description, &Job.ReqPeopleCount,
			&Job.StartDate, &Job.EndDate, &Job.Github, pq.Array(&Job.Skills), pq.Array(&Job.Tags),
			&Job.Questions, &Job.Status, &Job.Visibility, &created_by, &poc,
			&Job.Captain, &Job.CreatedAt, &Job.UpdatedAt, pq.Array(&Job.OpenTo), &Job.Experience, &Job.JobFormat)
		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &Job.CreatedBy)
			if err != nil {
				return jobs, fmt.Errorf("error unmarshalling created_by: %w", err)
			}
		}
		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &Job.POCMemberID)
			if err != nil {
				return jobs, fmt.Errorf("error unmarshalling poc: %w", err)
			}
		}
		if err != nil {
			return jobs, err
		}
		jobs = append(jobs, Job)
	}

	return jobs, nil
}

func DeleteFavourite(jobID string, memberId string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM favourite_job WHERE job_id = $1 AND member_id = $2`, jobID, memberId)
	if err != nil {
		return err
	}

	return nil
}

func GetFavouriteCountByJob(jobID string) (int, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT COUNT(*) FROM favourite_job WHERE job_id = $1::uuid`, jobID).Scan(&count)
	if err != nil {
		return count, err
	}

	return count, nil
}
