import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { DAORole } from '@samudai_xyz/gateway-consumer-types';

export class DAORoleController {
    createDAORole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const role: DAORole = req.body.role;

            const result = await axios.post(`${process.env.SERVICE_DAO}/role/create`, {
                role: role,
            });
            new CreateSuccess(res, 'DAO ROLE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao role'));
        }
    };

    getDAORole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/role/list/${daoId}`);
            new FetchSuccess(res, 'DAO', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a dao'));
        }
    };

    updateDAORole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const role: DAORole = req.body.role;

            const result = await axios.post(`${process.env.SERVICE_DAO}/role/update`, {
                role,
            });
            new UpdateSuccess(res, 'DAO', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a dao'));
        }
    };

    deleteRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const roleId = req.params.roleId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/role/delete/${daoId}/${roleId}`);
            new DeleteSuccess(res, 'DAO', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a dao'));
        }
    };

    createBulkRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { dao_id, roles } = req.body;

            const result = await axios.post(`${process.env.SERVICE_DAO}/role/createbulk`, {
                dao_id: dao_id,
                roles: roles,
            });
            new CreateSuccess(res, 'DAO', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao'));
        }
    };

    updateDiscordRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { dao_id, roles } = req.body;

            const result = await axios.post(`${process.env.SERVICE_DAO}/role/updatediscord`, {
                dao_id: dao_id,
                roles: roles,
            });

            new UpdateSuccess(res, 'DAO', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a dao'));
        }
    };

    getMemberRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/role/listbymemberid/${daoId}/${memberId}`);
            new FetchSuccess(res, 'MEMBER ROLES for a DAO', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a role for a member'));
        }
    };
}
