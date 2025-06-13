import axios from 'axios';
import { ActivitySchema } from '../../models/activitySchema';
import { ActivityGuild, TweetMember, TwitterMember } from '../../utils/types';
import { getMongoClient } from '../../utils/mongo';
import { sendTwitterAPIreq } from '../../utils/rmqUtil';
export class ActivityQuery {
  callApi = async (url: string, maxRetries: number = 3, retryDelay: number = 1500) => {
    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await axios.get(url, {
          headers: {
            Accept: 'application/json',
            'x-rapidapi-host': 'twttrapi.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY!,
          },
        });
        if (result.data?.error && result.data?.success === false) {
          console.log(result.data?.error);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          return result;
        }
      }
    } catch (error: any) {
      throw error;
    }
  };
  callTwitterApi = async (url: string, access_token: string, refresh_token: string, point_id: string): Promise<any> => {
    try {
      const result = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + access_token,
        },
      });
      return result;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const result = await this.updateAccessAndRefreshToken(point_id, refresh_token);
        return { access_token: result.access_token, refresh_token: result.refresh_token };
      }
    }
  };

  updateAccessAndRefreshToken = (point_id: string, refreshToken: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
      const details = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.TWITTER_CLIENT_ID!,
      };

      var formBody: any = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property as keyof typeof details);
        var encodedValue = encodeURIComponent(details[property as keyof typeof details]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');

      axios
        .post(tokenUrl, formBody, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          } else {
            throw new Error('Failed to refresh access token');
          }
        })
        .then(async (data) => {
          try {
            await axios.post(`${process.env.SERVICE_POINT}/twitter/updatetokens`, {
              point_id: point_id,
              access_token: data.access_token,
              refresh_token: data.refresh_token,
            });
            console.log('Successfully updated access token for', point_id);
          } catch (error) {
            console.log('Error updating access token');
            throw error;
          }
          resolve({ access_token: data.access_token, refresh_token: data.refresh_token });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };
  checkDbandCollection = async (dbName: string, collectionName: string) => {
    try {
      const dbClient = getMongoClient();
      const adminDb = dbClient.db('admin');
      const databases = await adminDb.admin().listDatabases();
      const dbExists = databases.databases.some((db) => db.name === dbName);
      if (!dbExists) {
        return false;
      } else {
        const db = await dbClient.db(dbName);
        const collection = await db.listCollections().toArray();
        const collectionExists = collection.some((colln) => colln.name === collectionName);
        if (!collectionExists) {
          return false;
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
  sendPayload = async (
    memberArray: TwitterMember[],
    tweetMemberArray: TweetMember[],
    description: string,
    twitter_username: string,
    twitter_userId: string,
    point_id: string
  ) => {
    if (memberArray.length > 0) {
      memberArray?.forEach((member: TwitterMember) => {
        const payload: ActivityGuild = {
          requestType: 'TwitterTip',
          description: description,
          point_id: point_id,
          from_twitter_username: twitter_username,
          from_twitter_user_id: twitter_userId,
          to_twitter_username: member.twitterUsername,
          to_twitter_user_id: member.twitterUserId,
          to_twitter_name: member.twitterName,
        };
        sendTwitterAPIreq(JSON.stringify(payload));
      });
    } else {
      tweetMemberArray?.forEach((tweetmember: TweetMember) => {
        const payload: ActivityGuild = {
          requestType: 'TwitterTip',
          description: description,
          point_id: point_id,
          tweet_id: tweetmember.tweetId,
          from_twitter_username: twitter_username,
          from_twitter_user_id: twitter_userId,
          to_twitter_username: tweetmember.twitterUsername,
          to_twitter_user_id: tweetmember.twitterUserId,
          to_twitter_name: tweetmember.twitterName,
        };
        sendTwitterAPIreq(JSON.stringify(payload));
      });
    }
  };
  addNewFollowers = async (twitter_userId: string, twitter_username: string, point_id: string) => {
    try {
      const dbClient = getMongoClient();
      const username_db = await dbClient.db(twitter_username);
      const follower_collections = await username_db.collection('Followers');
      let new_followers: TwitterMember[] = [];
      let next_cursor: string = '';

      const dbExists = await this.checkDbandCollection(twitter_username, 'Followers');

      // 1. Fetch followers from API calls and compare them against follower_collections till you find a match
      // FETCH ALL FOLLOWER DATA FROM MONGO
      const allFollowersCursor = await follower_collections.find({});
      const allFollowersArray = await allFollowersCursor.toArray();

      // TODO: Change the no of iterations AFTER PURCHASING API
      for (let i = 0; i < 10; i++) {
        const url =
          i === 0
            ? `https://twttrapi.p.rapidapi.com/user-followers?username=${twitter_username}&count=100`
            : `https://twttrapi.p.rapidapi.com/user-followers?username=${twitter_username}&cursor=${next_cursor}&count=100`;

        const rapid_follower_fetch = await this.callApi(url);
        const follower_arr =
          i === 0
            ? rapid_follower_fetch?.data?.data?.user?.timeline_response?.timeline?.instructions[3]?.entries
            : rapid_follower_fetch?.data?.data?.user?.timeline_response?.timeline?.instructions[0]?.entries;
        follower_arr?.forEach(async (follower: any) => {
          if (follower?.content?.__typename === 'TimelineTimelineItem') {
            const user_data = follower?.content?.content?.userResult?.result?.legacy;
            const new_follower: TwitterMember = {
              twitterUsername: user_data?.screen_name,
              twitterUserId: user_data?.id_str,
              twitterName: user_data?.name,
            };

            // TODO: Check how you store in mongo and how it is retrieved from mongo
            if (dbExists) {
              const isNewFollower = !allFollowersArray.some(
                (existingFollower) => existingFollower.twitterUserId === new_follower.twitterUserId
              );
              if (isNewFollower) {
                new_followers.push(new_follower);
              }
            } else {
              new_followers.push(new_follower);
            }
          } else if (
            follower?.content?.__typename === 'TimelineTimelineCursor' &&
            follower?.content?.cursorType === 'Bottom'
          ) {
            next_cursor = follower?.content?.value;
          }
        });
      }
      if (new_followers.length > 0) {
        if (dbExists) {
          this.sendPayload(new_followers, [], 'Follow', twitter_username, twitter_userId, point_id);
        }
        await follower_collections.insertMany(new_followers);
      } else {
        console.log('No new followers to insert.');
      }
    } catch (err: any) {
      throw err;
    }
  };
  addNewMention = async (twitter_userId: string, twitter_username: string, point_id: string) => {
    try {
      const dbClient = getMongoClient();
      const username_db = await dbClient.db(twitter_username);
      const mention_collections = await username_db.collection('mentions');
      let new_mentions: TweetMember[] = [];
      let next_cursor: string = '';

      const dbExists = await this.checkDbandCollection(twitter_username, 'mentions');

      const allMentionsCursor = await mention_collections.find({});
      const allMentionsArray = await allMentionsCursor.toArray();

      // TODO: Change the no of iterations AFTER PURCHASING API
      for (let i = 0; i < 2; i++) {
        const url =
          i === 0
            ? `https://twttrapi.p.rapidapi.com/search-latest?query=%40${twitter_username}`
            : `https://twttrapi.p.rapidapi.com/search-latest?query=%40${twitter_username}&cursor=${next_cursor}`;

        const rapid_mention_fetch = await this.callApi(url);
        const mention_arr =
          rapid_mention_fetch?.data?.data?.search?.timeline_response?.timeline?.instructions[0]?.entries;

        mention_arr?.forEach(async (mention: any) => {
          if (mention?.content?.__typename === 'TimelineTimelineItem') {
            const user_data = mention?.content?.content?.tweetResult?.result?.core?.user_result?.result?.legacy;
            const inReply =
              mention?.content?.content?.tweetResult?.result?.legacy?.conversation_id_str !=
              mention?.content?.content?.tweetResult?.result?.rest_id;
            const new_mention: TweetMember = {
              twitterUsername: user_data?.screen_name,
              twitterUserId: user_data?.id_str,
              twitterName: user_data?.name,
              tweetId: mention?.content?.content?.tweetResult?.result?.rest_id,
            };

            if (dbExists) {
              const isNewMention = !allMentionsArray.some(
                (existingMention) =>
                  existingMention.twitterUserId === new_mention.twitterUserId &&
                  existingMention.tweetId === new_mention.tweetId
              );
              if (isNewMention && new_mention.twitterUserId !== twitter_userId && !inReply) {
                new_mentions.push(new_mention);
              }
            } else {
              if (new_mention.twitterUserId !== twitter_userId && !inReply) {
                new_mentions.push(new_mention);
              }
            }
          } else if (
            mention?.content?.__typename === 'TimelineTimelineCursor' &&
            mention?.content?.cursorType === 'Bottom'
          ) {
            next_cursor = mention?.content?.value;
          }
        });
        if (rapid_mention_fetch?.data?.search?.timeline_response?.timeline?.instructions?.length > 1) {
          next_cursor =
            rapid_mention_fetch?.data?.search?.timeline_response?.timeline?.instructions[2]?.entry?.content?.value;
        }
      }
      if (new_mentions.length > 0) {
        if (dbExists) {
          this.sendPayload([], new_mentions, 'Mention', twitter_username, twitter_userId, point_id);
        }
        await mention_collections.insertMany(new_mentions);
      } else {
        console.log('No new mentions to insert.');
      }
    } catch (err: any) {
      throw err;
    }
  };
  addNewHashtags = async (twitter_userId: string, twitter_username: string, point_id: string, hashtag_val: string) => {
    try {
      const dbClient = getMongoClient();
      const username_db = await dbClient.db(twitter_username);
      const hashtag_collections = await username_db.collection('hashtag');
      let new_hashtags: TweetMember[] = [];
      let next_cursor: string = '';

      const dbExists = await this.checkDbandCollection(twitter_username, 'hashtag');

      const allHashtagsCursor = await hashtag_collections.find({});
      const allHashtagsArray = await allHashtagsCursor.toArray();

      // TODO: Change the no of iterations AFTER PURCHASING API
      for (let i = 0; i < 2; i++) {
        const url =
          i === 0
            ? `https://twttrapi.p.rapidapi.com/search-latest?query=%23${hashtag_val}`
            : `https://twttrapi.p.rapidapi.com/search-latest?query=%23${hashtag_val}&cursor=${next_cursor}`;

        const rapid_hashtag_fetch = await this.callApi(url);
        const hashtag_arr =
          rapid_hashtag_fetch?.data?.data?.search?.timeline_response?.timeline?.instructions[0]?.entries;

        hashtag_arr?.forEach(async (hashtag: any) => {
          if (hashtag?.content?.__typename === 'TimelineTimelineItem') {
            const user_data = hashtag?.content?.content?.tweetResult?.result?.core?.user_result?.result?.legacy;
            const new_hashtag: TweetMember = {
              twitterUsername: user_data?.screen_name,
              twitterUserId: user_data?.id_str,
              twitterName: user_data?.name,
              tweetId: hashtag?.content?.content?.tweetResult?.result?.rest_id,
            };
            if (dbExists) {
              const isNewHashtag = !allHashtagsArray.some(
                (existingHashtag) =>
                  existingHashtag.twitterUserId === new_hashtag.twitterUserId &&
                  existingHashtag.tweetId === new_hashtag.tweetId
              );
              if (isNewHashtag && new_hashtag.twitterUserId !== twitter_userId) {
                new_hashtags.push(new_hashtag);
              }
            } else {
              if (new_hashtag.twitterUserId !== twitter_userId) {
                new_hashtags.push(new_hashtag);
              }
            }
          } else if (
            hashtag?.content?.__typename === 'TimelineTimelineCursor' &&
            hashtag?.content?.cursorType === 'Bottom'
          ) {
            next_cursor = hashtag?.content?.value;
          }
        });
        if (rapid_hashtag_fetch?.data?.search?.timeline_response?.timeline?.instructions?.length > 1) {
          next_cursor =
            rapid_hashtag_fetch?.data?.search?.timeline_response?.timeline?.instructions[2]?.entry?.content?.value;
        }
      }
      if (new_hashtags.length > 0) {
        if (dbExists) {
          this.sendPayload([], new_hashtags, 'Hashtag', twitter_username, twitter_userId, point_id);
        }
        await hashtag_collections.insertMany(new_hashtags);
      } else {
        console.log('No new hashtags to insert.');
      }
    } catch (err: any) {
      throw err;
    }
  };
  addNewRetweets = async (twitter_userId: string, twitter_username: string, point_id: string, tweet_id: string) => {
    try {
      const dbClient = getMongoClient();
      const tweet_db = await dbClient.db(tweet_id);
      const tweet_collections = await tweet_db.collection('Retweets');
      let new_retweets: TwitterMember[] = [];
      let next_cursor: string = '';

      const dbExists = await this.checkDbandCollection(tweet_id, 'Retweets');

      const allRetweetsCursor = await tweet_collections.find({});
      const allRetweetsArray = await allRetweetsCursor.toArray();

      // TODO: Change the no of iterations AFTER PURCHASING API
      for (let i = 0; i < 2; i++) {
        const url =
          i === 0
            ? `https://twttrapi.p.rapidapi.com/reposted-timeline?tweet_id=${tweet_id}`
            : `https://twttrapi.p.rapidapi.com/reposted-timeline?tweet_id=${tweet_id}&cursor=${next_cursor}`;

        const rapid_retweets_fetch = await this.callApi(url);
        const retweet_arr = rapid_retweets_fetch?.data?.data?.timeline_response?.timeline?.instructions[0]?.entries;

        if (
          rapid_retweets_fetch?.data?.timeline_response?.timeline?.instructions[1]?.__typename ===
          'TimelineTerminateTimeline'
        ) {
          break;
        }

        retweet_arr?.forEach(async (retweet: any) => {
          if (retweet?.content?.__typename === 'TimelineTimelineItem') {
            const user_data = retweet?.content?.content?.userResult?.result?.legacy;
            const new_retweet: TwitterMember = {
              twitterUsername: user_data?.screen_name,
              twitterUserId: user_data?.id_str,
              twitterName: user_data?.name,
            };
            if (dbExists) {
              // TODO: Check how you store in mongo and how it is retrieved from mongo
              const isNewRetweet = !allRetweetsArray.some(
                (existingRetweet) => existingRetweet.twitterUserId === new_retweet.twitterUserId
              );
              if (isNewRetweet) {
                new_retweets.push(new_retweet);
              }
            } else {
              new_retweets.push(new_retweet);
            }
          } else if (
            retweet?.content?.__typename === 'TimelineTimelineCursor' &&
            retweet?.content?.cursorType === 'Bottom'
          ) {
            next_cursor = retweet?.content?.value;
          }
        });
      }
      if (new_retweets.length > 0) {
        this.sendPayload(new_retweets, [], 'Retweet', twitter_username, twitter_userId, point_id);
        await tweet_collections.insertMany(new_retweets);
      } else {
        console.log('No new retweets to insert.');
      }
    } catch (err: any) {
      throw err;
    }
  };
  addNewLikes = async (
    twitter_userId: string,
    twitter_username: string,
    point_id: string,
    tweet_id: string,
    access_token: string,
    refresh_token: string
  ) => {
    try {
      const dbClient = getMongoClient();
      const tweet_db = await dbClient.db(tweet_id);
      const tweet_collections = await tweet_db.collection('Likes');
      let new_likes: TwitterMember[] = [];
      let next_cursor: string = '';

      const dbExists = await this.checkDbandCollection(tweet_id, 'Likes');

      const allLikesCursor = await tweet_collections.find({});
      const allLikesArray = await allLikesCursor.toArray();
      let new_access_token = '';
      let new_refresh_token = '';

      // TODO: Change the no of iterations AFTER PURCHASING API
      for (let i = 0; i < 5; i++) {
        const url =
          i === 0
            ? `https://api.twitter.com/2/tweets/${tweet_id}/liking_users?max_results=100`
            : `https://api.twitter.com/2/tweets/${tweet_id}/liking_users?max_results=100&pagination_token=${next_cursor}`;

        let x_likes_fetch = await this.callTwitterApi(
          url,
          new_access_token === '' ? access_token : new_access_token,
          new_refresh_token === '' ? refresh_token : new_refresh_token,
          point_id
        );
        if (x_likes_fetch?.access_token) {
          new_access_token = x_likes_fetch.access_token;
          new_refresh_token = x_likes_fetch.refresh_token;
          x_likes_fetch = await this.callTwitterApi(url, new_access_token, refresh_token, point_id);
        }
        const likes_arr = x_likes_fetch?.data?.data;

        if (x_likes_fetch?.data?.meta?.result_count === 0) {
          break;
        }

        likes_arr?.forEach(async (like: any) => {
          const new_like: TwitterMember = {
            twitterUsername: like.username,
            twitterUserId: like.id,
            twitterName: like.name,
          };
          if (dbExists) {
            // TODO: Check how you store in mongo and how it is retrieved from mongo
            const isNewLike = !allLikesArray.some(
              (existingLike) => existingLike.twitterUserId === new_like.twitterUserId
            );
            if (isNewLike) {
              new_likes.push(new_like);
            }
          } else {
            new_likes.push(new_like);
          }
        });
        next_cursor = x_likes_fetch?.data?.meta?.next_token || '';
      }
      if (new_likes.length > 0) {
        this.sendPayload(new_likes, [], 'Like', twitter_username, twitter_userId, point_id);
        await tweet_collections.insertMany(new_likes);
      } else {
        console.log('No new likes to insert.');
      }
      return { access_token: new_access_token, refresh_token: new_refresh_token };
    } catch (err: any) {
      throw err;
    }
  };
  addNewQuotes = async (
    twitter_userId: string,
    twitter_username: string,
    point_id: string,
    tweet_id: string,
    access_token: string,
    refresh_token: string
  ) => {
    try {
      const dbClient = getMongoClient();
      const tweet_db = await dbClient.db(tweet_id);
      const tweet_collections = await tweet_db.collection('Quotes');
      let new_qts: TwitterMember[] = [];
      let new_access_token = '';
      let new_refresh_token = '';

      const dbExists = await this.checkDbandCollection(tweet_id, 'Quotes');

      const allQuotesCursor = await tweet_collections.find({});
      const allQuotesArray = await allQuotesCursor.toArray();

      const url = `https://api.twitter.com/2/tweets/${tweet_id}/quote_tweets?max_results=100&expansions=author_id`;

      let x_qts_fetch = await this.callTwitterApi(
        url,
        new_access_token === '' ? access_token : new_access_token,
        new_refresh_token === '' ? refresh_token : new_refresh_token,
        point_id
      );
      if (x_qts_fetch?.access_token) {
        new_access_token = x_qts_fetch.access_token;
        new_refresh_token = x_qts_fetch.refresh_token;
        x_qts_fetch = await this.callTwitterApi(url, new_access_token, refresh_token, point_id);
      }
      const qts_arr = x_qts_fetch?.data?.includes?.users;

      qts_arr?.forEach(async (qt: any) => {
        const new_qt: TwitterMember = {
          twitterUsername: qt.username,
          twitterUserId: qt.id,
          twitterName: qt.name,
        };
        if (dbExists) {
          // TODO: Check how you store in mongo and how it is retrieved from mongo
          const isNewQuote = !allQuotesArray.some((existingQt) => existingQt.twitterUserId === new_qt.twitterUserId);
          if (isNewQuote) {
            new_qts.push(new_qt);
          }
        } else {
          new_qts.push(new_qt);
        }
      });
      if (new_qts.length > 0) {
        this.sendPayload(new_qts, [], 'Quotes', twitter_username, twitter_userId, point_id);
        await tweet_collections.insertMany(new_qts);
      } else {
        console.log('No new qts to insert.');
      }
      return { access_token: new_access_token, refresh_token: new_refresh_token };
    } catch (err: any) {
      throw err;
    }
  };
}
