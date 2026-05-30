import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { AccessControlConditions, ResourceId } from '@samudai_xyz/gateway-consumer-types';

export class TokenGatingController {
    addTokenGating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.body.daoId;
            const accessControlConditions: AccessControlConditions = req.body.accessControlConditions;
            const resourceId: ResourceId = req.body.resourceId;
            const result = await axios.post(`${process.env.SERVICE_WEB3}/web3/tokengating/add`, {
                dao_id,
                accessControlConditions,
                resourceId,
            });
            if (result.status === 201) {
                const result = await axios.post(`${process.env.SERVICE_DAO}/dao/update/tokengating`, {
                    dao_id: dao_id,
                    token_gating: true,
                });
            }
            new CreateSuccess(res, 'TOKEN GATING', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not create token gating'));
        }
    };

    getTokenGating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_WEB3}/web3/tokengating/get/${dao_id}`);
            new FetchSuccess(res, 'TOKEN GATING', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch token gating'));
        }
    };

    deleteTokenGating = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.params.daoId;
            const result = await axios.delete(`${process.env.SERVICE_WEB3}/web3/tokengating/delete/${dao_id}`);
            new DeleteSuccess(res, 'TOKEN GATING', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not delete token gating'));
        }
    };
}
