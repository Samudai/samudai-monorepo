import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { UniversalSuccess } from '../../lib/helper/Responsehandler';
import { MemberFilter } from '@samudai_xyz/gateway-consumer-types';

export class MemberDiscoveryController {
    discoverCaptain = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filter: MemberFilter = req.body.filter;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/discovercaptain`, {
                filter: filter,
            });
            new UniversalSuccess(res, 'CAPTAIN Discovered', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while discovering a captain'));
        }
    };

    discoverMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filter: MemberFilter = req.body.filter;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/discovermember`, {
                filter: filter,
            });
            new UniversalSuccess(res, 'MEMBER Discovered', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while discovering a member'));
        }
    };
}
