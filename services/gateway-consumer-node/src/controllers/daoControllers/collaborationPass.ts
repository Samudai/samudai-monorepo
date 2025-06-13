import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { CollaborationPass } from '@samudai_xyz/gateway-consumer-types';

export class DAOCollaborationPassController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collaborationPass: CollaborationPass = req.body.collaborationPass;
            const result = await axios.post(`${process.env.SERVICE_DAO}/collaborationpass/create`, {
                collaboration_pass: collaborationPass,
            });
            new CreateSuccess(res, 'DAO Collaboration Pass', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao collaboration'));
        }
    };

    getForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/collaborationpass/get/${daoId}`);
            new FetchSuccess(res, 'DAO Collaboration Pass', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a dao collaboration'));
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collaborationPass: CollaborationPass = req.body.collaborationPass;
            const result = await axios.post(`${process.env.SERVICE_DAO}/collaborationpass/update`, {
                collaboration_pass: collaborationPass,
            });
            new UpdateSuccess(res, 'DAO Collaboration Pass', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao collaboration'));
        }
    };

    deleteCollaborationPass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collaborationPassId = req.params.collaborationPassId;
            const result = await axios.delete(
                `${process.env.SERVICE_DAO}/collaborationpass/delete/${collaborationPassId}`
            );
            new DeleteSuccess(res, 'DAO Collaboration Pass', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a dao collaboration'));
        }
    };
}
