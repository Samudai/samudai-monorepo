import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { Token } from '@samudai_xyz/gateway-consumer-types';

export class DAOTokenController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: Token = req.body.token;
            const result = await axios.post(`${process.env.SERVICE_DAO}/token/create`, {
                token: token,
            });
            new CreateSuccess(res, 'TOKEN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Token'));
        }
    };

    getToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_DAO}/token/bydaoid/${req.params.daoId}`);
            new FetchSuccess(res, 'TOKEN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving a Token'));
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: Token = req.body.token;
            const result = await axios.put(`${process.env.SERVICE_DAO}/token/update`, {
                token: token,
            });
            new UpdateSuccess(res, 'TOKEN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating token'));
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_DAO}/token/delete/${req.params.tokenId}`);
            new DeleteSuccess(res, 'TOKEN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting token'));
        }
    };
}
