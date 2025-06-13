// import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { AddSuccess, CreateSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import axios from 'axios';
const path = require('path');
interface Tweet {
    tweet_id: string;
    text: string;
}
interface Cast {
    cast_hash: string;
    text: string;
}
export class CoposterController {
    neynarOauth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;

            res.render(`farcasterOauth.ejs`, {
                memberId,
                samudaiUrl: process.env.GCN_URL,
            });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating Cast'));
        }
    };

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;

            const data = {
                is_authenticated: body.data.is_authenticated,
                signer_uuid: body.data.signer_uuid,
                fid: body.data.fid,
                member_id: body.memberId,
            };
            console.log(data);

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/coposter/user/add`, {
                coposter_user: data,
            });

            res.setHeader('coposter_user', result.data.coposterUserId);
            new CreateSuccess(res, 'Coposter User', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating Cast'));
        }
    };

    getFarcasterUserDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const coposter_user_id = req.params.coposterUserId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/coposter/getuser/byId/${coposter_user_id}`);
            const fid = result.data.coposterUser.fid;
            console.log('FID', fid);
            const user = await axios.get(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
                headers: {
                    api_key: process.env.NEYNAR_API_KEY!,
                },
            });
            const userDetails = {
                username: user.data.users[0].username,
                displayName: user.data.users[0].display_name,
                pfp_url: user.data.users[0].pfp_url,
            };
            new FetchSuccess(res, 'Coposter User', userDetails);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating Cast'));
        }
    };
    sendMultipleCast = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.member_id;
            const coposter_user_id = req.body.coposterUserId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/coposter/getuser/byId/${coposter_user_id}`);
            const signer_uuid = result.data.coposterUser.signer_uuid;
            const fid = result.data.coposterUser.fid;
            const textMessageArray = req.body.textMessageArray;
            let castArr: Cast[] = [];
            let prev_hash = '';
            for (let i = 0; i < textMessageArray.length; i++) {
                const textMessage = textMessageArray[i];
                if (prev_hash !== '') {
                    const createCast = await axios.post(
                        `https://api.neynar.com/v2/farcaster/cast`,
                        {
                            signer_uuid: signer_uuid,
                            text: textMessage,
                            parent: prev_hash,
                        },
                        {
                            headers: {
                                api_key: process.env.NEYNAR_API_KEY!,
                            },
                        }
                    );
                    prev_hash = await createCast.data.cast.hash;
                    castArr.push({ cast_hash: prev_hash, text: textMessage });
                } else {
                    const createCast = await axios.post(
                        `https://api.neynar.com/v2/farcaster/cast`,
                        {
                            signer_uuid: signer_uuid,
                            text: textMessage,
                        },
                        {
                            headers: {
                                api_key: process.env.NEYNAR_API_KEY!,
                            },
                        }
                    );
                    prev_hash = await createCast.data.cast.hash;
                    castArr.push({ cast_hash: prev_hash, text: textMessage });
                }
            }
            const addCast = await axios.post(`${process.env.SERVICE_MEMBER}/coposter/warpcast/addCast`, {
                cast_info: {
                    member_id: member_id,
                    casts: castArr,
                },
            });
            new CreateSuccess(res, 'Coposter User', { success: 'true' });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating Cast'));
        }
    };
    sendMultipleTweet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.member_id;
            let tweetArr: Tweet[] = [];
            const accessToken = req.body.accessToken;
            const textMessageArray = req.body.textMessageArray;
            let prev_tweet_id = '';
            for (let i = 0; i < textMessageArray.length; i++) {
                const textMessage = textMessageArray[i];
                if (prev_tweet_id !== '') {
                    const createTweet = await axios.post(
                        `https://api.twitter.com/2/tweets`,
                        {
                            text: textMessage,
                            reply: {
                                in_reply_to_tweet_id: prev_tweet_id,
                            },
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    prev_tweet_id = await createTweet.data.data.id;
                    tweetArr.push({ tweet_id: prev_tweet_id, text: textMessage });
                } else {
                    const createTweet = await axios.post(
                        `https://api.twitter.com/2/tweets`,
                        {
                            text: textMessage,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    prev_tweet_id = await createTweet.data.data.id;
                    tweetArr.push({ tweet_id: await createTweet.data.data.id, text: textMessage });
                }
            }
            const addTweet = await axios.post(`${process.env.SERVICE_MEMBER}/coposter/x/addTweet`, {
                tweet_info: {
                    member_id: member_id,
                    tweets: tweetArr,
                },
            });
            new CreateSuccess(res, 'Twitter User', { success: 'true' });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating a Tweet'));
        }
    };
    replyToPrevCast = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const coposter_user_id = req.body.coposterUserId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/coposter/getuser/byId/${coposter_user_id}`);
            const signer_uuid = result.data.coposterUser.signer_uuid;
            const fid = result.data.coposterUser.fid;
            const replyText = req.body.replyText;
            const getCast = await axios.get(
                `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${fid}&with_recasts=false&with_replies=false&limit=1'`,
                {
                    headers: {
                        api_key: process.env.NEYNAR_API_KEY!,
                    },
                }
            );
            const prev_hash = await getCast.data.casts[0].hash;
            if (prev_hash) {
                const createCast = await axios.post(
                    `https://api.neynar.com/v2/farcaster/cast`,
                    {
                        signer_uuid: signer_uuid,
                        text: replyText,
                        parent: prev_hash,
                    },
                    {
                        headers: {
                            api_key: process.env.NEYNAR_API_KEY!,
                        },
                    }
                );
                new CreateSuccess(res, 'Reply to Cast', createCast);
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating a Tweet'));
        }
    };
    updateXUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyData = JSON.parse(req.body.body);
            const member_id = bodyData.member_id;
            const username = bodyData.username;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/coposter/xcaster/updateXUser`, {
                update_x_user: {
                    member_id: member_id,
                    x_username: username,
                },
            });

            new CreateSuccess(res, 'Updated X User', { success: 'true' });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating a Tweet'));
        }
    };
    updateWarpcastUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyData = JSON.parse(req.body.body);
            const member_id = bodyData.member_id;
            const username = bodyData.username;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/coposter/xcaster/updateWarpcastUser`, {
                update_warpcast_user: {
                    member_id: member_id,
                    warpcast_username: username,
                },
            });

            new CreateSuccess(res, 'Updated Warpcast User', { success: 'true' });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Creating a Tweet'));
        }
    };
}
