import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointTwitterPointsController {
    addTwitterPoints = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const twitter_points = req.body.twitter_points;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twitterpoints/add`, {
                twitter_points,
            });
            new CreateSuccess(res, 'Twitter', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Twitter points'));
        }
    };

    updateTwitterPoints = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const twitter_points = req.body.twitter_points;
            const result = await axios.post(`${process.env.SERVICE_POINT}/twitterpoints/update`, {
                twitter_points,
            });
            new UpdateSuccess(res, 'Updated twitter points', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a twitter points'));
        }
    };

    getTwitterPointsById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pointId = req.params.pointId;
            const result = await axios.get(`${process.env.SERVICE_POINT}/twitterpoints/getbyid/${pointId}`);
            new FetchSuccess(res, 'Fetch Twitter points', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Twitter points'));
        }
    };
}
