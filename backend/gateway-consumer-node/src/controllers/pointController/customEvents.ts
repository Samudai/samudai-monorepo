import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointCustomEventsController {
    addProductEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product_events = req.body.customEvents;
            const result = await axios.post(`${process.env.SERVICE_POINT}/productevent/add`, {
                product_events,
            });
            new CreateSuccess(res, 'Custom Events', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Custom Events'));
        }
    };

    updateProductEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product_events = req.body.customEvents;
            const result = await axios.post(`${process.env.SERVICE_POINT}/productevent/update`, {
                product_events,
            });
            new UpdateSuccess(res, 'Updated Custom Events', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a Custom Events'));
        }
    };
    deleteProductEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(
                `${process.env.SERVICE_POINT}/productevent/delete/${req.params.pointId}/${req.params.productId}/${req.params.eventName}`
            );
            new DeleteSuccess(res, 'product event', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting an product event'));
        }
    };
}
