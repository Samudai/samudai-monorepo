import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateWaitlistEntry } from '@samudai_xyz/gateway-consumer-types';
import {
    AddSuccess,
    CreateSuccess,
    DeleteSuccess,
    FetchSuccess,
    UpdateSuccess,
} from '../../lib/helper/Responsehandler';

export class WaitlistController {
    createEntry = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email: CreateWaitlistEntry['email'] = req.params.email;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/waitlist/create`, {
                email: email,
            });
            new AddSuccess(res, 'WAITLIST', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member'));
        }
    };
}
