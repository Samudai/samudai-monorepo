import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import {
    AddSuccess,
    CreateSuccess,
    DeleteSuccess,
    FetchSuccess,
    UpdateSuccess,
} from '../../lib/helper/Responsehandler';
import { generateOTP } from '../../lib/otp';
import { generateJWTWithExpiration } from '../../lib/jwt';
import { MemberFetch, MembersEnums } from '@samudai_xyz/gateway-consumer-types';
export class MobileController {
    addMobileForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mobile = req.body.mobile;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/mobile/add`, {
                mobile,
            });

            if (result.data) {
                try {
                    const res1 = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                        type: MembersEnums.FetchMemberType.MEMBER_ID,
                        member_id: result.data.member_id,
                    });

                    const member = res1.data.member

                    const tokens = generateJWTWithExpiration(result.data.member_id);
                    result.data.name = member.name;
                    result.data.username = member.username;
                    result.data.email = member.email;
                    result.data.profile_picture = member.profile_picture;
                    result.data.access_token = tokens.access_token;
                    result.data.refresh_token = tokens.refresh_token;
                } catch (err) {
                    next(new ErrorException(err, 'Error while Member Details'));
                }
            }
            new AddSuccess(res, 'MOBILE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding Mobile'));
        }
    };

    GenerateOtpForMobile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.memberId;

            const timestamp = new Date().toString();
            const generatedOtp = generateOTP(member_id, timestamp);

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/mobile/update/generated_otp`, {
                member_id,
                mobile_otp: generatedOtp,
            });

            if (result.data) {
                result.data.generatedOtp = generatedOtp;
            }

            new FetchSuccess(res, 'MOBILE GENERATED ID', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding mobile'));
        }
    };

    GetLinkedStatusForMobile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/mobile/get/linkedstaus/${member_id}`);

            new FetchSuccess(res, 'MOBILE LINKED STATUS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching mobile linked status'));
        }
    };

    DeleteMobileForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;

            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/mobile/delete/${memberId}`);
            new DeleteSuccess(res, 'Mobile', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding Mobile'));
        }
    };

    FetchIMemberForMobile = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const member: MemberFetch = req.body.member;
            let member_id = '';
            let username = '';
            let wallet_address = '';
            let discord_user_id = '';
            let memberResult: any;
            if (member.type === MembersEnums.FetchMemberType.MEMBER_ID) {
                member_id = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch/imember`, {
                    type: MembersEnums.FetchMemberType.MEMBER_ID,
                    member_id,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.USERNAME) {
                username = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch/imember`, {
                    type: MembersEnums.FetchMemberType.USERNAME,
                    username,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.WALLET_ADDRESS) {
                wallet_address = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch/imember`, {
                    type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
                    wallet_address,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.DISCORD_ID) {
                discord_user_id = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch/imember`, {
                    type: MembersEnums.FetchMemberType.DISCORD_ID,
                    discord_user_id,
                });
                memberResult = result.data;
            }
            new FetchSuccess(res, 'MEMBER', memberResult!);

        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a imember for mobile'));
        }
    }

    getIDAOForMobile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/idao/bymemberid/${memberId}`);
            
            return res.status(200).send({
                message: 'DAO fetched successfully for mobile member',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching a dao', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
}
