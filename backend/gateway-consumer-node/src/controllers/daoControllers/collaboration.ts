import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { Collaboration } from '@samudai_xyz/gateway-consumer-types';

export class DAOCollaborationController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collaboration: Collaboration = req.body.collaboration;
            const result = await axios.post(`${process.env.SERVICE_DAO}/collaboration/create`, {
                collaboration: collaboration,
            });
            new CreateSuccess(res, 'DAO Collaboration', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao collaboration'));
        }
    };

    listForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/collaboration/list/${daoId}`);
            new FetchSuccess(res, 'DAO Collaboration List', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a dao collaboration'));
        }
    };

    updateCollaborationStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collaboration_id = req.body.collaborationId;
            const replying_member_id = req.body.replyingMemberId;
            const status = req.body.status;

            const result = await axios.post(`${process.env.SERVICE_DAO}/collaboration/update/status`, {
                collaboration_id,
                replying_member_id,
                status,
            });
            new UpdateSuccess(res, 'DAO Collaboration', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao collaboration'));
        }
    };

    deleteCollaboration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const collaborationId = req.params.collaborationId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/collaboration/delete/${collaborationId}`);
            new DeleteSuccess(res, 'DAO Collaboration', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a dao collaboration'));
        }
    };
}
