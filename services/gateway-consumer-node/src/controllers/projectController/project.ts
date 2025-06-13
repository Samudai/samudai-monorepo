import axios from 'axios';
import { Request, Response } from 'express';
import { getAccessLevel, getMemberAccessForDAO, getVisibilityAccessLevel } from '../../lib/accessHelpers';
import { bulkMemberMap, mapMemberToUsername } from '../../lib/memberUtils';
import { getDepartments } from '../../lib/project';
import {
    DiscoveryEnums,
    AccessEnums,
    DAOEvent,
    DAODetail,
    IMember,
    Project,
    ProjectColumn,
    ProjectResponse,
} from '@samudai_xyz/gateway-consumer-types';

export class ProjectController {
    createProject = async (req: Request, res: Response) => {
        try {
            const project: Project = req.body.project;
            let projectResponse: ProjectResponse;

            if (project.type === 'dao') {
                const subscriptionData = await axios.get(
                    `${process.env.SERVICE_DAO}/dao/getsubscription/fordao/${project.link_id}`
                );

                const projectLimit = subscriptionData.data.data.current_plan.projects
            
                const projectCount = await axios.get(`${process.env.SERVICE_PROJECT}/project/get/projectcount/${project.link_id}`);

                const projectUsed = projectCount.data.count

                if(projectUsed >= projectLimit) {
                    return res.status(500).send({ message: 'Project Creating Limit Used', error: 'Project Creating Limit Used' });
                }
            }

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/create`, {
                project: project,
            });
            project.project_id = result.data.project_id;

            if (result.status === 200) {
                project.project_id = result.data.project_id;
                projectResponse = { ...project };
                projectResponse.tasks = [];
                if (project.poc_member_id) {
                    const result = await mapMemberToUsername(project.poc_member_id);
                    if (result) {
                        const poc_member: IMember = {
                            member_id: result.member_id,
                            username: result.username,
                            profile_picture: result.profile_picture,
                            name: result.name,
                        };
                        projectResponse.poc_member = poc_member;
                    } else {
                        const poc_member: IMember = {
                            member_id: project.poc_member_id,
                            username: 'Unknown',
                            profile_picture: '',
                            name: 'Unknown',
                        };
                        projectResponse.poc_member = poc_member;
                    }
                } else if (project.captain) {
                    const result = await mapMemberToUsername(project.captain);
                    if (result) {
                        const captain: IMember = {
                            member_id: result.member_id,
                            username: result.username,
                            profile_picture: result.profile_picture,
                        };
                        projectResponse.captain_member = captain;
                    } else {
                        const captain: IMember = {
                            member_id: project.captain,
                            username: 'Unknown',
                            profile_picture: '',
                            name: 'Unknown',
                        };
                        projectResponse.captain_member = captain;
                    }
                }

                const daoEvent: DAOEvent = {
                    dao_id: project.link_id,
                    event_type: DiscoveryEnums.DAOEventType.PROJECT_CREATED,
                    event_context: DiscoveryEnums.DAOEventContext.PROJECT,
                };
                await axios.post(`${process.env.SERVICE_DISCOVERY}/events/dao/create`, {
                    event: daoEvent,
                });
            }
            res.status(201).send({ message: 'Project created successfully', data: projectResponse! });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while creating a project', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateProject = async (req: Request, res: Response) => {
        try {
            const project: Project = req.body.project;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/update`, {
                project: project,
            });

            if (project.poc_member_id) {
                await axios.post(`${process.env.SERVICE_PROJECT}/access/add/formember`, {
                    member_id: project.poc_member_id,
                    project_id: project.project_id,
                    access: AccessEnums.ProjectAccessType.MANAGE_PROJECT,
                });
            }

            res.status(201).send({ message: 'Project updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating a project', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getAllProjects = async (req: Request, res: Response) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/project/getall`);

            res.status(200).send({ message: 'Projects fetched successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching projects', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getProjectById = async (req: Request, res: Response) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/project/${req.params.projectId}`);
            const projectAccess = await axios.get(
                `${process.env.SERVICE_PROJECT}/access/listbyprojectid/${req.params.projectId}`
            );
            const memberAccess = res.locals.projectAccess;
            let projectResponse: ProjectResponse = { ...result.data };
            projectResponse.tasks = [];

            const project: Project = result.data;

            const memberList = await bulkMemberMap(project.contributors!);
            projectResponse.contributor_list = memberList;
            projectResponse.access = memberAccess;

            if (project.poc_member_id) {
                const result = await mapMemberToUsername(project.poc_member_id);
                if (result) {
                    const poc_member: IMember = {
                        member_id: result.member_id,
                        username: result.username,
                        profile_picture: result.profile_picture,
                        name: result.name,
                    };
                    projectResponse.poc_member = poc_member;
                } else {
                    const poc_member: IMember = {
                        member_id: project.poc_member_id,
                        username: 'Unknown',
                        profile_picture: '',
                        name: 'Unknown',
                    };
                    projectResponse.poc_member = poc_member;
                }
            }
            if (project.captain) {
                const result = await mapMemberToUsername(project.captain);
                if (result) {
                    const captain: IMember = {
                        member_id: result.member_id,
                        username: result.username,
                        profile_picture: result.profile_picture,
                    };
                    projectResponse.captain_member = captain;
                } else {
                    const captain: IMember = {
                        member_id: project.captain,
                        username: 'Unknown',
                        profile_picture: '',
                        name: 'Unknown',
                    };
                    projectResponse.captain_member = captain;
                }
            }

            const data = {
                project: projectResponse,
                project_access: projectAccess.data,
            };
            res.status(200).send({ message: 'Project fetched successfully', data: data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching project', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getProjectByMemberDAO = async (req: Request, res: Response) => {
        try {
            const memberId: string = req.body.member_id;
            const daos: DAODetail[] = req.body.daos;
            //let daoAccess = res.locals.access;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/bymemberdao`, {
                member_id: memberId,
                daos: daos,
            });
            const projects = result.data.projects;

            let projectResponses: ProjectResponse[] = [];
            let memberList: IMember[] = [];
            if (projects) {
                const depMap = await getDepartments(projects);
                for (const project of projects) {
                    const res = await axios.post(`${process.env.SERVICE_JOB}/job/total_jobs_posted`, {
                        dao_id: project.link_id,
                        project_id: project.project_id,
                    });
                    const daoAccess = await getMemberAccessForDAO(memberId, project.link_id);
                    let highestAccess = getVisibilityAccessLevel(
                        daoAccess,
                        project.access,
                        project.visibility,
                        project.project_type
                    );
                    highestAccess =
                        highestAccess === 'manage_dao' || highestAccess === 'manage_project'
                            ? AccessEnums.AccessType.MANAGE_PROJECT
                            : highestAccess;

                    if (project.contributors.length > 0) {
                        memberList = await bulkMemberMap(project.contributors!);
                    }
                    if (highestAccess !== 'hidden') {
                        projectResponses.push({
                            ...project,
                            total_jobs_posted: res.data.total_jobs_posted,
                            access: highestAccess,
                            tasks: [],
                            contributor_list: memberList,
                        });
                    }
                }
                projectResponses = projectResponses.map((project: any) => {
                    project.department = depMap.get(project.department) || '';
                    return project;
                });
                return res.status(200).send({ message: 'Projects fetched successfully', data: projectResponses });
            } else {
                return res.status(200).send({ message: 'Projects fetched successfully', data: [] });
            }
        } catch (err: any) {
            console.log(err);
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching projects', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getProjectByMember = async (req: Request, res: Response) => {
        try {
            const member_id: string = req.body.member_id;
            const daos: DAODetail[] = req.body.daos;

            //let daoAccess = res.locals.access;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/bymember`, {
                member_id: member_id,
                daos: daos,
            });

            const projects = result.data.projects;
            let projectResponses: ProjectResponse[] = [];
            let memberList: IMember[] = [];
            if (projects) {
                const depMap = await getDepartments(projects);

                for (const project of projects) {
                    const daoAccess = await getMemberAccessForDAO(member_id, project.link_id);
                    console.log(daoAccess);
                    let highestAccess = getVisibilityAccessLevel(
                        daoAccess,
                        project.access,
                        project.visibility,
                        project.project_type
                    );
                    highestAccess =
                        highestAccess === 'manage_dao' || highestAccess === 'manage_project'
                            ? AccessEnums.AccessType.MANAGE_PROJECT
                            : highestAccess;
                    if (project.contributors.length > 0) {
                        memberList = await bulkMemberMap(project.contributors!);
                    }
                    if (highestAccess !== 'hidden') {
                        projectResponses.push({
                            ...project,
                            access: highestAccess,
                            tasks: [],
                            contributor_list: memberList,
                        });
                    }
                }

                projectResponses = projectResponses.map((project: any) => {
                    project.department = depMap.get(project.department) || '';
                    return project;
                });

                return res.status(200).send({ message: 'Projects fetched successfully', data: projectResponses });
            } else {
                return res.status(200).send({ message: 'Projects fetched successfully', data: [] });
            }
        } catch (err: any) {
            console.log(err);
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching projects', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getByLinkId = async (req: Request, res: Response) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 10;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/bylinkid/${req.params.linkId}`, {
                limit: limit,
                offset: offset,
            });

