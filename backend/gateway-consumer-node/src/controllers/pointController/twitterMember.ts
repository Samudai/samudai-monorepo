import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointTwitterMemberController {
    addTwitterMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const twitter = req.body.twitter;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twittermember/add`, {
                twitter,
            });
            new CreateSuccess(res, 'Twitter', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Twitter'));
        }
    };

    updateTwitterMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const twitter = req.body.twitter;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twittermember/update`, {
                twitter,
            });
            new UpdateSuccess(res, 'Updated twitter', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a twitter'));
        }
    };

    getTwitterMemberById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_POINT}/twittermember/getbyid/${memberId}`);
            new FetchSuccess(res, 'Fetch Twitter Member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Twitter Member'));
        }
    };
}
