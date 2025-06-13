package point

import (
	"database/sql"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-point/pkg/point"
)

func AddTwitterMember(twitterMember point.TwitterMember) error {
	db := db.GetSQL()
	err := db.QueryRow(`INSERT INTO twitter_members (member_id, twitter_username, twitter_user_id)
		VALUES ($1::uuid, $2, $3) RETURNING member_id`,
		twitterMember.MemberID, twitterMember.TwitterUsername, twitterMember.TwitterUserID).Scan(&twitterMember.MemberID)
	if err != nil {
		return err
	}

	return nil
}

func UpdateTwitterMember(twitter point.TwitterMember) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE twitter_members SET twitter_username = $2, 
	twitter_user_id = $3 WHERE member_id =$1::uuid`,
		twitter.MemberID, twitter.TwitterUsername, twitter.TwitterUserID)
	if err != nil {
		return err
	}

	return nil
}

func GetTwitterMemberById(memberID string) (point.TwitterMember, error) {
	db := db.GetSQL()
	var twitterMember point.TwitterMember
	err := db.QueryRow(`SELECT member_id, twitter_username, twitter_user_id FROM twitter_members
	 WHERE member_id = $1`,
		memberID).Scan(&twitterMember.MemberID, &twitterMember.TwitterUsername, &twitterMember.TwitterUserID)
	if err != nil {
		return twitterMember, err
	}

	return twitterMember, nil
}

func GetTwitterMemberByUserId(twitterUserId, twitterUsername string) (string, error) {
	db := db.GetSQL()
	var memberId string
	err := db.QueryRow(`SELECT member_id FROM twitter_members
	 WHERE twitter_user_id = $1 AND twitter_username = $2`,
		twitterUserId, twitterUsername).Scan(&memberId)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		}
		return memberId, err
	}

	return memberId, nil
}
