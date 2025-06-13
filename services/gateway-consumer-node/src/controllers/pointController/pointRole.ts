import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointRoleController {
    getDAORole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pointId = req.params.pointId;
            const result = await axios.get(`${process.env.SERVICE_POINT}/role/list/${pointId}`);
            new FetchSuccess(res, 'POINT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a point system'));
        }
    };
}
