import {
    GuildForMember,
    GuildInfo,
    MapDiscordParams,
    Member,
    MemberDiscord,
    MembersEnums,
    Onboarding,
    Project,
    ProjectEnums,
    Social,
} from '@samudai_xyz/gateway-consumer-types';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';

export class SignupController {
    linkDiscord = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const code = req.body.code;
            const redirectUri = req.body.redirectUri;
            const type_of_member = req.body.type_of_member;

            const discordResult = await axios.post(`${process.env.SERVICE_DISCORD}/discord/authuser`, {
                member_id: memberId,
                auth_code: code,
                redirect_uri: redirectUri,
            });

            let discord_data;
            let dao_data;
            const discord: MemberDiscord = discordResult.data.user_data;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/creatediscord`, {
                member_id: memberId,
                discord,
            });

            const memberUsername = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/username`, {
                member_id: memberId,
                username: discord.username,
            });

            if (result.status === 200) {
                try {
                    discord_data = await axios.get(
                        `${process.env.SERVICE_DISCORD}/discord/guildforuser/${discord.discord_user_id}`
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
                        const data: GuildForMember[] = discord_data.data;
                        let guilds: GuildInfo[] = [];
                        data.forEach((member: GuildForMember) => {
                            const guild: GuildInfo = {
                                guild_id: member.guild_id,
                                discord_roles: member.roles,
                                joined_at: member.joined_at,
                            };
                            guilds.push(guild);
                        });

                        const payload: MapDiscordParams = {
                            member_id: memberId,
                            guild_info: guilds,
                        };
                        const result = await axios.post(`${process.env.SERVICE_DAO}/member/mapdiscord`, payload);
                    } catch (err) {
                        return res.status(500).send({
                            message: 'Error while requesting data from dao',
                            error: JSON.stringify(err),
                        });
                    }

                    try {
                        dao_data = await axios.get(`${process.env.SERVICE_DAO}/dao/bymemberid/${memberId}`);
                    } catch (err: any) {
                        if (err.response) {
                            dao_data = null;
                        } else {
                            return res.status(500).send({
                                message: 'Error while requesting data',
                                error: JSON.stringify(err),
                            });
                        }
                    }
                }

                // const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
                //     link_id: memberId,
                //     // step_id: MembersEnums.MemberOnboardingFlowStep.CONNECT_DISCORD,
                //     value: {
                //         discord: discord,
                //     },
                // });

                return res.status(201).send({
                    message: 'Discord linked successfully ',
                    data: {
                        discord: discord,
                        daoData: dao_data?.data.dao,
                    },
                });
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Failed to link discord'));
        }
    };

    listAdminGuilds = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_DISCORD}/discord/guildadmin/${memberId}`);
            new FetchSuccess(res, 'ADMIN GUILDS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Failed to fetch admin guilds'));
        }
    };

    completeMemberOnboarding = async (req: Request, res: Response, next: NextFunction) => {
        //uodate member
        try {
            const member: Member = req.body.member;
            const socials: Social[] = req.body.socials;
            const onBoarding: Onboarding = req.body.onBoarding;
            let project_id: string = '';

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update`, {
                member,
            });

            if (result.status === 200) {
                try {
                    const socialResult = await axios.post(`${process.env.SERVICE_MEMBER}/social/create`, {
                        socials,
                    });

                    const onBoardingResult = await axios.post(`${process.env.SERVICE_MEMBER}/onboarding/update`, {
                        onBoarding,
                    });

                    const project: Project = {
                        link_id: member.member_id,
                        type: ProjectEnums.LinkType.MEMBER,
                        project_type: ProjectEnums.ProjectType.INTERNAL,
                        title: 'My Project',
                        description: 'My Personal Project Board',
                        visibility: ProjectEnums.Visibility.PRIVATE,
                        created_by: member.member_id,
                        completed: false,
                        pinned: true,
                    };

                    const projectResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/create`, {
                        project,
                    });

                    project_id = projectResult.data.project_id;
                } catch (err) {
                    return res.status(500).send({
                        message: 'Error while requesting data for member social and onboarding update',
                        error: JSON.stringify(err),
                    });
                }

                const deleteOnboarding = await axios.delete(
                    `${process.env.SERVICE_ACTIVITY}/onboarding/delete/${member.member_id}`
                );
            }

            return res.status(201).send({
                message: 'Member onboarding completed successfully',
                data: {
                    member,
                    socials,
                    onBoarding,
                    project_id,
                },
            });
        } catch (err: any) {
            next(new ErrorException(err, 'Failed to complete memeber onboarding'));
        }
    };
}
