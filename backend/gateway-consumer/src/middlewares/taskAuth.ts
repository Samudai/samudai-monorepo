import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorisedError } from '../errors/authError';
import { getProjectAccess } from '../lib/accessHelpers';
import { getProject } from '../lib/project';

interface MemberPayload {
    member_id: string;
}

declare global {
    namespace Express {
        interface Request {
            currentMember: MemberPayload;
        }
    }
}

export const taskAccessAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

        //const dao_id = req.headers.daoid as string;
        if (jwtToken.startsWith('Bearer ')) {
            jwtToken = jwtToken.slice(7, jwtToken.length);
        }

        if (!jwtToken) {
            throw new NotAuthorisedError('Token/DAO not provided');
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;

        const { task_id } = req.body;

        const result = await axios.get(`${process.env.SERVICE_PROJECT}/task/${task_id}`);
        const { assignee_member } = result.data;

        const projectData = await getProject(result.data.project_id);

        const dao_id = projectData?.type === 'dao' ? projectData.link_id : '';

        const memberId = projectData?.type === 'member' ? projectData.link_id : null;

        const { member_id } = payload;

        if (dao_id !== '') {
            const roleAccess = await getProjectAccess(member_id, result.data.project_id, dao_id);
            if (
                assignee_member?.includes(member_id) ||
                roleAccess.access.create_task ||
                roleAccess.access.manage_dao ||
                roleAccess.access.manage_project
            ) {
                next();
            } else {
                res.status(401).send({ message: 'Unauthorized', error: 'Member does not have access for this action' });
            }
        } else if (memberId === member_id) {
            next();
        }
    } catch (err: any) {
        console.log(err);
        if (err.response) {
            return res
                .status(err.response.status)
                .send({ message: 'Error while checking task access auth', error: err.response.data });
        } else {
            return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
        }
    }
};

export const taskFormResponseAccessAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

        //const dao_id = req.headers.daoid as string;
        if (jwtToken.startsWith('Bearer ')) {
            jwtToken = jwtToken.slice(7, jwtToken.length);
        }

        if (!jwtToken) {
            throw new NotAuthorisedError('Token/DAO not provided');
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;

        const { response_id } = req.body;

        const result = await axios.get(`${process.env.SERVICE_PROJECT}/response/${response_id}`);
        const { assignee_member } = result.data;

        const projectData = await getProject(result.data.project_id);

        const dao_id = projectData?.type === 'dao' ? projectData.link_id : '';

        const memberId = projectData?.type === 'member' ? projectData.link_id : null;

        const { member_id } = payload;

        if (dao_id !== '') {
            const roleAccess = await getProjectAccess(member_id, result.data.project_id, dao_id);
            if (
                assignee_member?.includes(member_id) ||
                roleAccess.access.create_task ||
                roleAccess.access.manage_dao ||
                roleAccess.access.manage_project
            ) {
                next();
            } else {
                res.status(401).send({ message: 'Unauthorized', error: 'Member does not have access for this action' });
            }
        } else if (memberId === member_id) {
            next();
        }
    } catch (err: any) {
        if (err.response) {
            return res
                .status(err.response.status)
                .send({ message: 'Something went wrong while checking task access auth', error: err.response.data });
        } else {
            return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
        }
    }
};
