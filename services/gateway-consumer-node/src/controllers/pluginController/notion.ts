import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { getDAOForMember } from '../../lib/daoHelpers';
import { auth, getAllDatabase, getDatabase, getDatabaseProperties, getPages } from '../../lib/notion';
import { createProjectFromNotion, createTaskFromNotion } from '../../lib/project';
import { CreateNotionTaskParam, PropertyValue } from '@samudai_xyz/gateway-consumer-types';

export class NotionController {
    serviceNotion = `${process.env.SERVICE_PLUGIN}/plugins/notion`;

    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.body.member_id;
            const code: string = req.body.code;
            const redirect_uri: string = req.body.redirectUri;
            const result = await auth(member_id, code, redirect_uri);
            // fetch DAOs of member
            const daos = await getDAOForMember(member_id);

            // if (!!daos) {
            //     const memberDao: DaoDetailParam[] = [];
            //     daos.forEach((value: MemberDAOView) => {
            //         const rolesArr: string[] = value.roles?.map((value: DAORole) => value.role_id);
            //         memberDao.push({
            //             dao_id: value.dao_id,
            //             roles: rolesArr,
            //         });
            //     });
            //     // Get all possible tasks imported from notion
            //     const tasks = await getNotionTasks(member_id, memberDao);
            //     if (!!tasks) {
            //         for (const task of tasks) {
            //             const page = await getPageByID(task.notion_page);
            //             console.log('page', page);
            //             const property = page.properties[task.notion_property];
            //             console.log(property);
            //             // check if user is assigned to any
            //             let assigned: boolean = false;
            //             if (property.type == 'people' && property.people?.length > 0) {
            //                 property.people.forEach((value) => {
            //                     if (value.id == result.owner.id) {
            //                         assigned = true;
            //                     }
            //                 });
            //             }
            //             // Assign member to task on samudai
            //             if (assigned) {
            //                 await assignMemberToNotionTask(task.task_id, member_id);
            //             }
            //         }
            //     }
            // }

            // let onboardingStatus = false;

            // const onboardingResult = await axios.get(`${process.env.SERVICE_MEMBER}/onboarding/${member_id}`);

            // if (onboardingResult.data) {
            //     if (
            //         onboardingResult.data.onboarding.admin === false &&
            //         onboardingResult.data.onboarding.contributor === false
            //     ) {
            //         onboardingStatus = false;
            //     } else if (
            //         onboardingResult.data.onboarding.admin === true ||
            //         onboardingResult.data.onboarding.contributor === true
            //     ) {
            //         onboardingStatus = true;
            //     } else {
            //         onboardingStatus = false;
            //     }
            // } else {
            //     onboardingStatus = false;
            // }

            // if (!onboardingStatus) {
            //     const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
            //         link_id: member_id,
            //         step_id: MemberOnboardingFlowStep.INTEGRATIONS,
            //         value: {
            //             notion: {
            //                 code: code,
            //                 redirect_uri: redirect_uri,
            //             },
            //         },
            //     });
            // }
            return res.status(200).send({
                message: 'Notion Auth successful',
                data: result,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Notion Auth failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from notion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getAllDatabase = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.body.member_id;
            const result = await getAllDatabase(member_id);
            return res.status(200).send({
                message: 'Get all database successful',
                data: result,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Get all database failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getDatabaseProperties = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.member_id;
            const database_id = req.body.database_id;
            const result = await getDatabaseProperties(member_id, database_id);
            return res.status(200).send({
                message: 'Get database properties successful',
                data: result,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Get database properties failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    importDatabase = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.body.member_id;
            const database_id: string = req.body.database_id;
            const dao_id: string = req.body.dao_id;
            const property: PropertyValue[] = req.body.property;
            const department: string = req.body.department;
            const notion_property: string = req.body.notion_property;

            const database = await getDatabase(member_id, database_id);
            const project_id = await createProjectFromNotion(database, member_id, dao_id, department);
            const pages = await getPages(member_id, database_id);
            const params: CreateNotionTaskParam = {
                member_id: member_id,
                database_id: database_id,
                dao_id: dao_id,
                property: property,
                project_id: project_id,
                notion_property: notion_property,
            };
            const result = await createTaskFromNotion(params, pages);
            return res.status(200).send({
                message: 'Import notion database successful',
                data: result,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Import database failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from notion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    isExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.params.memberId;
            const result = await axios.get(`${this.serviceNotion}/exists/${member_id}`);
            return res.status(200).send({
                message: 'Check if notion account exists successful',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Check if notion account exists failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from notion',
                    error: JSON.stringify(err.request),
                });
            }
        }
    };

    deleteNotion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.params.memberId;
            const result = await axios.delete(`${this.serviceNotion}/${member_id}`);
            return res.status(200).send({
                message: 'Delete notion account successful',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Delete notion account failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from notion',
                    error: JSON.stringify(err),
                });
            }
        }
    };
}
