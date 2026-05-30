import axios from 'axios';
import {
    CreateNotionTaskParam,
    ProjectEnums,
    NotionTaskResponse,
    ProjectResponse,
    Payout,
    IMember,
    Project,
    Task,
    TaskFormResponse,
} from '@samudai_xyz/gateway-consumer-types';
import { bulkMemberMap } from './memberUtils';
import { getMemberIDs } from './notion';

const projectService = process.env.SERVICE_PROJECT;

export type DaoDetailParam = {
    dao_id: string;
    roles: string[];
};

export const createProjectFromNotion = async (
    database: any,
    member_id: string,
    dao_id: string,
    department: string
): Promise<string> => {
    try {
        const description = `Imported from Notion - ${database.url}`;
        const project: Project = {
            project_id: '',
            link_id: dao_id,
            type: ProjectEnums.LinkType.DAO,
            project_type: ProjectEnums.ProjectType.DEFAULT,
            title: database.title[0].plain_text,
            description: description,
            visibility: ProjectEnums.Visibility.PRIVATE,
            created_by: member_id,
            department: department,
            completed: false,
            pinned: false,
        };
        const result = await axios.post(`${projectService}/project/create`, {
            project,
        });
        return result.data.project_id;
    } catch (err: any) {
        throw err;
    }
};

