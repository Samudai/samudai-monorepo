import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { DAOSocial } from '@samudai_xyz/gateway-consumer-types';

export class DAOSocialController {
    createSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoSocial: DAOSocial[] = req.body.daoSocial;
            const result = await axios.post(`${process.env.SERVICE_DAO}/social/create`, {
                social: daoSocial,
            });
            new CreateSuccess(res, 'DAO SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating DAO social'));
        }
    };

    getSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/social/list/${daoId}`);
            new FetchSuccess(res, 'DAO SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching DAO social'));
        }
    };

    updateSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoSocial: DAOSocial[] = req.body.daoSocial;
            const result = await axios.post(`${process.env.SERVICE_DAO}/social/update`, {
                social: daoSocial,
            });
            new UpdateSuccess(res, 'DAO SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating DAO social'));
        }
    };

    deleteSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const socialId = req.params.socialId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/social/delete/${daoId}/${socialId}`);
            new DeleteSuccess(res, 'DAO SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting DAO social'));
        }
    };
}
