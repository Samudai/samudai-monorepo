import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointTwitterController {
    twitterOauth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Oauth = req.body.Oauth;

            const result = await axios.post(`https://api.twitter.com/2/oauth2/token`, {
                code: Oauth.code,
                grant_type: 'authorization_code',
                client_id: process.env.TWITTER_CLIENT_ID!,
                redirect_uri: Oauth.redirect_uri,
                code_verifier: 'challenge',
            });
            var res1: any;

            const res2 = await axios.get(`https://api.twitter.com/2/users/me`, {
                headers: { Authorization: 'Bearer ' + result.data.access_token },
                withCredentials: false,
            });

            if (Oauth.type === 'point') {
                res1 = await axios.post(`${process.env.SERVICE_POINT}/twitter/update`, {
                    twitter: {
                        point_id: Oauth.link_id,
                        twitter_user_id: res2.data.data.id,
                        twitter_username: res2.data.data.username,
                        access_token: result.data.access_token,
                        refresh_token: result.data.refresh_token,
                    },
                });
            } else if (Oauth.type === 'member') {
                res1 = await axios.post(`${process.env.SERVICE_POINT}/twittermember/add`, {
                    twitter_member: {
                        member_id: Oauth.link_id,
                        twitter_user_id: res2.data.data.id,
                        twitter_username: res2.data.data.username,
                    },
                });
            }

            new CreateSuccess(res, 'Twitter Oauth', res1);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while doing a Twitter Oauth'));
        }
    };

    addTwitter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const twitter = req.body.twitter;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twitter/add`, {
                twitter,
            });
            new CreateSuccess(res, 'Twitter', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Twitter'));
        }
    };

    updateTwitter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const twitter = req.body.twitter;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twitter/update`, {
                twitter,
            });
            new UpdateSuccess(res, 'Updated twitter', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a twitter'));
        }
    };

    updateTwitterTokens = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.body.pointId;
            const access_token = req.body.accessToken;
            const refresh_token = req.body.refreshToken;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twitter/updatetokens`, {
                point_id,
                access_token,
                refresh_token,
            });
            new UpdateSuccess(res, 'Updated twitter', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a twitter'));
        }
    };

    updateTwitterStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.body.pointId;
            const status = req.body.status;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twitter/updatestatus`, {
                point_id,
                status,
            });
            new UpdateSuccess(res, 'Updated twitter status', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a twitter status'));
        }
    };

    getTwitterByPointId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pointId = req.params.pointId;
            const result = await axios.get(`${process.env.SERVICE_POINT}/twitter/getbypointid/${pointId}`);
            new FetchSuccess(res, 'Fetch Twitter', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Twitter'));
        }
    };
}
