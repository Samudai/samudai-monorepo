import axios from 'axios';
import nodemailer from 'nodemailer';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { generateOTPWithoutMemberID } from '../../lib/otp';
import { MemberFetch, MembersEnums } from '@samudai_xyz/gateway-consumer-types';
import { sendEmailVerificationMail } from '../../lib/verificationMail';

export class PointMemberController {
    fetchMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member: MemberFetch = req.body.member;
            let member_id = '';
            let wallet_address = '';
            let discord_user_id = '';
            let memberResult: any;
            if (member.type === MembersEnums.FetchMemberType.MEMBER_ID) {
                member_id = member.value;
                const result = await axios.post(`${process.env.SERVICE_POINT}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.MEMBER_ID,
                    member_id,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.WALLET_ADDRESS) {
                wallet_address = member.value;
                const result = await axios.post(`${process.env.SERVICE_POINT}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
                    wallet_address,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.DISCORD_ID) {
                discord_user_id = member.value;
                const result = await axios.post(`${process.env.SERVICE_POINT}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.DISCORD_ID,
                    discord_user_id,
                });
                memberResult = result.data;
            }
            new FetchSuccess(res, 'MEMBER', memberResult!);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member'));
        }
    };

    UpdateNameAndEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const email = req.body.email;
            const name = req.body.name;
            const isEmailVerified = req.body.isEmailVerified;

            const memberUpdateResult = await axios.post(`${process.env.SERVICE_POINT}/member/update/name&email`, {
                member_id: memberId,
                email,
                name,
                email_verified: isEmailVerified,
            });

            if (isEmailVerified) {
                res.status(200).send({
                    message: 'Successfully updated member Email and Name',
                    data: memberUpdateResult,
                });
            }

            const result = await sendEmailVerificationMail(memberId, email);

            if (res) {
                new CreateSuccess(res, 'Email Verification mail send successfully', result);
            } else {
                next(new ErrorException({}, 'Error while sending email verification mail'));
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating hourly rate for member'));
        }
    };

    UpdateIsOnboarded = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const IsOnboarded = req.body.IsOnboarded;

            const result = await axios.post(`${process.env.SERVICE_POINT}/member/update/isonboarded`, {
                member_id: memberId,
                is_onboarded: IsOnboarded,
            });

            new UpdateSuccess(res, 'Successfully updated IsOnboarded', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating IsOnboarded'));
        }
    };

    getPointMembers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pointId = req.params.pointId;
            const query = req.query.query;
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_POINT}/member/list/${pointId}`, {
                offset: offset,
            });

            new FetchSuccess(res, 'Point MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Point member'));
        }
    };

    CreatePointForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.body.memberId;
            const value = req.body.value;

            const result = await axios.post(`${process.env.SERVICE_POINT}/point/create`, {
                point: { name: value.point_name },
            });

            const pointId = result.data.point_id;

            const res1 = await axios.post(`${process.env.SERVICE_POINT}/memberpoint/create`, {
                point_member: {
                    point_id: pointId,
                    member_id: memberId,
                },
            });

            const res2 = await axios.post(`${process.env.SERVICE_POINT}/access/creatediscord`, {
                point_id: pointId,
            });

            const res3 = await axios.post(`${process.env.SERVICE_POINT}/access/addmemberdiscord`, {
                point_id: pointId,
                access: 'admin',
                member_id: memberId,
            });

            return res.status(201).send({
                message: 'Point created for member successfully ',
                data: {
                    pointId: pointId,
                },
            });
        } catch (err: any) {
            if (err.response) {
                // Handle Axios errors with response status
                return res
                    .status(err.response.status)
                    .send({ message: `Error: ${err.message}`, data: err.response.data });
            } else if (err.request) {
                // Handle Axios errors without response (e.g., network error)
                return res.status(500).send({ message: 'Network error', error: err.message });
            } else {
                // Handle other errors
                return res.status(500).send({ message: 'Internal server error', error: err.message });
            }
        }
    };
    GetPointForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.member_id;

            const result = await axios.get(`${process.env.SERVICE_POINT}/point/bymemberid/${memberId}`, {});

            new FetchSuccess(res, 'Successfully fetched point system for member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching point system for member'));
        }
    };
    GetActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.params.point_id;
            const page_number = req.params.page_number;
            const limit = req.params.limit;
            const result = await axios.get(
                `${process.env.SERVICE_DISCORD}/point/event/getRecentActivity/${point_id}/${page_number}/${limit}`,
                {}
            );

            new FetchSuccess(res, 'Successfully fetched Activity', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching point system for member'));
        }
    };
    GetMemberActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.params.member_id;
            const page_number = req.params.page_number;
            const limit = req.params.limit;
            const result = await axios.get(
                `${process.env.SERVICE_DISCORD}/point/event/getMemberActivity/${memberId}/${page_number}/${limit}`,
                {}
            );

            new FetchSuccess(res, 'Successfully fetched Member Activity', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching point system for member'));
        }
    };

    GetLeaderBoard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.params.point_id;
            const page_number = req.params.page_number;
            const limit = req.params.limit;

            const result = await axios.get(
                `${process.env.SERVICE_DISCORD}/point/event/getLeaderBoard/${point_id}/${page_number}/${limit}`,
                {}
            );

            new FetchSuccess(res, 'Successfully fetched LeaderBoard', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching point system for member'));
        }
    };

    GetDiscordForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.params.member_id;

            const result = await axios.get(`${process.env.SERVICE_POINT}/member/fetchdiscord/${memberId}`);

            new FetchSuccess(res, 'Successfully fetched Discord For Member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Discord For Member'));
        }
    };
    GetMetricsData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.params.point_id;
            const days = req.params.days;
            const result = await axios.get(
                `${process.env.SERVICE_DISCORD}/point/discord/getMetric/${point_id}/${days}`,
                {}
            );

            new FetchSuccess(res, 'Successfully fetched Metrics for Point System', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Metrics'));
        }
    };
    LinkWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const wallet = req.body.wallet;
            const result = await axios.post(`${process.env.SERVICE_POINT}/wallet/create`, {
                wallet
            });

            new FetchSuccess(res, 'Successfully Linked Wallet', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Metrics'));
        }
    };
}
