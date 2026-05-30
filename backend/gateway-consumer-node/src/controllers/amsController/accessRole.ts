import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { bulkMemberMap } from '../../lib/memberUtils';
import { DAOAccess, DAOAccessResponse } from '@samudai_xyz/gateway-consumer-types';

export class AccessController {
    createAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const access: DAOAccess = req.body.access;
            const result = await axios.post(`${process.env.SERVICE_DAO}/access/create`, {
                access,
            });
            new CreateSuccess(res, 'Access', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating an access'));
        }
    };

    getAccessForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/access/listbydaoid/${daoId}`);
            let daoAccessResponse: DAOAccessResponse[] = [];
            const daoAccess = result.data;

            for (const access of daoAccess) {
                if (access.members) {
                    const members = await bulkMemberMap(access.members);
                    daoAccessResponse.push({
                        ...access,
                        members,
                    });
                } else {
                    daoAccessResponse.push({
                        ...access,
                        members: [],
                    });
                }
            }
            new FetchSuccess(res, 'DAO Access Role', daoAccessResponse);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching access roles'));
        }
    };

    // getAccessForMember = async (req: Request, res: Response, next:NextFunction) => {
    //   try {
    //     const accessRoleId = req.params.roleId;
    //     const result = await axios.get(`${process.env.SERVICE_ACCESS}/access/${accessRoleId}`);
    //     return res.status(200).send({
    //       message: 'Access role fetched successfully',
    //       data: result.data.data,
    //     });
    //   } catch (err: any) {
    //     if (err.response) {
    //       return res
    //         .status(err.response.status)
    //         .send({ message: 'Error while fetching an Access Role', error: err.response.data });
    //     } else {
    //       return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
    //     }
    //   }
    // };

    updateAccessRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const access: DAOAccess = req.body.access;
            const result = await axios.post(`${process.env.SERVICE_DAO}/access/update`, {
                access,
            });
            new UpdateSuccess(res, 'Access Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating an Access Role'));
        }
    };

    updateAllAccessRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accesses: DAOAccess[] = req.body.accesses;
            const result = await axios.post(`${process.env.SERVICE_DAO}/access/update/allaccess`, {
                accesses,
            });
            new UpdateSuccess(res, 'Access Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating all Access Roles'));
        }
    };

    deleteAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_DAO}/access/delete/${req.params.daoId}`);
            new DeleteSuccess(res, 'Access Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting an Access Role'));
        }
    };

    getAccessForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.params.daoId;
            const member_id = req.params.memberId;
            const result = await axios.post(`${process.env.SERVICE_DAO}/access/formember`, {
                dao_id,
                member_id,
            });
            new FetchSuccess(res, 'Access for member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching access roles for member'));
        }
    };
}
