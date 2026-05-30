import { Request, Response } from 'express';
import { ActivityQuery } from './query/activity';
import { createDecipheriv } from 'crypto';

export class ActivityController {
  ActivityQuery: ActivityQuery;

  constructor() {
    this.ActivityQuery = new ActivityQuery();
  }

  decrypt = (encryptedText: string) => {
    const contents = Buffer.from(encryptedText, 'hex');
    const iv = contents.subarray(0, 16);
    const textBytes = contents.subarray(16);

    const decipher = createDecipheriv('aes-256-cbc', process.env.DECRYPTION_KEY!, iv);
    let decrypted = decipher.update(textBytes).toString();
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  fetchNewTwitterActivity = async (req: Request, res: Response) => {
    try {
      const twitter_userId: string = req.body.twitter_userId;
      const tweet_id: string = req.body.tweet_id;
      let access_token: string = req.body.access_token;
      let refresh_token: string = req.body.refresh_token;
      const twitter_username: string = req.body.twitter_username;
      const point_id: string = req.body.point_id;
      const hashtag: string = req.body.hashtag;
      const actions: string[] = req.body.actions;
      let decrypted_token: string = this.decrypt(access_token)!;
      let decrypted_refreshtoken: string = this.decrypt(refresh_token)!;

      console.log('RUNNING FOR', twitter_username);
      for (const action of actions) {
        if (action === 'likes') {
          console.log('Likes Running');
          const new_tokens = await this.ActivityQuery.addNewLikes(
            twitter_userId,
            twitter_username,
            point_id,
            tweet_id,
            decrypted_token,
            decrypted_refreshtoken
          );
          if (new_tokens.access_token !== '') {
            decrypted_token = new_tokens.access_token;
            decrypted_refreshtoken = new_tokens.refresh_token;
          }
          console.log('Likes completed');
        } else if (action === 'quote') {
          console.log('Qt Running');
          const new_tokens = await this.ActivityQuery.addNewQuotes(
            twitter_userId,
            twitter_username,
            point_id,
            tweet_id,
            decrypted_token,
            decrypted_refreshtoken
          );
          if (new_tokens.access_token !== '') {
            decrypted_token = new_tokens.access_token;
            decrypted_refreshtoken = new_tokens.refresh_token;
          }
          console.log('QT completed');
        } else if (action === 'retweet') {
          console.log('Retweet Running');
          await this.ActivityQuery.addNewRetweets(twitter_userId, twitter_username, point_id, tweet_id);
          console.log('RT completed');
        } else if (action === 'mention') {
          console.log('Mention Running');
          await this.ActivityQuery.addNewMention(twitter_userId, twitter_username, point_id);
          console.log('Mention completed');
        } else if (action === 'follow') {
          console.log('Follow Running');
          await this.ActivityQuery.addNewFollowers(twitter_userId, twitter_username, point_id);
          console.log('Follow completed');
        } else if (action === 'hashtag') {
          console.log('Hashtag Running');
          await this.ActivityQuery.addNewHashtags(twitter_userId, twitter_username, point_id, hashtag);
          console.log('Hashtag completed');
        }
      }
      console.log('ENDED FOR', twitter_username);
      res.status(200).json({ message: `New twitter activity added successfully for ${twitter_username}` });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Error adding twitter activity', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error adding twitter activity', error: JSON.stringify(err) });
      }
    }
  };
}
