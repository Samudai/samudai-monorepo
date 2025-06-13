package point

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

func AddTwitterForPoint(twitter point.Twitter) error {
	db := db.GetSQL()
	err := db.QueryRow(`INSERT INTO twitter (point_id, client_type)
		VALUES ($1::uuid, $2) RETURNING twitter_id`,
		twitter.PointID, twitter.ClientType).Scan(&twitter.TwitterID)
	if err != nil {
		return err
	}

	return nil
}

func UpdateTwitterForPoint(twitter point.Twitter) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE twitter SET twitter_username = $2, 
	twitter_user_id = $3, access_token = $4, refresh_token = $5 WHERE point_id =$1::uuid`,
		twitter.PointID, twitter.TwitterUsername, twitter.TwitterUserID, twitter.AccessToken,
		twitter.RefreshToken)
	if err != nil {
		return err
	}

	return nil
}

func UpdateTwitterTokens(pointId, accessToken, refreshToken string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE twitter SET access_token = $2, refresh_token = $3 
	WHERE point_id =$1::uuid`, pointId, accessToken, refreshToken)
	if err != nil {
		return err
	}

	return nil
}

func UpdateTwitterStatus(pointId string, status bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE twitter SET is_active = $2 WHERE point_id = $1::uuid`, pointId, status)
	if err != nil {
		return err
	}

	return nil
}

func GetTwitterByPointID(pointID string) (point.TwitterPointsView, error) {
	db := db.GetSQL()
	var twitter point.TwitterPointsView
	err := db.QueryRow(`SELECT t.point_id, t.twitter_username, t.twitter_user_id, 
	t.access_token, t.refresh_token, t.client_type, t.is_active, tp.tweet_id, tp.follow, tp.mention,
	tp.likes, tp.retweet, tp.quote, tp.hashtag, tp.hashtag_pts FROM twitter t LEFT JOIN twitter_points tp 
	ON tp.point_id = t.point_id WHERE t.point_id = $1`,
		pointID).Scan(&twitter.PointID, &twitter.TwitterUsername,
		&twitter.TwitterUserID, &twitter.AccessToken, &twitter.RefreshToken,
		&twitter.ClientType, &twitter.IsActive, pq.Array(&twitter.TweetID), &twitter.Follow,
		&twitter.Mention, &twitter.Like, &twitter.Retweet, &twitter.Quote,
		&twitter.Hashtag, &twitter.HashtagPoints)
	if err != nil {
		return twitter, err
	}

	return twitter, nil
}

func GetAllTwitterPoint() ([]point.TwitterPointsView, error) {
	db := db.GetSQL()
	var twitters []point.TwitterPointsView
	rows, err := db.Query(`SELECT t.point_id, t.twitter_username, t.twitter_user_id, 
	t.access_token, t.refresh_token, t.client_type, t.is_active, tp.tweet_id, tp.follow, tp.mention,
	tp.likes, tp.retweet, tp.quote, tp.hashtag, tp.hashtag_pts FROM twitter t LEFT JOIN twitter_points tp 
	ON tp.point_id = t.point_id`)
	if err != nil {
		return twitters, err
	}
	defer rows.Close()
	for rows.Next() {
		var twitter point.TwitterPointsView
		err := rows.Scan(&twitter.PointID, &twitter.TwitterUsername,
			&twitter.TwitterUserID, &twitter.AccessToken, &twitter.RefreshToken,
			&twitter.ClientType, &twitter.IsActive, pq.Array(&twitter.TweetID), &twitter.Follow,
			&twitter.Mention, &twitter.Like, &twitter.Retweet, &twitter.Quote,
			&twitter.Hashtag, &twitter.HashtagPoints)
		if err != nil {
			return twitters, err
		}

		twitters = append(twitters, twitter)
	}

	return twitters, nil
}
