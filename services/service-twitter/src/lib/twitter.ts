import { Client } from 'twitter-api-sdk';
import { redis } from '../config/redisConfig';

export class Twitter {
  client: Client;
  constructor() {
    this.client = new Client(process.env.BEARER_TOKEN as string);
  }

  getUser = async (userName: string) => {
    try {
      const res = await this.client.users.findUserByUsername(userName);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  getRecentLastTweet = async (userId: string) => {
    try {
      const res = await this.client.tweets.usersIdTweets(userId);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  getTweet = async (tweetId: string) => {
    try {
      const tweet = await this.client.tweets.findTweetById(tweetId, {
        'tweet.fields': ['author_id', 'created_at', 'public_metrics', 'attachments', 'entities'],
        expansions: ['author_id'],
        'media.fields': ['preview_image_url', 'url'],
        'user.fields': ['id', 'profile_image_url', 'username'],
      });
      return tweet;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  storeTweet = async (linkId: string, username: string) => {
    try {
      const exists = await redis.get(linkId);
      //await redis.del(linkId);
      if (!exists) {
        let tweets = [];
        let pinnedTweet;
        //Get user infp
        const user = await this.client.users.findUserByUsername(username, {
          'user.fields': ['id', 'pinned_tweet_id', 'username', 'profile_image_url'],
        });

        if (user.data?.pinned_tweet_id) {
          pinnedTweet = await this.client.tweets.findTweetById(user.data?.pinned_tweet_id!, {
            'tweet.fields': ['author_id', 'created_at', 'public_metrics', 'attachments', 'entities'],
            expansions: ['author_id'],
            'media.fields': ['preview_image_url', 'url'],
            'user.fields': ['id', 'profile_image_url', 'username'],
          });
        }

        const userTweets = await this.client.tweets.usersIdTweets(user.data?.id!, {
          'tweet.fields': ['author_id', 'created_at', 'public_metrics', 'attachments', 'entities'],
          expansions: ['author_id'],
          'media.fields': ['preview_image_url', 'url'],
          'user.fields': ['id', 'profile_image_url', 'username'],
        });

        const threeTweets = userTweets.data?.slice(0, 3);

        threeTweets?.forEach((tweet) => {
          tweets.push(tweet);
        });

        if (pinnedTweet) {
          const userTweets = await this.client.tweets.usersIdTweets(user.data?.id!, {
            'tweet.fields': ['author_id', 'created_at', 'public_metrics', 'attachments', 'entities'],
            expansions: ['author_id'],
            'media.fields': ['preview_image_url', 'url'],
            'user.fields': ['id', 'profile_image_url', 'username'],
          });

          tweets.unshift(pinnedTweet.data);
        }

        const twitterInfo = {
          user: user.data,
          tweets: tweets,
        };

        //expire after 7 days in redis
        await redis.set(linkId, JSON.stringify(twitterInfo), 'EX', 60 * 60 * 24 * 7);

        return twitterInfo;
      }
      return JSON.parse(exists);
    } catch (err) {
      console.log(err);
      return null;
    }
  };


}
