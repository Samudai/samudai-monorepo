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
import { bulkMemberMap, mapMemberToUsername } from '../../lib/memberUtils';
import { getTaskContributors } from '../../lib/project';
import {
    ClanView,
    MemberEvent,
    DiscoveryEnums,
    IMember,
    Task,
    TaskAssign,
    TaskResponse,
    Payout,
    AccessEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { updatePayouts, updatePayout } from '../../lib/project';

export class TaskController {
    createTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task: Task = req.body.task;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/create`, {
                task: task,
            });

            //col-> getall tasks -> total col for taht task ->  numb of task*magicNumber
            if (result.status === 200) {
                const memberEvent: MemberEvent = {
                    member_id: '',
                    dao_id: '',
                    event_type: DiscoveryEnums.MemberEventType.TASK_CREATED,
                    event_context: DiscoveryEnums.MemberEventContext.TASK,
                };
                try {
                    await axios.post(`${process.env.SERVICE_DISCOVERY}/events/member/create`, {
                        event: memberEvent,
                    });
                    new CreateSuccess(res, 'TASK', result);
                } catch (err: any) {
                    new CreateSuccess(res, 'TASK', result);
                }
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating task'));
        }
    };

    updateTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task: Task = req.body.task;

            if (task.payout) {
                const resp = await axios.post(`${process.env.SERVICE_PROJECT}/payout/create`, {
                    payout: task.payout,
                });
            }

            task.payout = [];
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update`, {
                task: task,
            });

            if (task.assignee_member && task.assignee_member?.length > 0) {
                await Promise.all(
                    task.assignee_member.map(async (assignee) => {
                        const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/add/formember`, {
                            member_id: assignee,
                            project_id: task.project_id,
                            access: AccessEnums.ProjectAccessType.MANAGE_PROJECT,
                        });
                    })
                );
            }

            new UpdateSuccess(res, 'TASK', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task'));
        }
    };

    addFeedBack = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId, feedback, updated_by } = req.body;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/feedback`, {
                task_id: taskId,
                feedback: feedback,
                updated_by: updated_by,
            });
            new AddSuccess(res, 'TASK FEEDBACK', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding feedback to task'));
        }
    };

    assignTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskAssign: TaskAssign = req.body.taskAssign;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/assignee`, {
                type: taskAssign.type,
                task_id: taskAssign.task_id,
                assignee_member: taskAssign.assignee_member,
                assignee_clan: taskAssign.assignee_clan,
                updated_by: taskAssign.updated_by,
            });

            if (taskAssign.assignee_member && taskAssign.assignee_member?.length > 0) {
                await Promise.all(
                    taskAssign.assignee_member.map(async (assignee) => {
                        const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/add/formember`, {
                            member_id: assignee,
                            project_id: taskAssign.project_id,
                            access: AccessEnums.ProjectAccessType.MANAGE_PROJECT,
                        });
                    })
                );
            }

            new CreateSuccess(res, 'TASK ASSIGNED', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while assigning task'));
        }
    };

    getTaskForProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: any = await axios.get(`${process.env.SERVICE_PROJECT}/task/alltask/${req.params.projectId}`);

            const contributors = await getTaskContributors(req.params.projectId);

            if (result.data?.tasks?.length > 0) {
                result.data.tasks = await Promise.all(
                    result.data.tasks.map(async (task: TaskResponse) => {
                        let assigned_members: IMember[] = [];
                        let poc_member: IMember;

                        if (task.assignee_member && task.assignee_member.length > 0) {
                            const members = await bulkMemberMap(task.assignee_member);
                            assigned_members = members;
                            task = { ...task, assignees: assigned_members };
                        }

                        if (task.poc_member_id) {
                            const memberResult = await mapMemberToUsername(task.poc_member_id);
                            if (memberResult) {
                                poc_member = {
                                    member_id: memberResult.member_id,
                                    username: memberResult.username,
                                    profile_picture: memberResult.profile_picture,
                                    name: memberResult.name,
                                };
                                task = { ...task, poc_member: poc_member };
                            }
                        }
                        const updatedPayout = await updatePayouts(task?.payout!);

                        const det = await mapMemberToUsername(task.created_by);
                        if (det) {
                            const created_by_member: IMember = {
                                member_id: det.member_id,
                                username: det.username,
                                profile_picture: det.profile_picture,
                                name: det.name,
                            };
                            return { ...task, created_by_member: created_by_member };
                        }
                        return { ...task, payout: updatedPayout };
                    })
                );
            }
            if (result.data.tasks) {
                res.status(200).send({
                    message: 'Task Found Successfully',
                    data: result.data.tasks,
                    contributors: contributors,
                });
            } else {
                res.status(400).send({ message: 'Task Not Found', data: [], contributors: contributors });
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching task for project'));
        }
    };

    getTaskById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/task/${req.params.taskId}`);

            let task: Task = result.data;
            task = await updatePayout(task);

            let taskResponse: TaskResponse = { ...task };
            let assigned_members: IMember[] = [];
            let poc_member: IMember;

            // task?.payout?.forEach(async (payouts) => {
            //     if (payouts.provider_id) {
            //         const resp = await axios.get(`${process.env.SERVICE_DAO}/provider/exists/${payouts.provider_id}`);
            //         if (resp.data.provider) {
            //             payouts.provider_exists = true;
            //         } else {
            //             payouts.provider_exists = false;
            //         }
            //     }
            // });

            if (task.assignee_member || task.assignee_clan) {
                if (task.assignee_member && task.assignee_member.length > 0) {
                    const members = await bulkMemberMap(task.assignee_member);
                    assigned_members = members;
                } else if (task.assignee_clan && task.assignee_clan.length > 0) {
                    let clans: ClanView[] = [];

                    for (let clanId of task.assignee_clan) {
                        const clanResult = await axios.get(`${process.env.SERVICE_CLAN}/clan/${clanId}`);
                        clans.push(clanResult.data.clan);
                    }

                    for (let clan of clans) {
                        assigned_members.push({
                            member_id: clan.clan_id,
                            username: clan.name,
                            profile_picture: clan.avatar,
                        });
                    }
                }
                taskResponse = { ...task, assignees: assigned_members };
            }
            if (task.poc_member_id) {
                const memberResult = await mapMemberToUsername(task.poc_member_id);
                if (memberResult) {
                    poc_member = {
                        member_id: memberResult.member_id,
                        username: memberResult.username,
                        profile_picture: memberResult.profile_picture,
                        name: memberResult.name,
                    };
                    taskResponse = { ...taskResponse, poc_member: poc_member };
                }
            }

            if (taskResponse.comments && taskResponse.comments.length > 0) {
                for (const comment of taskResponse.comments) {
                    const memberResult = await mapMemberToUsername(comment.author);
                    if (memberResult) {
                        comment.author_member = {
                            member_id: memberResult.member_id,
                            username: memberResult.username,
                            profile_picture: memberResult.profile_picture,
                            name: memberResult.name,
                        };
                    }
                }
            }

            new FetchSuccess(res, 'TASK', taskResponse);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching task'));
        }
    };

    updateTaskColumn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { task_id, col, updated_by, totalcol } = req.body;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/column`, {
                task_id: task_id,
                col: col,
                updated_by: updated_by,
            });

            if (col === totalcol) {
                try {
                    const result = await axios.get(`${process.env.SERVICE_PROJECT}/task/${task_id}`);

                    const payouts = result.data.payout;
                    const jobPayouts: any = [];
                    const projectPayouts: any = [];

                    payouts.forEach((payout: any) => {
                        if (payout.payment_type === 'Job') {
                            jobPayouts.push(payout);
                        } else {
                            projectPayouts.push(payout);
                        }
                    });

                    if (projectPayouts.length > 0) {
                        const resultProject = await axios.post(
                            `${process.env.SERVICE_PROJECT}/payout/update/initiated_by`,
                            {
                                payouts: projectPayouts,
                                initiated_by: updated_by,
                            }
                        );
                    }

                    if (jobPayouts.length > 0) {
                        const resultJob = await axios.post(`${process.env.SERVICE_JOB}/payout/update/initiated_by`, {
                            payouts: jobPayouts,
                            initiated_by: updated_by,
                        });
                    }
                } catch (err: any) {
                    next(new ErrorException(err, 'Error while updating task status'));
                }
            }
            new UpdateSuccess(res, 'TASK STATUS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task status'));
        }
    };

    deleteTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskId: string = req.params.taskId;
            // const member_id = res.locals.member_id;
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/task/${taskId}`);

            // if (result.status === 200) {
            //     const memberEvent: MemberEvent = {
            //         member_id: member_id,
            //         dao_id: '',
            //         event_type: MemberEventType.TASK_DELETED,
            //         event_context: MemberEventContext.TASK,
            //     };
            //     await axios.post(`${process.env.SERVICE_DISCOVERY}/events/member/create`, {
            //         event: memberEvent,
            //     });
            // }
            new DeleteSuccess(res, 'TASK', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting task'));
        }
    };

    // reviewTask = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const task_id = req.body.task_id;
    //         const feedback = req.body.feedback;
    //         const updated_by = req.body.updated_by;

    //         //Step 1: add feedback to task
    //         const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/feedback`, {
    //             task_id: task_id,
    //             feedback: feedback,
    //             updated_by: updated_by,
    //         });

    //         if (result.status === 201) {
    //             //Step 2: update task status to completed
    //             const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/updatestatus`, {
    //                 task_id: task_id,
    //                 status: 'done',
    //             });

    //             if (result.status === 200) {
    //                 const memberEvent: MemberEvent = {
    //                     member_id: updated_by,
    //                     event_type: MemberEventType.TASK_COMPLETED,
    //                     event_context: MemberEventContext.TASK,
    //                 };
    //                 await axios.post(`${process.env.SERVICE_DISCOVERY}/events/member/create`, {
    //                     event: memberEvent,
    //                 });
    //             }

    //             //based on completion we can dispurse the reward later based on payment mode selection
    //             return res.status(201).send({ message: 'Task Reviewed Successfully', data: result.data });
    //         }
    //     } catch (err: any) {
    //         if (err.response) {
    //             return res
    //                 .status(err.response.status)
    //                 .send({ message: 'Error while reviewing task', error: err.response.data });
    //         } else {
    //             return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
    //         }
    //     }
    // };

    updateTaskPosition = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const project_id = req.body.project_id;
            const task_id = req.body.task_id;
            const position = req.body.position;
            const status = req.body.col;
            const updated_by = req.body.updated_by;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/position`, {
                task_id: task_id,
                position: position,
                updated_by: updated_by,
                project_id: project_id,
                status: status,
            });
            new UpdateSuccess(res, 'TASK POSITION', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task position'));
        }
    };

    getMemberPersonalTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/task/personaltask/${req.params.memberId}`);

            if (result.data?.tasks?.length > 0) {
                const updatedData = result.data?.tasks.map(async (data: any) => {
                    const updatedPayout = await updatePayouts(data.payout);
                    return { ...data, payout: updatedPayout };
                });
                result.data.tasks = await Promise.all(updatedData);
            }

            new FetchSuccess(res, 'MEMBER PERSONAL TASKS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching member personal tasks'));
        }
    };

    getMemberAssignedTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/task/assignedtask/${req.params.memberId}`);

            if (result.data?.tasks?.length > 0) {
                const updatedData = result.data?.tasks.map(async (data: any) => {
                    const updatedPayout = await updatePayouts(data.payout);
                    let assigned_members: IMember[] = [];
                    if (data.assignee_member || data.assignee_clan) {
                        if (data.assignee_member && data.assignee_member.length > 0) {
                            const members = await bulkMemberMap(data.assignee_member);
                            assigned_members = members;
                        } else if (data.assignee_clan && data.assignee_clan.length > 0) {
                            let clans: ClanView[] = [];

                            for (let clanId of data.assignee_clan) {
                                const clanResult = await axios.get(`${process.env.SERVICE_CLAN}/clan/${clanId}`);
                                clans.push(clanResult.data.clan);
                            }

                            for (let clan of clans) {
                                assigned_members.push({
                                    member_id: clan.clan_id,
                                    username: clan.name,
                                    profile_picture: clan.avatar,
                                });
                            }
                        }
                    }

                    return { ...data, payout: updatedPayout, assignees: assigned_members };
                });
                result.data.tasks = await Promise.all(updatedData);
            }

            new FetchSuccess(res, 'MEMBER ASSIGNED TASKS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching member assigned tasks'));
        }
    };

    updateColumnBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasks = req.body.tasks;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/columnbulk`, {
                tasks: tasks,
            });
            new UpdateSuccess(res, 'Task Status', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task status'));
        }
    };

    updateVCClaimStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_id = req.body.task_id;
            const member_id = req.body.member_id;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/vcclaim`, {
                task_id: task_id,
                member_id: member_id,
            });
            new UpdateSuccess(res, 'TASK VC CLAIM STATUS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task vc claim status'));
        }
    };

    updateTaskPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_id = req.body.task_id;
            const payment_created = req.body.payment_created;
            const updated_by = req.body.updated_by;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/paymentcreated`, {
                task_id: task_id,
                payment_created: payment_created,
                updated_by: updated_by,
            });
            new UpdateSuccess(res, 'TASK PAYMENT STATUS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task payment status'));
        }
    };

    // REDUNDANT
    // updatePayout = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const task_id = req.body.task_id;
    //         const payout = req.body.payout;
    //         const updated_by = req.body.updated_by;

    //         const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/payout`, {
    //             task_id: task_id,
    //             payout: payout,
    //             updated_by: updated_by,
    //         });

    //         new UpdateSuccess(res, 'TASK PAYOUT', result);
    //     } catch (err: any) {
    //         next(new ErrorException(err, 'Error while updating task payout'));
    //     }
    // };

    updateTaskAssociateJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_id = req.body.task_id;
            const associated_job_type = req.body.associated_job_type;
            const associated_job_id = req.body.associated_job_id;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/associatejob`, {
                task_id: task_id,
                associated_job_type: associated_job_type,
                associated_job_id: associated_job_id,
            });

            new UpdateSuccess(res, 'TASK PAYMENT STATUS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task associate job'));
        }
    };

    archiveTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_id = req.body.task_id;
            const archive = req.body.archive;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/task/archivetask`, {
                task_id: task_id,
                archive: archive,
            });

            new UpdateSuccess(res, 'ARCHIVE TASK', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while archiving Task'));
        }
    };

    getArchivedTaskForProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: any = await axios.get(
                `${process.env.SERVICE_PROJECT}/task/allarchivetask/${req.params.projectId}`
            );

            const contributors = await getTaskContributors(req.params.projectId);

            if (result.data?.tasks?.length > 0) {
                result.data.tasks = await Promise.all(
                    result.data.tasks.map(async (task: TaskResponse) => {
                        const updatedPayout = await updatePayouts(task?.payout!);

                        const det = await mapMemberToUsername(task.created_by);
                        if (det) {
                            const created_by_member: IMember = {
                                member_id: det.member_id,
                                username: det.username,
                                profile_picture: det.profile_picture,
                                name: det.name,
                            };
                            return { ...task, created_by_member: created_by_member };
                        }
                        return { ...task, payout: updatedPayout };
                    })
                );
            }
            if (result.data.tasks) {
                res.status(200).send({
                    message: 'Task Found Successfully',
                    data: result.data.tasks,
                    contributors: contributors,
                });
            } else {
                res.status(400).send({ message: 'Task Not Found', data: [], contributors: contributors });
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching archived task for project'));
        }
    };
}
