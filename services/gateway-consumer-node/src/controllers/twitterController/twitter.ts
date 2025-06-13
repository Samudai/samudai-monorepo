import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import {
    FeaturedSuccess,
    FoundSuccess,
    UpdateSuccess,
    VerifySuccess,
    DeleteSuccess,
} from '../../lib/helper/Responsehandler';
import { TwitterResponse } from '@samudai_xyz/gateway-consumer-types';

export class TwitterController {
    verifyTwitterUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.post(`${process.env.SERVICE_TWITTER}/twitter/verify`, {
                username: req.body.username,
                id: req.body.linkId,
                address: req.body.address,
            });
            new VerifySuccess(res, 'TWITTER USER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while verifying a twitter user'));
        }
    };

    addFeaturedTweet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.post(`${process.env.SERVICE_TWITTER}/twitter/add/featured`, {
                tweetId: req.body.tweetId,
                linkId: req.body.linkId,
            });

            const tweetData = result.data.tweet;
            const tweet: TwitterResponse = {
                id: tweetData.includes.users[0].username,
                name: tweetData.includes.users[0].name,
                img: tweetData.includes.users[0].profile_image_url,
                text: tweetData.data.text,
                links: [],
                date: tweetData.data.created_at,
                verified: false,
                comments: tweetData.data.public_metrics.reply_count,
                shared: tweetData.data.public_metrics.retweet_count,
                likes: tweetData.data.public_metrics.like_count,
            };
            if (tweetData.data.entities && tweetData.data.entities.urls.length > 0) {
                tweetData.data.entities.urls.forEach((url: any) => {
                    tweet.links.push(url.expanded_url);
                });
            } else {
                tweet.links = [];
            }
            new FeaturedSuccess(res, 'TWEET', tweet);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding a tweet to featured'));
        }
    };

    getFeaturedTweet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_TWITTER}/twitter/get/featured/${req.params.linkId}`);

            const tweetsData = result.data;

            // if (tweetsData) {
            //     tweetsData.forEach((tweetData: any) => {
            //         const tweet: TwitterResponse = {
            //             id: tweetData.includes.users[0].username,
            //             name: tweetData.includes.users[0].name,
            //             img: tweetData.includes.users[0].profile_image_url,
            //             text: tweetData.data.text,
            //             links: [],
            //             date: tweetData.data.created_at,
            //             verified: false,
            //             comments: tweetData.data.public_metrics.reply_count,
            //             shared: tweetData.data.public_metrics.retweet_count,
            //             likes: tweetData.data.public_metrics.like_count,
            //         };
            //         if (tweetData.data.entities && tweetData.data.entities.urls.length > 0) {
            //             tweetData.data.entities.urls.forEach((url: any) => {
            //                 tweet.links.push(url.expanded_url);
            //             });
            //         } else {
            //             tweet.links = [];
            //         }
            //         tweets.push(tweet);
            //     });
            // } else {
            //     tweets = [];
            // }

            if (tweetsData) {
                new FoundSuccess(res, 'TWEET', tweetsData);
            } else {
                new FoundSuccess(res, 'TWEET NOT', []);
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while getting a tweet from featured'));
        }
    };

    updateFeaturedTweet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.post(`${process.env.SERVICE_TWITTER}/twitter/update/featured`, {
                tweetId: req.body.tweetId,
                linkId: req.body.linkId,
            });

            const tweetData = result.data.tweet;
            const tweet: TwitterResponse = {
                id: tweetData.includes.users[0].username,
                name: tweetData.includes.users[0].name,
                img: tweetData.includes.users[0].profile_image_url,
                text: tweetData.data.text,
                links: [],
                date: tweetData.data.created_at,
                verified: false,
                comments: tweetData.data.public_metrics.reply_count,
                shared: tweetData.data.public_metrics.retweet_count,
                likes: tweetData.data.public_metrics.like_count,
            };
            if (tweetData.data.entities && tweetData.data.entities.urls.length > 0) {
                tweetData.data.entities.urls.forEach((url: any) => {
                    tweet.links.push(url.expanded_url);
                });
            } else {
                tweet.links = [];
            }
            new UpdateSuccess(res, 'TWEET', tweet);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a tweet from featured'));
        }
    };

    deleteTweet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const linkId = req.params.linkId;
            const result = await axios.delete(`${process.env.SERVICE_TWITTER}/twitter/delete/${linkId}`);
            new DeleteSuccess(res, 'TWEET', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting the Tweet'));
        }
    };
}