            const projects: Project[] = result.data.projects;

            let projectResponses: ProjectResponse[] = [];

            for (const project of projects) {
                let projectResponse: ProjectResponse = { ...project };
                const memberList = await bulkMemberMap(project.contributors!);
                projectResponse.contributor_list = memberList;
                projectResponse.tasks = [];
                projectResponses.push(projectResponse);
            }

            res.status(200).send({ message: 'Projects fetched successfully', data: { projects: projectResponses } });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching projects', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    deleteProject = async (req: Request, res: Response) => {
        try {
            const projectId: string = req.params.projectId;
            const daoId: string = req.headers.daoid as string;
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/project/${projectId}`);

            if (result.status === 200) {
                const daoEvent: DAOEvent = {
                    dao_id: daoId,
                    event_type: DiscoveryEnums.DAOEventType.PROJECT_DELETED,
                    event_context: DiscoveryEnums.DAOEventContext.PROJECT,
                };
                await axios.post(`${process.env.SERVICE_DISCOVERY}/events/dao/create`, {
                    event: daoEvent,
                });
            }
            res.status(200).send({ message: 'Project deleted successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while deleting project', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    listTags = async (req: Request, res: Response) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/tag/list`);
            res.status(200).send({ message: 'Tags fetched successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching tags', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    linkGithub = async (req: Request, res: Response) => {
        try {
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/linkgithub`, {
                project_id: req.body.project_id,
                github_repos: req.body.github_repos,
                updated_by: req.body.updated_by,
            });
            res.status(200).send({ message: 'Github linked successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while linking github', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getContributorByProjectId = async (req: Request, res: Response) => {
        try {
            interface IContributor {
                [key: string]: number;
            }
            const result = await axios.get(
                `${process.env.SERVICE_PROJECT}/project/contributor/${req.params.projectId}`
            );

            const taskCount: IContributor = result.data;
            const memberIds = Object.keys(result.data);
            const memberList = await bulkMemberMap(memberIds);
            const contributors = memberList.map((m: any) => {
                // todo: fix datatype here
                return {
                    member_id: m.member_id,
                    name: m.name,
                    username: m.username,
                    profile_picture: m.profile_picture,
                    task_count: taskCount[m.member_id],
                };
            });

            res.status(200).send({ message: 'Contributors fetched successfully', data: contributors });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching contributors', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateProjectColumn = async (req: Request, res: Response) => {
        try {
            const project_id: string = req.body.projectId;
            const columns: ProjectColumn[] = req.body.columns;
            const updated_by = req.body.updatedBy;
            const total_col = req.body.totalCol;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/update/columns`, {
                project_id: project_id,
                columns: columns,
                updated_by: updated_by,
                total_col: total_col,
            });
            res.status(200).send({ message: 'Project columns updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating project columns', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateProjectCompleted = async (req: Request, res: Response) => {
        try {
            const daoId: string = req.body.daoId;
            const projectId: string = req.body.projectId;
            const completed: string = req.body.completed;
            const updatedBy = req.body.updated_by;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/update/completed`, {
                project_id: projectId,
                completed: completed,
                updated_by: updatedBy,
            });

            if (result.status === 200) {
                const daoEvent: DAOEvent = {
                    dao_id: daoId,
                    event_type: DiscoveryEnums.DAOEventType.PROJECT_COMPLETED,
                    event_context: DiscoveryEnums.DAOEventContext.PROJECT,
                };
                await axios.post(`${process.env.SERVICE_DISCOVERY}/events/dao/create`, {
                    event: daoEvent,
                });
            }

            res.status(200).send({ message: 'Project status updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating project status', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateProjectVisibility = async (req: Request, res: Response) => {
        try {
            const project_id: string = req.body.projectId;
            const visibility: string = req.body.visibility;
            const updated_by = req.body.updated_by;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/update/visibility`, {
                project_id: project_id,
                visibility: visibility,
                updated_by: updated_by,
            });
            res.status(200).send({ message: 'Project visibility updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while updating project visibility',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getWorkprogressForDAO = async (req: Request, res: Response) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/project/workprogress/${req.params.daoId}`);
            res.status(200).send({ message: 'Work progress fetched successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching work progress',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    addInviteForProject = async (req: Request, res: Response) => {
        try {
            const invite_code = req.params.inviteCode;
            const member_id = req.params.memberId;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/byinvite`, {
                invite_code: invite_code,
                member_id: member_id,
            });

            res.status(200).send({ message: 'Invite added successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while adding invite',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getInvestmentProjectForDAO = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/project/investment/${daoId}`);
            res.status(200).send({ message: 'Investment project fetched successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching investment project',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updatePinnedProject = async (req: Request, res: Response) => {
        try {
            const project_id: string = req.body.projectId;
            const link_id = req.body.linkId;
            const pinned: boolean = req.body.pinned;
            const updated_by = req.body.updatedBy;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/update/pinned`, {
                project_id: project_id,
                pinned: pinned,
                updated_by: updated_by,
                link_id: link_id,
            });

            if (pinned && result.data.updated) {
                return res.status(200).send({ message: 'Project pinned updated successfully', data: result.data });
            } else if (!pinned && result.data.updated) {
                return res.status(200).send({ message: 'Project pinned updated successfully', data: result.data });
            } else if (pinned && !result.data.updated) {
                return res.status(400).send({ message: 'Cannot pin more than 4 projects', data: result.data });
            } else {
                return res.status(400).send({ message: 'Cannot unpin project', data: result.data });
            }
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while updating project pinned',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    archiveProject = async (req: Request, res: Response) => {
        try {
            const project_id: string = req.body.projectId;
            const is_archived: boolean = req.body.archived;
            const updated_by: string = req.body.updatedBy;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/archive`, {
                project_id,
                is_archived,
                updated_by,
            });
            res.status(201).send({ message: 'Project archive updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while archiving project', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getArchivedProjectByMemberDAO = async (req: Request, res: Response) => {
        try {
            const memberId: string = req.body.member_id;
            const daos: DAODetail[] = req.body.daos;
            //let daoAccess = res.locals.access;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/project/bymemberdao/archive`, {
                member_id: memberId,
                daos: daos,
            });

            const projects = result.data.projects;
            let projectResponses: ProjectResponse[] = [];
            let memberList: IMember[] = [];
            if (projects) {
                const depMap = await getDepartments(projects);
                for (const project of projects) {
                    const daoAccess = await getMemberAccessForDAO(memberId, project.link_id);
                    let highestAccess = getVisibilityAccessLevel(
                        daoAccess,
                        project.access,
                        project.visibility,
                        project.project_type
                    );
                    highestAccess =
                        highestAccess === 'manage_dao' || highestAccess === 'manage_project'
                            ? AccessEnums.AccessType.MANAGE_PROJECT
                            : highestAccess;

                    if (project.contributors.length > 0) {
                        memberList = await bulkMemberMap(project.contributors!);
                    }
                    if (highestAccess !== 'hidden') {
                        projectResponses.push({
                            ...project,
                            access: highestAccess,
                            tasks: [],
                            contributor_list: memberList,
                        });
                    }
                }
                projectResponses = projectResponses.map((project: any) => {
                    project.department = depMap.get(project.department) || '';
                    return project;
                });
                return res.status(200).send({ message: 'Projects fetched successfully', data: projectResponses });
            } else {
                return res.status(200).send({ message: 'Projects fetched successfully', data: [] });
            }
        } catch (err: any) {
            console.log(err);
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching projects', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
}
