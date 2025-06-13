package member

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
)

func UpdateXUser(UpdateXcasterUser member.UpdateXUser) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE xcaster_users SET x_username = $1 WHERE member_id = $2::uuid`, UpdateXcasterUser.XUsername, UpdateXcasterUser.MemberID)

	if err != nil {
		return err
	}

	return nil
}
func UpdateWarpcastUser(UpdateXcasterUser member.UpdateWarpcastUser) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE xcaster_users SET  warpcast_username= $1 WHERE member_id = $2::uuid`, UpdateXcasterUser.WarpcastUsername, UpdateXcasterUser.MemberID)

	if err != nil {
		return err
	}

	return nil
}

func AddXcasterUser(XcasterUser member.XcasterUser) error {
	db := db.GetSQL()

	_, err := db.Exec(`INSERT INTO xcaster_users (member_id,connected_acc) VALUES ($1,$2)`,
		XcasterUser.MemberID, false)

	if err != nil {
		return err
	}

	return nil
}
func FetchXcasterUser(memberId string) (*member.XcasterUserInfo, error) {
	db := db.GetSQL()

	var XcasterUser member.XcasterUserInfo

	err := db.QueryRow(`SELECT member_id, x_username, warpcast_username
		FROM xcaster_users
		WHERE member_id = $1`, memberId).Scan(&XcasterUser.MemberID, &XcasterUser.XUsername, &XcasterUser.WarpcastUsername)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &XcasterUser, nil
}

func AddCoposterUser(CoposterUser member.CoposterUser) (string, error) {
	db := db.GetSQL()
	var CoposterUserId string

	err := db.QueryRow(`INSERT INTO coposter_users (member_id, signer_uuid, fid, is_authenticated) 
                    VALUES ($1::uuid, $2, $3, $4) 
                    ON CONFLICT (member_id) DO UPDATE
                    SET signer_uuid = $2, fid = $3, is_authenticated = $4
                    RETURNING coposter_user_id`,
    CoposterUser.MemberID, CoposterUser.SignerUuid, CoposterUser.FID, CoposterUser.IsAuthenticated).Scan(&CoposterUserId)
	if err != nil {
		return CoposterUserId, err
	}

	return CoposterUserId, nil
}

func GetCoposterUserById(CoposterUserId string) (member.CoposterUser, error) {
	db := db.GetSQL()
	var coposterUser member.CoposterUser
	err := db.QueryRow(`SELECT coposter_user_id, signer_uuid, fid, is_authenticated FROM coposter_users WHERE 
	coposter_user_id = $1`, CoposterUserId).Scan(&coposterUser.CoposterUserID, &coposterUser.SignerUuid, &coposterUser.FID, &coposterUser.IsAuthenticated)
	if err != nil {
		if err == sql.ErrNoRows {
			return coposterUser, nil
		}
		return coposterUser, err
	}

	return coposterUser, nil
}

func AddTweet(TweetInfo member.TweetInfo) error {
	db := db.GetSQL()
	tweetsJSON, err := json.Marshal(TweetInfo.Tweets)
	if err != nil {
		return fmt.Errorf("error marshalling featured projects: %w", err)
	}

	_, err = db.Exec(`INSERT INTO xcaster_tweet (member_id,tweets) VALUES ($1, $2) `,
		TweetInfo.MemberID, tweetsJSON)
	if err != nil {
		return err
	}

	return nil
}

func AddCast(CastInfo member.CastInfo) error {
	db := db.GetSQL()
	castsJSON, err := json.Marshal(CastInfo.Casts)
	if err != nil {
		return fmt.Errorf("error marshalling featured projects: %w", err)
	}
	_, err = db.Exec(`INSERT INTO xcaster_casts (member_id,casts) VALUES ($1, $2) `,
		CastInfo.MemberID, castsJSON)
	if err != nil {
		return err
	}

	return nil
}
