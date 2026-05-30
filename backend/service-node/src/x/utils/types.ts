import { LinkType } from './enums';

export type TwitterMember = {
  twitterUsername: string;
  twitterUserId: string;
  twitterName: string;
};
export type TweetMember = {
  twitterUsername: string;
  twitterUserId: string;
  tweetId: string;
  twitterName: string;
};

export type ActivityGuild = {
  requestType: string;
  description: string;
  point_id: string;
  tweet_id?: string;
  from_twitter_username: string;
  from_twitter_user_id: string;
  to_twitter_username: string;
  to_twitter_user_id: string;
  to_twitter_name: string;
};
