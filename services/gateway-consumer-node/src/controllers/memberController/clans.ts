import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import {
    AddSuccess,
    BadGateway,
    CreateSuccess,
    DeleteSuccess,
    FetchSuccess,
    UniversalSuccess,
    UpdateSuccess,
} from '../../lib/helper/Responsehandler';
import {
    MembersEnums,
    Clan,
    ClanInvite,
    ClanMember,
    ClanMemberInfo,
    ClanProjectInfo,
    ClanResponse,
    ClanView,
} from '@samudai_xyz/gateway-consumer-types';
export class ClansController {
    createClan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clan: Clan = req.body.clan;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/clan/create`, {
                clan,
            });

            if (result.status === 200) {
                const memberResponse = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.MEMBER_ID,
                    member_id: clan.created_by,
                });

                const clanMember: ClanMember = {
                    clan_id: result.data.clan_id,
                    member_id: clan.created_by,
                    role: MembersEnums.ClanRole.OWNER,
                    username: memberResponse.data.member.username,
                    profile_picture: memberResponse.data.member.profile_picture,
                    notification: true,
                };

                const memberResult = await axios.post(`${process.env.SERVICE_MEMBER}/clan/addmember`, {
                    clan_member: clanMember,
                });
            }

            new CreateSuccess(res, 'CLAN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a clan'));
        }
    };

    addClanMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clan_member: ClanMember = req.body.clanMember;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/clan/addmember`, {
                clan_member,
            });
            new AddSuccess(res, 'CLAN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding a clan member'));
        }
    };

    getClan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clanId = req.params.clanId;

            //Initializers
            let clanAdmin: ClanMemberInfo;
            let clanMembers: ClanMemberInfo[] = [];
            let clanResponse: ClanResponse;
            let clanProject: ClanProjectInfo;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/clan/${clanId}`);
            const clan: ClanView = result.data.clan;

            if (result.status === 200) {
                const admin: ClanMember = clan.members.find((member) => member.role === MembersEnums.ClanRole.OWNER)!;
                const members: ClanMember[] = clan.members.filter(
                    (member) => member.role !== MembersEnums.ClanRole.OWNER
                );

                members.forEach((member: ClanMember) => {
                    clanMembers.push({
                        member_id: member.member_id,
                        username: member.username,
                        profile_picture: member.profile_picture,
                    });
                });

                clanResponse = {
                    clan_id: clan.clan_id,
                    name: clan.name,
                    visbility: clan.visbility,
                    avatar: clan.avatar,
                    created_by: clan.created_by,

                    members: clanMembers,
                    admin: {
                        member_id: admin.member_id,
                        username: admin.username,
                        profile_picture: admin.profile_picture,
                    },

                    projects: {
                        active: [],
                        completed: [],
                    },

                    earned_badges: [],
                    skills: [],
                    reviews: [],
                    applications: [],
                    total_bounty: {
                        value: 0,
                        data: [],
                    },
                    chat_id: '',
                    created_at: clan.created_at,
                    updated_at: clan.updated_at,
                };
                new FetchSuccess(res, 'CLAN', clanResponse!);
            } else {
                new BadGateway(res, 'CLAN Finding');
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a clan'));
        }
    };

    updateClan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clan: Clan = req.body.clan;

            const result = await axios.put(`${process.env.SERVICE_MEMBER}/clan/update`, {
                clan,
            });
            new UpdateSuccess(res, 'CLAN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a clan'));
        }
    };

    deleteClan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clanId = req.params.clanId;

            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/clan/${clanId}`);
            new DeleteSuccess(res, 'CLAN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a clan'));
        }
    };

    removeClanMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.params.memberId;
            const clan_id: string = req.params.clanId;

            const result = await axios.delete(
                `${process.env.SERVICE_MEMBER}/clan/removemember/${clan_id}/${member_id}`
            );
            new UniversalSuccess(res, 'CLAN MEMBER removed', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while removing a clan member'));
        }
    };

    getClansByMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/clan/bymember/${memberId}`);

            new FetchSuccess(res, 'CLAN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching clans'));
        }
    };

    //Clan invites

    createClanInvite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clan_invite: ClanInvite = req.body.clanInvite;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/claninvite/create`, {
                clan_invite,
            });
            new CreateSuccess(res, 'CLAN INVITE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a clan invite'));
        }
    };

    getClanInvite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clanId = req.params.clanId;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/claninvite/list/${clanId}`);
            new FetchSuccess(res, 'CLAN INVITE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a clan invite'));
        }
    };

    updateClanInvite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clanInvite: ClanInvite = req.body.clanInvite;

            const result = await axios.put(`${process.env.SERVICE_MEMBER}/claninvite/update`, {
                clanInvite,
            });
            new UpdateSuccess(res, 'CLAN INVITE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a clan invite'));
        }
    };

    getClanInviteForReceiver = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const receiverId = req.params.receiverId;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/claninvite/byreceiverid/${receiverId}`);
            new FetchSuccess(res, 'CLAN INVITE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a clan invite'));
        }
    };

    deleteClanInvite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clanInviteId = req.params.clanInviteId;

            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/claninvite/delete/${clanInviteId}`);

            new DeleteSuccess(res, 'CLAN INVITE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a clan invite'));
        }
    };
}
