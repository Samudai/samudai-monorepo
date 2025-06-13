import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { FavouriteJob } from '@samudai_xyz/gateway-consumer-types';

export class JobsFavouriteController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const favourite: FavouriteJob = req.body.favourite;
            const result = await axios.post(`${process.env.SERVICE_JOB}/favourite/create`, {
                favourite,
            });
            new CreateSuccess(res, 'FAVOURITE', result);
        } catch (err: any) {
            if (
                err.response.data.error.includes('duplicate key value violates unique constraint') ||
                err.response.data.error.includes('no rows in result set')
            ) {
                return res.status(409).json({ message: 'Favourite already present' });
            } else {
                next(new ErrorException(err, 'Error while creating a favourite'));
            }
        }
    };

    getFavouriteForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 10;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_JOB}/favourite/bymember/${req.params.memberId}`, {
                limit: limit,
                offset: offset,
            });
            new FetchSuccess(res, 'Favourite', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving a favourite'));
        }
    };

    deleteFavourite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(
                `${process.env.SERVICE_JOB}/favourite/delete/${req.params.jobId}/${req.params.memberId}`
            );
            new DeleteSuccess(res, 'Favourite', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a favourite'));
        }
    };

    getCountForJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/favourite/countbyjob/${req.params.jobId}`);
            new FetchSuccess(res, 'Favourite count', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving a favourite count'));
        }
    };
}
