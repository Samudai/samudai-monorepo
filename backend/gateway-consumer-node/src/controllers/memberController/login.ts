import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { generateJWT, generateJWTWithExpiration } from '../../lib/jwt';
import { getNextStepForMember } from '../../lib/nextstep';
import { Member, MembersEnums } from '@samudai_xyz/gateway-consumer-types';
import { NotAuthorisedError } from '../../errors/authError';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

interface MemberPayload {
    member_id?: string;
    exp?: any;
    iat?: any;
}

export class LoginController {
    // getNonce = async (req: Request, res: Response, next: NextFunction) => {
    //   const nonce = generateNonce();
    //   res.setHeader('Content-Type', 'text/plain');
    //   res
    //     .cookie('nonce', nonce, {
    //       sameSite: 'none',
    //       secure: true,
    //     })
    //     .status(200)
    //     .send(nonce);
    // };

    login = async (req: Request, res: Response, next: NextFunction) => {
        const walletAddress: string = req.body.walletAddress;
        const chainId: number = req.body.chainId;
        const member: Member = req.body.member;
        const inviteCode: string = req.body.inviteCode;
        const isPrivy: boolean = req.body.isPrivy;
        const privyUserDetails = req.body.privyUserDetails;
        const isXcaster: boolean = req.body.isXcaster;

        let existingMember: any;
        let newMember: any;
        let dao_data: any;
        let onboardingResult: any;
        let onboardingStatus: boolean = false;
        //let onboardingStepValue = 0;
        let member_type = '';

        if (!member.email) {
            member.email = privyUserDetails?.userEmailAddress || privyUserDetails?.google?.email;
        }
        try {
            // if (!req.body.message || !req.body.signature) {
            //   res.status(422).json({
            //     message: 'Expected message and signature',
            //   });
            //   return;
            // } else {
            //   nonce = await verifySignature(req.body.message, req.body.signature, req.body.userAddress, req.body.walletType);
            // }

            // if (!('nonce' in req.cookies) || req.cookies['nonce'] !== nonce) {
            //   res.status(422).json({
            //     message: `Invalid nonce.`,
            //   });
            //   return;
            // }
            try {
                existingMember = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
                    wallet_address: walletAddress,
                });
                if (existingMember && isXcaster) {
                    const user = await axios.get(
                        `${process.env.SERVICE_MEMBER}/coposter/fetch/${existingMember.data.member.member_id}`
                    );
                    if (!user.data.data) {
                        const result = await axios.post(`${process.env.SERVICE_MEMBER}/coposter/xcaster/addUser`, {
                            xcaster_user: {
                                member_id: existingMember.data.member.member_id,
                            },
                        });
                    }
                }

                onboardingResult = await axios.get(
                    `${process.env.SERVICE_MEMBER}/onboarding/${existingMember.data.member.member_id}`
                );

                if (onboardingResult.data) {
                    if (
                        onboardingResult.data.onboarding.admin === false &&
                        onboardingResult.data.onboarding.contributor === false
                    ) {
                        onboardingStatus = false;
                    } else if (
                        onboardingResult.data.onboarding.admin === true ||
                        onboardingResult.data.onboarding.contributor === true
                    ) {
                        onboardingStatus = true;
                    } else {
                        onboardingStatus = false;
                    }
                } else {
                    onboardingStatus = false;
                }
            } catch (err: any) {
                if (err.response) {
                    newMember = await axios.post(`${process.env.SERVICE_MEMBER}/member/create`, {
                        member: member,
                        chain_id: chainId,
                        wallet_address: walletAddress,
                        invite_code: inviteCode,
                    });

                    if (newMember.status === 200) {
                        if (isPrivy) {
                            const result = await axios.post(`${process.env.SERVICE_MEMBER}/privy/add`, {
                                privy: {
                                    member_id: newMember.data.member_id,
                                    privy_did: privyUserDetails?.userId,
                                    privy_email: privyUserDetails?.userEmailAddress || '',
                                    privy_google: {
                                        gmail: privyUserDetails?.google?.email,
                                        subject: '',
                                        name: privyUserDetails?.google?.name,
                                    },
                                    privy_github: {
                                        email: privyUserDetails?.github?.email,
                                        subject: '',
                                        name: privyUserDetails?.github?.name,
                                        username: privyUserDetails?.github?.username,
                                    },
                                },
                            });
                        }
                        if (isXcaster) {
                            const result = await axios.post(`${process.env.SERVICE_MEMBER}/coposter/xcaster/addUser`, {
                                xcaster_user: {
                                    member_id: newMember.data.member_id,
                                },
                            });
                        }
                        const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
                            link_id: newMember.data.member_id,
                            step_id: MembersEnums.MemberOnboardingFlowStep.LOGIN,
                            value: {
                                wallet_address: walletAddress,
                                chain_id: chainId,
                                member: member,
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

            //console.log('existingMember', existingMember);

            if (existingMember && onboardingStatus) {
                let member_type;

                if (onboardingResult.data.onboarding.admin === true) {
                    member_type = 'admin';
                } else if (onboardingResult.data.onboarding.contributor === true) {
                    member_type = 'contributor';
                }

                try {
                    dao_data = await axios.get(
                        `${process.env.SERVICE_DAO}/dao/getbymemberid/${existingMember!.data.member.member_id}`
                    );
                } catch (err: any) {
                    if (err.response) {
                        dao_data = null;
                    } else {
                        return res.status(500).send({
                            message: 'Error while requesting data from dao',
                            error: JSON.stringify(err),
                        });
                    }
                }

                const memberJWT = generateJWT(existingMember!.data.member.member_id);
                res.status(200).send({
                    message: 'Successfully fetched member',
                    data: {
                        isOnboarded: true,
                        member: existingMember.data.member,
                        member_type: member_type,
                        daoData: dao_data?.data.dao,
                        jwt: memberJWT,
                    },
                });
            } else if (existingMember && !onboardingStatus) {
                const memberJWT = generateJWT(existingMember!.data.member.member_id);

                const {
                    nextStep,
                    onboardingData,
                    member_type,
                    onboardingIntegration,
                    guildInfoResponse,
                    memberGuildsResponse,
                } = await getNextStepForMember(existingMember.data.member.member_id);

                // console.log('nextStep', nextStep);
                // console.log('onboardingData', onboardingData);
                // console.log('member_type', member_type);
                // console.log('onboardingIntegration', onboardingIntegration);
                // console.log('discord_bot', discord_bot);

                res.status(200).send({
                    message: 'Member not onboarded',
                    data: {
                        goTo: nextStep,
                        isOnboarded: false,
                        member_type: member_type,
                        onboardingIntegration: onboardingIntegration,
                        member: existingMember.data.member,
                        onboardingData: onboardingData,
                        guildInfo: guildInfoResponse,
                        memberGuilds: memberGuildsResponse,
                        jwt: memberJWT,
                    },
                });

                //console.log('getOnboardingStep', onboardingStep.data.data.steps);
            } else {
                {
                    const memberJWT = generateJWT(newMember.data.member_id);

                    res.status(200).send({
                        message: 'Successfully created member',
                        data: {
                            isOnboarded: false,
                            goTo: MembersEnums.MemberOnboardingFlow[1],
                            member: newMember.data,
                            jwt: memberJWT,
                        },
                    });
                }
            }
            // res.status(200).send({
            //     message: 'Successfully created member',
            //     data: { member: newMember.data, jwt: 'jwt' },
            // });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while logging in a member'));
        }
    };

    demoLogin = async (req: Request, res: Response, next: NextFunction) => {
        const walletAddress: string = req.body.walletAddress;
        const chainId: number = req.body.chainId;
        const member: Member = req.body.member;

        let existingMember: any;
        let newMember: any;

        try {
            try {
                existingMember = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
                    wallet_address: walletAddress,
                });
            } catch (err: any) {
                if (err.response) {
                    newMember = await axios.post(`${process.env.SERVICE_MEMBER}/member/create`, {
                        member: member,
                        chain_id: chainId,
                        wallet_address: walletAddress,
                    });
                } else if (err.request) {
                    return res.status(500).send({
                        message: 'Error while requesting data from member',
                        error: JSON.stringify(err),
                    });
                }
            }

            if (existingMember) {
                res.status(200).send({
                    message: 'Successfully fetched member',
                    data: {
                        member: existingMember.data.member,
                    },
                });
            } else {
                res.status(200).send({
                    message: 'Successfully created member',
                    data: {
                        member: newMember.data,
                    },
                });
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while logging in a member'));
        }
    };

    reauth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let refreshToken =
                req.headers['x-auth-token'] ||
                req.headers['authorization'] ||
                req.headers.authorization ||
                req.body.refresh_token;

            if (refreshToken && refreshToken.startsWith('Bearer ')) {
                refreshToken = refreshToken.slice(7, refreshToken.length);

                if (!refreshToken || refreshToken === '') {
                    res.status(401).send({
                        message: 'Token not provided',
                    });
                } else {
                    try {
                        const payload = jwt.verify(refreshToken, process.env.JWT_KEY!) as MemberPayload;

                        console.log(payload);

                        const { access_token, refresh_token } = generateJWTWithExpiration(payload.member_id!);

                        res.status(200).send({
                            message: 'Successfully created auth token',
                            data: {
                                access_token,
                                refresh_token,
                            },
                        });
                    } catch (err) {
                        if (err instanceof TokenExpiredError) {
                            res.status(401).send({
                                message: 'Refresh Token Expired, Please login again',
                            });
                        } else {
                            res.status(401).send({
                                message: 'Invalid token, User is not Authorized',
                            });
                        }
                    }
                }
            } else {
                res.status(401).send({
                    message: 'Token not provided, User is not Authorized',
                });
            }
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error',
            });
        }
    };
}
