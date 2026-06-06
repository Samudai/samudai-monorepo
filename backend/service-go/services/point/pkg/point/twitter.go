package point

type Twitter struct {
	PointID         string `json:"point_id,omitempty"`
	TwitterID       string `json:"twitter_id,omitempty"`
	TwitterUsername string `json:"twitter_username"`
	TwitterUserID   string `json:"twitter_user_id"`
	AccessToken     string `json:"access_token"`
	RefreshToken    string `json:"refresh_token"`
	ClientType      string `json:"client_type"`
}

type TwitterMember struct {
	MemberID        string `json:"member_id,omitempty"`
	TwitterUsername string `json:"twitter_username"`
	TwitterUserID   string `json:"twitter_user_id"`
}

type TwitterPoints struct {
	PointID       string   `json:"point_id"`
	TweetID       []string `json:"tweet_id"`
	Follow        int      `json:"follow"`
	Mention       int      `json:"mention"`
	Like          int      `json:"likes"`
	Retweet       int      `json:"retweet"`
	Quote         int      `json:"quote"`
	Hashtag       *string  `json:"hashtag"`
	HashtagPoints int      `json:"hashtag_pts"`
}

type TwitterPointsView struct {
	PointID         string   `json:"point_id"`
	TwitterUsername *string  `json:"twitter_username"`
	TwitterUserID   *string  `json:"twitter_user_id"`
	AccessToken     *string  `json:"access_token"`
	RefreshToken    *string  `json:"refresh_token"`
	ClientType      string   `json:"client_type"`
	IsActive        bool     `json:"is_active"`
	TweetID         []string `json:"tweet_id"`
	Follow          int      `json:"follow"`
	Mention         int      `json:"mention"`
	Like            int      `json:"likes"`
	Retweet         int      `json:"retweet"`
	Quote           int      `json:"quote"`
	Hashtag         *string  `json:"hashtag"`
	HashtagPoints   int      `json:"hashtag_pts"`
}
