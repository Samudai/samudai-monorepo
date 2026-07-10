import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateWaitlistEntry } from '@samudai/gateway-consumer-types';
import { AddSuccess } from '../../lib/helper/Responsehandler';

export class WaitlistController {
    createEntry = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email: CreateWaitlistEntry['email'] = req.params.email as string;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/waitlist/create`, {
                email: email,
            });
            new AddSuccess(res, 'WAITLIST', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member'));
        }
    };
}
