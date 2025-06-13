import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess } from '../../lib/helper/Responsehandler';
import { DAOMemberRole } from '@samudai_xyz/gateway-consumer-types';

export class MemberRoleController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_role: DAOMemberRole = req.body.memberRole;
            const result = await axios.post(`${process.env.SERVICE_DAO}/memberrole/create`, {
                member_role: member_role,
            });
            new CreateSuccess(res, 'Member Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a MemberRole'));
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_role_id = req.params.memberRoleId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/memberrole/delete/${member_role_id}`);
            new DeleteSuccess(res, 'Member Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a MemberRole'));
        }
    };
}
