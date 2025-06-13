package member

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
)

func CreateReward(rewardEarned member.RewardEarned) error {
	db := db.GetSQL()

	_, err := db.Exec(`INSERT INTO rewards_earned (member_id, dao_id, link_id, type, amount, currency) 
		VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6)`,
		rewardEarned.MemberID, rewardEarned.DAOID, rewardEarned.LinkID, rewardEarned.Type, rewardEarned.Amount, rewardEarned.Currency)
	if err != nil {
		return err
	}

	return nil
}

func ListRewardsForMember(memberID string, daoID, Type *string) ([]member.MemberReward, error) {
	db := db.GetSQL()

	rows, err := db.Query(`SELECT member_id, currency, SUM(amount) FROM rewards_earned 
		WHERE member_id = $1::uuid
		AND CASE WHEN $2::uuid IS NULL THEN true ELSE dao_id = $2::uuid END
		AND CASE WHEN $3::text IS NULL THEN true ELSE type = $3::text END
		GROUP BY member_id, currency`, memberID, daoID, Type)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rewards []member.MemberReward
	for rows.Next() {
		var reward member.MemberReward
		err := rows.Scan(&reward.MemberID, &reward.Currency, &reward.Amount)
		if err != nil {
			return nil, err
		}
		rewards = append(rewards, reward)
	}

	return rewards, nil
}
