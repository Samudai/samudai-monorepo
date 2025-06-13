import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointCustomMemberController {
    addCustomMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product_member = req.body.memberProduct;
            const result = await axios.post(`${process.env.SERVICE_POINT}/memberproduct/create`, {
                product_member,
            });
            new CreateSuccess(res, 'Custom Member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Custom Member'));
        }
    };
}
