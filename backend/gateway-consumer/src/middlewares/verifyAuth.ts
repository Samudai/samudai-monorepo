import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { NotAuthorisedError } from '../errors/authError';

interface MemberPayload {
    member_id?: string;
    exp?: any;
    iat?: any;
}

declare global {
    namespace Express {
        interface Request {
            member?: MemberPayload;
        }
    }
}

/**
 * VerifyAuth and RequireAuth Middleware -> Helper
 * @param req
 * @param res
 * @param next
 */
export const requireVerifyAuth = (req: Request, res: Response, next: NextFunction) => {
    let jwtToken = req.headers['x-auth-token'] || req.headers.authorization || req.body.jwt;

    /* Require Auth Stage */
    if (jwtToken.startsWith('Bearer ')) {
        jwtToken = jwtToken.slice(7, jwtToken.length);

        if (!jwtToken || jwtToken === '') {
            throw new NotAuthorisedError('Token not provided');
        }

        /* Verify Auth Stage */
        try {
            const payload = jwt.verify(jwtToken, process.env.JWT_KEY!) as MemberPayload;

            // if (payload.siwe.expirationTime && Date.parse(payload.siwe.expirationTime) >= Date.now()) {
            //   throw new NotAuthorisedError('Invalid token, User is not Authorized');
            // }

            req.member = payload;
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new NotAuthorisedError('Token Expired, User is not Authorized');
            }

            throw new NotAuthorisedError('Invalid token, User is not Authorized');
        }
    }

    next();
};
