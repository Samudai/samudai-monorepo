import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { bulkMemberMap, mapMemberToUsername } from '../../lib/memberUtils';
import {
    Activity,
    DAOMember,
    DAORole,
    MemberDAOView,
    TeamMember,
    TeamMemberResponse,
    MemberResponse,
} from '@samudai_xyz/gateway-consumer-types';

export class DAOMemberController {
    createDAOMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member: DAOMember = req.body.member;
            const result = await axios.post(`${process.env.SERVICE_DAO}/member/create`, {
                member: member,
            });
            new CreateSuccess(res, 'DAO MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao member'));
        }
    };

    getDAOMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const query = req.query.query;
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_DAO}/member/list/${daoId}`, {
                offset: offset,
            });

            const memerIds = result.data.members.map((member: MemberDAOView) => member.member_id);
            // todo - optimise with member cache
            const memberList = await axios.post(`${process.env.SERVICE_MEMBER}/member/getbulkbyid`, {
                member_ids: memerIds,
                query: query,
            });

            const team: TeamMember[] = memberList.data.members.map((member: MemberResponse) => {
                const daoStats = result.data.members.find((m: MemberDAOView) => m.member_id === member.member_id);
                if (daoStats) {
                    return {
                        member_id: member.member_id,
                        dao_id: daoStats.dao_id,
                        name: member?.name,
                        username: member?.username,
                        profile_picture: member?.profile_picture,
                        roles: daoStats.roles,
                        access: daoStats.access,
                        task_count: member.total_tasks_taken,
                        skills: member.skills,
                        member_joined: daoStats.member_joined,
                    };
                }
            });

            new FetchSuccess(res, 'DAO MEMBER', team.slice(0, limit));
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a dao member'));
        }
    };

    getMembersForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;

            const result = await axios.get(`${process.env.SERVICE_DAO}/member/getfordao/${daoId}`);

            let members = result.data.members;

            const memerIds = members.map((member: any) => member.member_id);
            const memberList = await bulkMemberMap(memerIds);

            const memberMap = new Map();

            memberList?.forEach((member: any) => {
                memberMap.set(member.member_id, member);
            });

            members = members.map((member: any) => {
                member.name = memberMap.get(member.member_id).name || '';
                member.username = memberMap.get(member.member_id).username || '';
                member.profile_picture = memberMap.get(member.member_id).profile_picture || '';
                return member;
            });

            new FetchSuccess(res, 'DAO MEMBER', members);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a dao member'));
        }
    };

    deleteDAOMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const memberId = req.params.memberId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/member/delete/${daoId}/${memberId}`);

            new DeleteSuccess(res, 'DAO MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a dao member'));
        }
    };

    createBulkDAOMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const memberTemp = {
            //   [dao_id, member_id, dsicord_user_id]
            // }
            const members = req.body.members;
            const result = await axios.post(`${process.env.SERVICE_DAO}/member/createbulk`, {
                members: members,
            });
            new CreateSuccess(res, 'DAO MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao member'));
        }
    };

    listmemberforDAOUUID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/member/listuuid/${daoId}`);
            new FetchSuccess(res, 'DAO Member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a dao member'));
        }
    };

    getTeamMemberInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const memberId = req.params.memberId;

            const memberInfo = await mapMemberToUsername(memberId);

            const rolesResult = await axios.get(`${process.env.SERVICE_DAO}/role/listbymemberid/${daoId}/${memberId}`);
            let roleIds = rolesResult?.data?.roles?.map((role: DAORole) => role.role_id);

            const memberProjectsResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/bymember`, {
                member_id: memberId,
                daos: [
                    {
                        dao_id: daoId,
                        roles: roleIds,
                    },
                ],
            });

            const activityResult = await axios.get(
                `${process.env.SERVICE_ACTIVITY}/activity/member/${daoId}/${memberId}`
            );

            const activity: Activity = activityResult.data.data;

            if (memberInfo) {
                let teamMemberResponse: TeamMemberResponse = {
                    member: {
                        member_id: memberInfo.member_id,
                        username: memberInfo.username,
                        profile_picture: memberInfo.profile_picture,
                        name: memberInfo.name,
                        present_role: memberInfo.present_role,
                        created_at: memberInfo.created_at,
                    },
                    open_task:
                        memberInfo.total_tasks_taken - memberInfo.closed_task >= 0
                            ? memberInfo.total_tasks_taken - memberInfo.closed_task
                            : memberInfo.total_tasks_taken,
                    closed_task: memberInfo.closed_task,
                    projects: memberProjectsResult.data.projects,
                    last_activity: activity,
                    role: rolesResult.data.roles,
                    skills: memberInfo.skills,
                };
                new FetchSuccess(res, 'TEAM MEMBER', teamMemberResponse);
            } else {
                let teamMemberResponse: TeamMemberResponse = {
                    member: {
                        member_id: memberId,
                        username: 'Unknown',
                        profile_picture: '',
                        name: 'Unknown',
                        present_role: '',
                        created_at: '',
                    },
                    open_task: 0,
                    closed_task: 0,
                    projects: memberProjectsResult.data.projects,
                    last_activity: activity,
                    role: rolesResult.data.roles,
                    skills: [],
                };
                new FetchSuccess(res, 'TEAM MEMBER', teamMemberResponse);
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a dao member'));
        }
    };

    updateDAOMemberLicense = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.body.daoId;
            const member_id = req.body.memberId;
            const licensed_member = req.body.licensedMember;

            const result = await axios.post(`${process.env.SERVICE_DAO}/member/update/license`, {
                dao_id,
                member_id,
                licensed_member,
            });
            new UpdateSuccess(res, 'DAO Member License', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a dao member license'));
        }
    };

    updateDAOMemberLicenseBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.body.daoId;
            const member_ids = req.body.memberIds;
            const licensed_member = req.body.licensedMember;

            const result = await axios.post(`${process.env.SERVICE_DAO}/member/update/licensebulk`, {
                dao_id,
                member_ids,
                licensed_member,
            });
            new UpdateSuccess(res, 'DAO Member License', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a dao member license'));
        }
    };
}
