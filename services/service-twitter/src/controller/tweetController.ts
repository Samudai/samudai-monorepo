import { Request, Response } from 'express';
import { TwitterQuery } from './query/twitterQuery';
import { Twitter } from '../lib/twitter';
import { Tweet } from '../utils/types';

export class TweetController {
  twitter = new Twitter();
  twitterQuery = new TwitterQuery();

  getFeaturedTweet = async (req: Request, res: Response) => {
    try {
      const linkId = req.params.linkId;
      let twitterResponse: Tweet[] = [];
      const twitterProfile = await this.twitterQuery.getTwitterVerification(linkId);

      console.log(twitterProfile);

      if (twitterProfile) {
        const twitterInfo = await this.twitter.storeTweet(linkId, twitterProfile.twitter.username);

        if (twitterInfo) {
          for (let tweet of twitterInfo.tweets) {
            const tweetInfo: Tweet = {
              id: twitterInfo.user.username,
              name: twitterInfo.user.name,
              img: twitterInfo.user.profile_image_url,
              text: tweet.text,
              links: [],
              date: tweet.created_at,
              verified: false,
              comments: tweet.public_metrics.reply_count,
              shared: tweet.public_metrics.retweet_count,
              likes: tweet.public_metrics.like_count,
            };

            // if (tweet.entities) {
            //   tweet.entities.urls.forEach((url: any) => {
            //     tweetInfo.links.push(url.expanded_url);
            //   });
            // }

            twitterResponse.push(tweetInfo);
          }
        }

        return res.status(200).send({
          data: twitterResponse,
          message: 'Successfully fetched featured tweet',
        });
      } else {
        res.status(400).send({
          message: 'Twitter profile not found',
          data: null,
        });
      }
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        return res.status(err.response.status).send({ message: 'Could not add tweet', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error while getting tweet', error: err });
      }
    }
  };

  // getFeaturedTweet = async (req: Request, res: Response) => {
  //   try {
  //     const linkId = req.params.linkId;
  //     const tweetData = await this.twitterQuery.getFeaturedTweet(linkId);
  //     const tweets: any = [];

  //     if (tweetData) {
  //       tweetData.twitter.forEach((tweet: any) => {
  //         tweets.push(JSON.parse(tweet));
  //       });
  //     }

  //     return res.status(200).send({
  //       message: 'Tweet found',
  //       tweets: tweets,
  //     });
  //   } catch (err: any) {
  //     if (err.response) {
  //       return res.status(err.response.status).send({ message: 'Could not get tweet', error: err.response.data.err });
  //     } else {
  //       return res.status(500).send({ message: 'Error verifying signature', error: err });
  //     }
  //   }
  // };

  // updateFeaturedTweet = async (req: Request, res: Response) => {
  //   try {
  //     const tweetId = req.body.tweetId;
  //     const linkId = req.body.linkId;
  //     const tweet = await this.twitter.getTweet(tweetId);
  //     const result = await this.twitterQuery.updateFeaturedTweet(linkId, JSON.stringify(tweet));
  //     return res.status(200).send({
  //       message: 'Tweet updated',
  //       tweet: tweet,
  //     });
  //   } catch (err: any) {
  //     if (err.response) {
  //       return res
  //         .status(err.response.status)
  //         .send({ message: 'Could not update tweet', error: err.response.data.err });
  //     } else {
  //       return res.status(500).send({ message: 'Error verifying signature', error: err });
  //     }
  //   }
  // };

  deleteTweet =async (req: Request, res: Response) => {
    try{
      const linkId = req.params.linkId;
      const result = await this.twitterQuery.deleteTweet(linkId);
      res.status(200).json({ message: 'Tweet deleted successfully', data: result });
    }
    catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not delete Tweet', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error deleting Tweet', error: JSON.stringify(err) });
      }
    }
  } 
}
