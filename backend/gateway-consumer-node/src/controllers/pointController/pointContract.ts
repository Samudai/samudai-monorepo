import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointContractController {
    addContract = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contract = req.body.contract;
            console.log(contract);
            const result = await axios.post(`${process.env.SERVICE_POINT}/contract/add`, {
                contract,
            });
            new CreateSuccess(res, 'Contract', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a contract'));
        }
    };
    updateContract = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contract = req.body.contract;
            const result = await axios.post(`${process.env.SERVICE_POINT}/contract/update`, {
                contract,
            });
            new UpdateSuccess(res, 'Updated Contract', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a contract'));
        }
    };
    deleteContract = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(
                `${process.env.SERVICE_POINT}/contract/delete/${req.params.pointId}/${req.params.contract_address}/${req.params.topic}`
            );
            new DeleteSuccess(res, 'Contract', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting an Access Role'));
        }
    };
}
