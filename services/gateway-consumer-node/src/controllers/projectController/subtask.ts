import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { SubTask, IMember, SubTaskResponse } from '@samudai_xyz/gateway-consumer-types';
import { UpdateSuccess } from '../../lib/helper/Responsehandler';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { updatePayouts, updatePayout } from '../../lib/project';
import { bulkMemberMap, mapMemberToUsername } from '../../lib/memberUtils';

export class SubTaskController {
    createSubtask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtask: SubTask = req.body.subtask;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/create`, {
                subtask: subtask,
            });

            res.status(201).send({ message: 'Subtask Created Successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while creating subtask', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateSubtask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtask: SubTask = req.body.subtask;
            if (subtask.payout) {
                const resp = await axios.post(`${process.env.SERVICE_PROJECT}/payout/create`, {
                    payout: subtask.payout,
                });
            }

            subtask.payout = [];
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update`, {
                subtask: subtask,
            });

            res.status(201).send({ message: 'Subtask Updated Successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while updating subtask', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateSubTaskColumnBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtasks = req.body.subtasks;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/columnbulk`, {
                subtasks: subtasks,
            });
            new UpdateSuccess(res, 'SubTask ColumnBulk', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating subtask columnbulk'));
        }
    };

    getAllSubtasks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/subtask/allsubtask/${req.params.projectId}`);

            if (result.data?.subtasks?.length > 0) {
                result.data.subtasks = await Promise.all(
                    result.data.subtasks.map(async (subtask: SubTaskResponse) => {
                        let assigned_members: IMember[] = [];
                        let poc_member: IMember;

                        if (subtask.assignee_member && subtask.assignee_member.length > 0) {
                            const members = await bulkMemberMap(subtask.assignee_member);
                            assigned_members = members;
                            subtask = { ...subtask, assignees: assigned_members };
                        }

                        if (subtask.poc_member_id) {
                            const memberResult = await mapMemberToUsername(subtask.poc_member_id);
                            if (memberResult) {
                                poc_member = {
                                    member_id: memberResult.member_id,
                                    username: memberResult.username,
                                    profile_picture: memberResult.profile_picture,
                                    name: memberResult.name,
                                };
                                subtask = { ...subtask, poc_member: poc_member };
                            }
                        }

                        const updatedPayout = await updatePayouts(subtask?.payout!);

                        const det = await mapMemberToUsername(subtask.created_by);
                        if (det) {
                            const created_by_member: IMember = {
                                member_id: det.member_id,
                                username: det.username,
                                profile_picture: det.profile_picture,
                                name: det.name,
                            };
                            return { ...subtask, created_by_member: created_by_member };
                        }
                        return { ...subtask, payout: updatedPayout };
                    })
                );
            }

            res.status(201).send({ message: 'Subtasks fetched successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while fetching subtasks', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getSubtask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/subtask/${req.params.subtaskId}`);

            let subtask: SubTask = result.data;

            if (subtask) {
                subtask = await updatePayout(subtask);
            }

            let subtaskResponse: SubTaskResponse = { ...subtask };
            let assigned_members: IMember[] = [];
            let poc_member: IMember;

            if (subtask.assignee_member) {
                if (subtask.assignee_member && subtask.assignee_member.length > 0) {
                    const members = await bulkMemberMap(subtask.assignee_member);
                    assigned_members = members;
                }
                subtaskResponse = { ...subtask, assignees: assigned_members };
            }
            if (subtask.poc_member_id) {
                const memberResult = await mapMemberToUsername(subtask.poc_member_id);
                if (memberResult) {
                    poc_member = {
                        member_id: memberResult.member_id,
                        username: memberResult.username,
                        profile_picture: memberResult.profile_picture,
                        name: memberResult.name,
                    };
                    subtaskResponse = { ...subtaskResponse, poc_member: poc_member };
                }
            }

            res.status(201).send({ message: 'Subtask fetched successfully', data: subtaskResponse });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while fetching subtask', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    deleteSubtask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/subtask/${req.params.subtaskId}`);

            res.status(201).send({ message: 'Subtask deleted successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while deleting subtask', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    // REDUNDANT
    // updatePayout = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const subtask_id = req.body.subtask_id;
    //         const payout = req.body.payout;
    //         const updated_by = req.body.updated_by;

    //         const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/payout`, {
    //             subtask_id: subtask_id,
    //             payout: payout,
    //             updated_by: updated_by,
    //         });

    //         new UpdateSuccess(res, 'SUBTASK PAYOUT', result);
    //     } catch (err: any) {
    //         next(new ErrorException(err, 'Error while updating subtask payout'));
    //     }
    // };

    updateSubTaskAssociateJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtask_id = req.body.subtask_id;
            const associated_job_type = req.body.associated_job_type;
            const associated_job_id = req.body.associated_job_id;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/associatejob`, {
                subtask_id: subtask_id,
                associated_job_type: associated_job_type,
                associated_job_id: associated_job_id,
            });

            new UpdateSuccess(res, 'TASK PAYMENT STATUS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task associate job'));
        }
    };
    updateSubTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtask_id: string = req.body.subtaskId;
            const completed: boolean = req.body.completed;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/status`, {
                subtask_id: subtask_id,
                completed: completed,
            });

            res.status(201).send({ message: 'Subtask status updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while updating subtask status', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateSubTaskColumn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtask_id: string = req.body.subtaskId;
            const col: number = req.body.col;
            const updated_by: string = req.body.updatedBy;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/column`, {
                subtask_id,
                col,
                updated_by,
            });
            res.status(201).send({ message: 'Subtask column updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while updating subtask column', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateSubtaskPosition = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtask_id: string = req.body.subtaskId;
            const position: number = req.body.position;
            const updated_by: string = req.body.updatedBy;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/position`, {
                subtask_id,
                position,
                updated_by,
            });
            res.status(201).send({ message: 'Subtask position updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while updating subtask status', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    archiveSubtask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subtask_id: string = req.body.subtaskId;
            const archived: number = req.body.archived;
            const updated_by: string = req.body.updatedBy;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/archive`, {
                subtask_id,
                archived,
                updated_by,
            });
            res.status(201).send({ message: 'Subtask archive updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while archiving subtask', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getAllArchivedSubtask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(
                `${process.env.SERVICE_PROJECT}/subtask/getall/archived/${req.params.projectId}`
            );

            if (result.data?.subtasks?.length > 0) {
                result.data.subtasks = await Promise.all(
                    result.data.subtasks.map(async (subtask: SubTaskResponse) => {
                        const updatedPayout = await updatePayouts(subtask?.payout!);

                        const det = await mapMemberToUsername(subtask.created_by);
                        if (det) {
                            const created_by_member: IMember = {
                                member_id: det.member_id,
                                username: det.username,
                                profile_picture: det.profile_picture,
                                name: det.name,
                            };
                            return { ...subtask, created_by_member: created_by_member };
                        }
                        return { ...subtask, payout: updatedPayout };
                    })
                );
            }

            res.status(201).send({ message: 'Archived Subtasks fetched successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while fetching subtasks', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
}
