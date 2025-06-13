import axios from 'axios';
import nodemailer from 'nodemailer';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess } from '../../lib/helper/Responsehandler';
import { generateOTPWithoutMemberID } from '../../lib/otp';
import {
    GuildForMember,
    GuildForMemberPoints,
    GuildInfo,
    GuildPointsInfo,
    MapDiscordParams,
    MemberDiscord,
    MembersEnums,
} from '@samudai_xyz/gateway-consumer-types';

export class PointLoginController {
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const walletAddress: string = req.body.walletAddress;
            const chainId: number = req.body.chainId;
            let existingMember: any;
            let newMember: any;

            try {
                existingMember = await axios.post(`${process.env.SERVICE_POINT}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
                    wallet_address: walletAddress,
                });
                if (existingMember) {
                    res.status(200).send({
                        message: 'Successfully fetched member',
                        data: {
                            isOnboarded: existingMember.data.member.is_onboarded,
                            email_verified: existingMember.data.member.email_verified,
                            member: existingMember.data.member,
                        },
                    });
                } else {
                    return res.status(500).send({
                        message: 'Error while requesting data from member',
                    });
                }
            } catch (err: any) {
                if (err.response) {
                    newMember = await axios.post(`${process.env.SERVICE_POINT}/member/create`, {
                        chain_id: chainId,
                        wallet_address: walletAddress,
                    });
                    if (newMember.status === 200) {
                        const newlyCreatedMember = await axios.post(`${process.env.SERVICE_POINT}/member/fetch`, {
                            type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
                            wallet_address: walletAddress,
                        });

                        res.status(200).send({
                            message: 'Successfully fetched member',
                            data: {
                                isOnboarded: newlyCreatedMember.data.member.is_onboarded,
                                email_verified: newlyCreatedMember.data.member.email_verified,
                                member: newlyCreatedMember.data.member,
                            },
                        });
                    }
                } else if (err.request) {
                    return res.status(500).send({
                        message: 'Error while requesting data from member',
                        error: JSON.stringify(err),
                    });
                }
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while login to Point System'));
        }
    };

    sendEmailVerificationMail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const toemail = req.body.toemail;
            const otp = generateOTPWithoutMemberID();

            const result = await axios.post(`${process.env.SERVICE_POINT}/member/update/verificationcode`, {
                member_id: memberId,
                email_verification_code: otp,
            });

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'vanshkapoor1408@gmail.com',
                    pass: 'epkz byeg ofck ahvo',
                },
            });

            const mailOptions = {
                from: 'vanshkapoor1408@gmail.com',
                to: toemail,
                subject: 'Your OTP',
                html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
            };

            await transporter.sendMail(mailOptions);

            new CreateSuccess(res, 'Verication Mail Code', { message: 'success' });
        } catch (err: any) {
            next(new ErrorException(err, 'Error sending Email Verification Mail'));
        }
    };

    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const emailVerificationCode = req.body.emailVerificationCode;

            const result = await axios.post(`${process.env.SERVICE_POINT}/member/verifyemail`, {
                member_id: memberId,
                email_verification_code: emailVerificationCode,
            });

            new CreateSuccess(res, 'Verication Email', { message: 'success' });
        } catch (err: any) {
            next(new ErrorException(err, 'Error Verifying Mail'));
        }
    };

    linkDiscordPoints = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const code = req.body.code;
            const redirectUri = req.body.redirectUri;

            const discordResult = await axios.post(`${process.env.SERVICE_DISCORD}/point/discord/authuser`, {
                member_id: memberId,
                auth_code: code,
                redirect_uri: redirectUri,
            });

            let discord_data;
            let point_data;
            const discord: MemberDiscord = discordResult.data.user_data;

            const result = await axios.post(`${process.env.SERVICE_POINT}/member/creatediscord`, {
                member_id: memberId,
                discord,
            });

            if (result.status === 200) {
                try {
                    discord_data = await axios.get(
                        `${process.env.SERVICE_DISCORD}/point/discord/guildforuser/${discord.discord_user_id}`
                    );
                } catch (err: any) {
                    if (err.response) {
                        discord_data = null;
                    } else if (err.request) {
                        return res.status(500).send({
                            message: 'Error while requesting data from discord',
                            error: JSON.stringify(err),
                        });
                    }
                }

                if (discord_data && discord_data.data) {
                    try {
                        const data: GuildForMemberPoints[] = discord_data.data;
                        let guilds: GuildPointsInfo[] = [];
                        data.forEach((member: GuildForMemberPoints) => {
                            const guild: GuildPointsInfo = {
                                guild_id: member.guild_id,
                                discord_roles: member.roles,
                                points_num: member.points_num,
                                joined_at: member.joined_at,
                            };
                            guilds.push(guild);
                        });

                        const payload: MapDiscordParams = {
                            member_id: memberId,
                            guild_info: guilds,
                        };
                        const result = await axios.post(`${process.env.SERVICE_POINT}/memberpoint/mapdiscord`, payload);
                    } catch (err) {
                        return res.status(500).send({
                            message: 'Error while requesting data from point',
                            error: JSON.stringify(err),
                        });
                    }

                    try {
                        point_data = await axios.get(`${process.env.SERVICE_POINT}/point/bymemberid/${memberId}`);
                    } catch (err: any) {
                        if (err.response) {
                            point_data = null;
                        } else {
                            return res.status(500).send({
                                message: 'Error while requesting data',
                                error: JSON.stringify(err),
                            });
                        }
                    }
                }

                return res.status(201).send({
                    message: 'Discord linked successfully ',
                    data: {
                        discord: discord,
                        daoData: point_data?.data.point,
                    },
                });
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Failed to link discord'));
        }
    };
}
