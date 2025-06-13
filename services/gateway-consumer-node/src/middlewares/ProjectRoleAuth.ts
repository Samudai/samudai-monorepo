import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ProjAccessResponse } from '@samudai_xyz/gateway-consumer-types';
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

export const projectManageAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

        const projectId = req.headers.projectid as string;

        if (jwtToken.startsWith('Bearer ')) {
            jwtToken = jwtToken.slice(7, jwtToken.length);
        }

        if (!jwtToken || !projectId) {
            throw new NotAuthorisedError('Token/ProjectId not provided');
        }

        const projectData = await getProject(projectId);

        if (!projectData) {
            throw new NotAuthorisedError('Project not found');
        }

        const daoId = projectData.type === 'dao' ? projectData.link_id : '';

        const memberId = projectData.type === 'member' ? projectData.link_id : null;

        const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;

        if (memberId && memberId === payload.member_id) {
            next();
        } else {
            const result: ProjAccessResponse = await getProjectAccess(payload.member_id, projectId, daoId);
            if (!result.access.manage_project) {
                throw new NotAuthorisedError('Member does not have access for this action');
            } else {
                res.locals.member_id = payload.member_id;
                res.locals.projectAccess = result.accessLevel;
                next();
            }
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const taskCreateAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

        const projectId = req.headers.projectid as string;

        if (jwtToken.startsWith('Bearer ')) {
            jwtToken = jwtToken.slice(7, jwtToken.length);
        }

        if (!jwtToken || !projectId) {
            throw new NotAuthorisedError('Token/DAO/ProjectId not provided');
        }

        const projectData = await getProject(projectId);

        if (!projectData) {
            throw new NotAuthorisedError('Project not found');
        }

        const daoId = projectData.type === 'dao' ? projectData.link_id : '';

        const memberId = projectData.type === 'member' ? projectData.link_id : null;

        const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
        if (memberId && memberId === payload.member_id) {
            next();
        } else {
            const result = await getProjectAccess(payload.member_id, projectId, daoId);
            if (!result.access.create_task) {
                throw new NotAuthorisedError('Member does not have access for this action');
            } else {
                res.locals.projectAccess = result.accessLevel;
                next();
            }
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const projectViewAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

        const projectid = req.headers.projectid as string;
        if (jwtToken.startsWith('Bearer ')) {
            jwtToken = jwtToken.slice(7, jwtToken.length);
        }

        if (!jwtToken || !projectid) {
            throw new NotAuthorisedError('Token/DAO not provided');
        }

        const projectData = await getProject(projectid);

        if (!projectData) {
            throw new NotAuthorisedError('Project not found');
        }

        if (projectData.type === 'member') {
            next();
        } else {
            const daoId = projectData.type === 'dao' ? projectData.link_id : '';

            const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
            const result = await getProjectAccess(payload.member_id, projectid, daoId);
            if (!result.access.view) {
                throw new NotAuthorisedError('Member does not have access for this action');
            } else {
                res.locals.projectAccess = result.accessLevel;
                next();
            }
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

// export const hiddenAccess = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

//         const projectid = req.headers.projectid as string;
//         if (jwtToken.startsWith('Bearer ')) {
//             jwtToken = jwtToken.slice(7, jwtToken.length);
//         }

//         if (!jwtToken || !projectid) {
//             throw new NotAuthorisedError('Token/DAO not provided');
//         }
//         const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
//         const result = await getAccessForRole(payload.member_id, projectid);
//         if (!result) {
//             throw new NotAuthorisedError('Member does not have access for this action');
//         } else {
//             next();
//         }
//     } catch (err) {
//         return res.status(401).send({ message: 'Member does not have access for this action' });
//     }
// };

// export const accessForMember = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

//         const projectid = req.headers.projectid as string;
//         if (jwtToken.startsWith('Bearer ')) {
//             jwtToken = jwtToken.slice(7, jwtToken.length);
//         }

//         if (!jwtToken || !projectid) {
//             throw new NotAuthorisedError('Token/DAO not provided');
//         }
//         const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
//         const result = await getAccessForRole(payload.member_id, projectid);
//         if (!result) {
//             throw new NotAuthorisedError('Member does not have access for this action');
//         } else {
//             res.locals.access = result;
//             next();
//         }
//     } catch (err) {
//         return res.status(401).send({ message: 'Member does not have access for this action' });
//     }
// };
