package point

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

func AddTwitterPoints(twitterpoints point.TwitterPoints) error {
	db := db.GetSQL()
	err := db.QueryRow(`INSERT INTO twitter_points (point_id, tweet_id, follow, mention, likes, retweet, quote, hashtag, hashtag_pts)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING point_id`,
		twitterpoints.PointID, pq.Array(twitterpoints.TweetID), twitterpoints.Follow,
		twitterpoints.Mention, twitterpoints.Like, twitterpoints.Retweet,
		twitterpoints.Quote, twitterpoints.Hashtag, twitterpoints.HashtagPoints).Scan(&twitterpoints.PointID)
	if err != nil {
		return err
	}

	return nil
}

func UpdateTwitterPoints(twitterpoints point.TwitterPoints) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE twitter_points SET follow = $2, mention = $3, likes = $4, 
	retweet = $5, quote = $6, hashtag = $7, hashtag_pts = $8, tweet_id = $9 WHERE point_id = $1::uuid`, twitterpoints.PointID,
		twitterpoints.Follow, twitterpoints.Mention, twitterpoints.Like, twitterpoints.Retweet,
		twitterpoints.Quote, twitterpoints.Hashtag, twitterpoints.HashtagPoints, pq.Array(twitterpoints.TweetID))
	if err != nil {
		return err
	}

	return nil
}

func GetTwitterPointsByPointId(pointID string) (point.TwitterPoints, error) {
	db := db.GetSQL()
	var twitterpoints point.TwitterPoints
	err := db.QueryRow(`SELECT point_id, tweet_id, follow, mention, likes, retweet, 
	quote, hashtag, hashtag_pts FROM twitter_points WHERE point_id = $1::uuid`, pointID).Scan(&twitterpoints.PointID, pq.Array(&twitterpoints.TweetID),
		&twitterpoints.Follow, &twitterpoints.Mention, &twitterpoints.Like, &twitterpoints.Retweet, &twitterpoints.Quote,
		&twitterpoints.Hashtag, &twitterpoints.HashtagPoints)
	if err != nil {
		return twitterpoints, err
	}

	return twitterpoints, nil
}
