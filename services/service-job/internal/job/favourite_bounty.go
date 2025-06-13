package job

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-job/pkg/job"
	"github.com/lib/pq"
)

func CreateFavouriteBounty(favourite job.FavouriteBounty) (string, error) {
	db := db.GetSQL()
	var favouriteID string
	err := db.QueryRow(`INSERT INTO favourite_bounty (bounty_id, member_id) 
		VALUES ($1::uuid, $2::uuid) ON CONFLICT (bounty_id, member_id) DO NOTHING RETURNING id`,
		favourite.BountyID, favourite.MemberID).Scan(&favouriteID)
	if err != nil {
		return favouriteID, err
	}

	return favouriteID, nil
}

func GetFavouriteListBounty(memberID string) ([]job.BountyView, error) {
	db := db.GetSQL()
	var payout, files *string
	var created_by, poc, updated_by *string
	var bounties []job.BountyView
	rows, err := db.Query(`SELECT bv.bounty_id, dao_id, dao_name, project_id, project_name, task_id, task_name, subtask_id, subtask_name,
    title, description, description_raw, winner_count, start_date,
    end_date, status, poc_member, created_by, skills, tags, payout, files,
    visibility, req_people_count, bv.created_at, updated_at, updated_by, department
    FROM bounty_view bv 
    JOIN favourite_bounty fb ON bv.bounty_id = fb.bounty_id 
    WHERE fb.member_id = $1::uuid ORDER BY created_at DESC`, memberID)
	if err != nil {
		return bounties, err
	}

	defer rows.Close()

	for rows.Next() {
		var bounty job.BountyView
		err := rows.Scan(&bounty.BountyID, &bounty.DAOID, &bounty.DAOName, &bounty.ProjectID, &bounty.ProjectName, &bounty.TaskID, &bounty.TaskName, &bounty.SubtaskId, &bounty.SubtaskName,
			&bounty.Title, &bounty.Description, &bounty.DescriptionRaw, &bounty.WinnerCount, &bounty.StartDate,
			&bounty.EndDate, &bounty.Status, &poc, &created_by, pq.Array(&bounty.Skills), pq.Array(&bounty.Tags), &payout, &files,
			&bounty.Visibility, &bounty.ReqPeopleCount, &bounty.CreatedAt, &bounty.UpdatedAt, &updated_by, &bounty.Department)
		if err != nil {
			return bounties, err
		}

		if payout != nil {
			err = json.Unmarshal([]byte(*payout), &bounty.JobPayout)
			if err != nil {
				return bounties, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if files != nil {
			err = json.Unmarshal([]byte(*files), &bounty.BountyFiles)
			if err != nil {
				return bounties, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if created_by != nil {
			err = json.Unmarshal([]byte(*created_by), &bounty.CreatedBy)
			if err != nil {
				return bounties, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if updated_by != nil {
			err = json.Unmarshal([]byte(*updated_by), &bounty.UpdatedBy)
			if err != nil {
				return bounties, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		if poc != nil {
			err = json.Unmarshal([]byte(*poc), &bounty.POCMemberID)
			if err != nil {
				return bounties, fmt.Errorf("error unmarshalling payout: %w", err)
			}
		}

		bounties = append(bounties, bounty)
	}

	return bounties, nil
}

func DeleteFavouriteBounty(bountyID string, memberId string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM favourite_bounty WHERE bounty_id = $1 AND member_id = $2`, bountyID, memberId)
	if err != nil {
		return err
	}

	return nil
}

func GetFavouriteCountByBounty(bountyID string) (int, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT COUNT(*) FROM favourite_bounty WHERE bounty_id = $1::uuid`, bountyID).Scan(&count)
	if err != nil {
		return count, err
	}

	return count, nil
}
