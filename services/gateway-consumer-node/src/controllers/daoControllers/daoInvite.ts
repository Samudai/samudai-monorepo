import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { AddSuccess, CreateSuccess, DeleteSuccess } from '../../lib/helper/Responsehandler';

export class DAOInviteController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.body.dao_id;
            const created_by: string = req.body.created_by;
            const result = await axios.post(`${process.env.SERVICE_DAO}/daoinvite/create`, {
                dao_id,
                created_by,
            });
            new CreateSuccess(res, 'DAO Invite', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a dao invite'));
        }
    };

    deleteInvite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const inviteId = req.params.inviteId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/daoinvite/delete/${inviteId}`);

            new DeleteSuccess(res, 'DAO Invite', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a dao invite'));
        }
    };

    addMemberByInvite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const invite_code = req.body.invite_code;
            const member_id: string = req.body.member_id;
            const result = await axios.post(`${process.env.SERVICE_DAO}/daoinvite/addmember`, {
                invite_code,
                member_id,
            });
            new AddSuccess(res, 'Member By Invite', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding a member'));
        }
    };
}
