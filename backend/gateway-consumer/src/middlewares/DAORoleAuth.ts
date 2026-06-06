import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AccessResponse } from '@samudai_xyz/gateway-consumer-types';
import { NotAuthorisedError } from '../errors/authError';
import { getDAOAccessForRole } from '../lib/accessHelpers';

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

// export const adminRoleAuth = async (req: Request, res: Response, next: NextFunction) => {
//   const jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;
//   if (!jwtToken) {
//     return next();
//   }
//   const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
//   const result = await getAccessRoles(payload.member_id, req.query.daoId);
//   console.log(result);
//   if (!result.admin) {
//     return res.status(401).send({ message: 'Member does not have access for this action' });
//   }

//   next();
// };

// export const memberRoleAuth = async (req: Request, res: Response, next: NextFunction) => {
//   const jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;
//   if (!jwtToken) {
//     return next();
//   }
//   const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
//   const result = await getAccessRoles(payload.member_id, req.query.daoId);
//   console.log(result);
//   if (!result.view_access) {
//     return res.status(401).send({ message: 'Member does not have access for this action' });
//   }

//   next();
// };

//Should have access to certain roles only

async function managerDAOWorker(req: Request, res: Response) {
    let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

    const daoId = req.headers.daoid as string;
    if (jwtToken.startsWith('Bearer ')) {
        jwtToken = jwtToken.slice(7, jwtToken.length);
    }

    if (!jwtToken || jwtToken === '' || !daoId) {
        throw new NotAuthorisedError('Token/DAO not provided');
    }

    const payload: MemberPayload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
    const result: AccessResponse = await getDAOAccessForRole(payload.member_id, daoId);

    return result;
}

export const manageDAOAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result.access.manage_dao) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const manageProjectAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result.access.manage_project) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const managePaymentAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result.access.manage_payment) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const manageJobAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result.access.manage_job) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const manageForumAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result.access.manage_forum) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const viewAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result.access.view) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            res.locals.access = result.accessLevel;
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const hiddenAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const accessForMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result) {
            throw new NotAuthorisedError('Member does not have access for this action');
        } else {
            res.locals.access = result;
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const dashbhoardViewAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result: AccessResponse = await managerDAOWorker(req, res);
        if (!result.access.view) {
            //throw new NotAuthorisedError('Member does not have access for this action');
            res.locals.default = false;
            next();
        } else {
            res.locals.default = true;
            next();
        }
    } catch (err) {
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};

export const memberProjectViewAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

        const daoId = req.headers.daoid as string;
        if (jwtToken.startsWith('Bearer ')) {
            jwtToken = jwtToken.slice(7, jwtToken.length);
        }

        if (!jwtToken) {
            throw new NotAuthorisedError('Token/DAO not provided');
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;
        const result = await getDAOAccessForRole(payload.member_id, daoId);
        if (!result.access.view) {
            res.locals.access = '';
            next();
        } else {
            res.locals.access = result.accessLevel;
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(401).send({ message: 'Member does not have access for this action' });
    }
};
