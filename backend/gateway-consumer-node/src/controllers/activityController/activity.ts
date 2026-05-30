import axios from 'axios';
import { Request, Response } from 'express';
import { Activity, CancellationFeedback, Feedback } from '@samudai_xyz/gateway-consumer-types';

export class ActivityController {
    createActivity = async (req: Request, res: Response) => {
        try {
            const activity: Activity = req.body.activity;
            const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/activity/add`, {
                activity: activity,
            });
            res.status(201).send({ message: 'Activity created successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while adding Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getActivityByDAO = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/activity/dao/${daoId}`);
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching DAO Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getActivitybyActionForDAO = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const action = req.params.action;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/activity/action/${daoId}/${action}`);
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching DAO Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getActivitybyMemberForDAO = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/activity/member/${daoId}/${memberId}`);
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching DAO Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getActivityByVisibility = async (req: Request, res: Response) => {
        try {
            const visibility = req.params.visibility;
            const daoId = req.params.daoId;
            const result = await axios.get(
                `${process.env.SERVICE_ACTIVITY}/activity/visibility/${daoId}/${visibility}`
            );
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getActivityByProject = async (req: Request, res: Response) => {
        try {
            const projectId = req.params.projectId;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/activity/project/${projectId}`);
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching Project Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getActivityByTask = async (req: Request, res: Response) => {
        try {
            const taskId = req.params.taskId;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/activity/task/${taskId}`);
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching Task Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getDiscussionActivity = async (req: Request, res: Response) => {
        try {
            const discussionId = req.params.discussionId;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/activity/discussion/${discussionId}`);
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching Discussion Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getActivityForMember = async (req: Request, res: Response) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/activity/get/member/${memberId}`);
            res.status(200).send({ message: 'Activity fetched successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching Member Activity',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    addFeedbackForSamudai = async (req: Request, res: Response) => {
        try {
            const feedback: Feedback = req.body.feedback;
            const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/feedback/samudai/add`, {
                feedback,
            });
            res.status(200).send({ message: 'Feedback added successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching Adding Feedback',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
    addCancellationFeedbackForSamudai = async (req: Request, res: Response) => {
        try {
            const feedback: CancellationFeedback = req.body.feedback;
            const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/feedback/samudai/addCancellation`, {
                feedback,
            });
            res.status(200).send({ message: 'Cancellation Feedback added successfully', data: result.data.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while fetching Adding Feedback',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
}
