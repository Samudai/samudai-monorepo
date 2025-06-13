import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointCustomProductController {
    addCustomProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const custom_product = req.body.customProduct;
            const result = await axios.post(`${process.env.SERVICE_POINT}/customproduct/create`, {
                custom_product,
            });
            new CreateSuccess(res, 'Custom Product', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Custom Product'));
        }
    };
    updateCustomProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const custom_product = req.body.customProduct;
            const result = await axios.post(`${process.env.SERVICE_POINT}/customproduct/update`, {
                custom_product,
            });
            new UpdateSuccess(res, 'Updated Custom Product', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a Custom Product'));
        }
    };
    getCustomProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.productId;
            const result = await axios.get(`${process.env.SERVICE_POINT}/customproduct/getbyid/${productId}`);
            new FetchSuccess(res, 'Fetch Custom Product', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Custom Product'));
        }
    };

    getCustomPointById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pointId = req.params.pointId;
            const result = await axios.get(`${process.env.SERVICE_POINT}/customproduct/getbypointid/${pointId}`);
            new FetchSuccess(res, 'Fetch Custom Product', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Custom Product'));
        }
    };

    updateCustomProductStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product_id = req.body.productId;
            const status = req.body.status;
            const result = await axios.post(`${process.env.SERVICE_POINT}/customproduct/updatestatus`, {
                product_id,
                status,
            });
            new UpdateSuccess(res, 'Updated Custom Product', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a Custom Product'));
        }
    };

    getPointsForUserByProductId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.productId;
            const uniqueUserId = req.params.uniqueUserId;
            const result = await axios.get(
                `${process.env.SERVICE_DISCORD}/point/event/getcpuserpoints/${productId}/${uniqueUserId}`
            );
            new FetchSuccess(res, 'Custom User Points', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Custom User Points'));
        }
    };
}