export const createTaskFromNotion = async (params: CreateNotionTaskParam, pages: any) => {
    try {
        // !beware internal error are sometimes not catched here
        const magicNumber = 65536.0;
        let backlogCount = 1.0,
            todoCount = 1.0,
            inProgressCount = 1.0,
            inReviewCount = 1.0,
            doneCount = 1.0;
        const tasks: string[] = [];
        for (const page of pages) {
            const task: Task = {
                task_id: '',
                project_id: params.project_id,
                description: `Imported from Notion - ${page.url}`,
                col: 1,
                created_by: params.member_id,
                title: '',
                position: 1.0,
                notion_page: page.id,
                assignee_member: [],
                payout: [],
            };

            for (const [property, value] of Object.entries(page.properties)) {
                const data: any = value;
                if (data.type == 'title') {
                    if (data.title ? Object.values(data.title).length : 0 > 0) {
                        task.title = data.title[0].plain_text;
                    }
                } else if (data.type == 'select' && property == params.notion_property) {
                    params.property.forEach((notionProperty) => {
                        if (data.select?.name == notionProperty.value) {
                            if (notionProperty.field == ProjectEnums.TaskStatus.BACKLOG) {
                                task.col = 1;
                                task.position = magicNumber * backlogCount;
                                backlogCount += 1.0;
                            } else if (notionProperty.field == ProjectEnums.TaskStatus.TODO) {
                                task.col = 2;
                                task.position = magicNumber * todoCount;
                                todoCount += 1.0;
                            } else if (notionProperty.field == ProjectEnums.TaskStatus.IN_PROGRESS) {
                                task.col = 3;
                                task.position = magicNumber * inProgressCount;
                                inProgressCount += 1.0;
                            } else if (notionProperty.field == ProjectEnums.TaskStatus.IN_REVIEW) {
                                task.col = 4;
                                task.position = magicNumber * inReviewCount;
                                inReviewCount += 1.0;
                            } else if (notionProperty.field == ProjectEnums.TaskStatus.DONE) {
                                task.col = 5;
                                task.position = magicNumber * doneCount;
                                doneCount += 1.0;
                            }
                        }
                    });
                } else if (data.type == 'people' && property == params.notion_property && data.people.length > 0) {
                    const members = await getMemberIDs(data.people);
                    task.assignee_member = members;
                }
            }

            const result = await axios.post(`${projectService}/task/create`, {
                task,
            });
            tasks.push(result.data.task_id);
        }
        return tasks;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getNotionTasks = async (member_id: string, memberDao: DaoDetailParam[]): Promise<NotionTaskResponse[]> => {
    try {
        const result = await axios.get(`${projectService}/notion/getnotiontasks`, {
            params: {
                member_id,
                daos: memberDao,
            },
        });
        return result.data;
    } catch (err: any) {
        throw err;
    }
};

export const assignMemberToNotionTask = async (task_id: string, member_id: string) => {
    try {
        const result = await axios.post(`${projectService}/task/notion/assignee`, {
            task_id,
            assignee: member_id,
            updated_by: member_id,
        });
        return result.data;
    } catch (err: any) {
        throw err;
    }
};

export const mapTaskFormResponseToTask = (formTaskResponse: TaskFormResponse): Task => {
    const taskResponse: Task = {
        task_id: '',
        project_id: formTaskResponse.project_id,
        title: formTaskResponse.title,
        description: '',
        col: formTaskResponse.col,
        created_by: '',
        updated_by: formTaskResponse.updated_by,

        assignee_member: formTaskResponse.assignee_member,
        assignee_clan: formTaskResponse.assignee_clan,
        position: formTaskResponse.position,
        payout: [],

        //assignees?: IMember[];

        created_at: formTaskResponse.created_at,
        updated_at: formTaskResponse.updated_at,

        //Formresponse optional fields
        response_id: formTaskResponse.response_id,
        response_type: formTaskResponse.response_type,
        mongo_object: formTaskResponse.mongo_object,
        discussion_id: formTaskResponse.discussion_id,
    };

    return taskResponse;
};

export const getTaskContributors = async (project_id: string): Promise<IMember[]> => {
    try {
        interface IContributor {
            [key: string]: number;
        }
        const result = await axios.get(`${process.env.SERVICE_PROJECT}/project/contributor/${project_id}`);

        const taskCount: IContributor = result.data;
        const memberIds = Object.keys(result.data);
        // todo - optimise with member cache
        const memberList = await bulkMemberMap(memberIds);

        const contributors: IMember[] = memberList.map((m: any) => {
            // todo: fix datatype here
            return {
                member_id: m.member_id,
                name: m.name,
                username: m.username,
                profile_picture: m.profile_picture,
            };
        });

        return contributors;
    } catch (err: any) {
        throw err;
    }
};

export const getProject = async (project_id: string): Promise<Project | null> => {
    try {
        const result = await axios.get(`${process.env.SERVICE_PROJECT}/project/${project_id}`);
        return result.data;
    } catch (err) {
        return null;
    }
};

export const getDepartments = async (projects: ProjectResponse[]): Promise<any | null> => {
    try {
        const departments = projects
            .filter((project: any) => project.department)
            .map((project: any) => {
                return {
                    dao_id: project.link_id,
                    department_id: project.department,
                };
            });

        const depMap = new Map();
        await Promise.all(
            departments.map(async (department: any) => {
                const departmentResponse = await axios.get(
                    `${process.env.SERVICE_DAO}/department/list/${department.dao_id}`
                );
                if(departmentResponse.data){
                    departmentResponse.data.forEach((dep: any) => {
                        if (dep.department_id === department.department_id) {
                            depMap.set(dep.department_id, dep.name);
                        }
                    });
                }
            })
        );
        return depMap;
    } catch (err) {
        return err;
    }
};

export const updatePayouts = async (payouts: Payout[]) => {
    try {
        const updatedPayouts = await Promise.all(
            payouts?.map(async (payout: Payout) => {
                const resp = await axios.get(`${process.env.SERVICE_DAO}/provider/exists/${payout.provider_id}`);
                if (resp.data.provider) {
                    return { ...payout, provider_exists: true, provider: resp.data.provider };
                } else {
                    return { ...payout, provider_exists: false };
                }
            })
        );
        return updatedPayouts;
    } catch (err) {
        return err;
    }
};

export const updatePayout = async (data: any) => {
    try {
        const updatedPayouts = await Promise.all(
            data?.payout?.map(async (payout: Payout) => {
                const resp = await axios.get(`${process.env.SERVICE_DAO}/provider/exists/${payout.provider_id}`);
                if (resp.data.provider) {
                    return { ...payout, provider_exists: true, provider: resp.data.provider };
                } else {
                    return { ...payout, provider_exists: false };
                }
            })
        );

        return { ...data, payout: updatedPayouts };
    } catch (err) {
        return err;
    }
};
