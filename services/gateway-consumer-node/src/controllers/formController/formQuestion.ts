import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { Form } from '@samudai_xyz/gateway-consumer-types';

export class FormController {
    createForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form: Form = req.body.form;
            const response = await axios.post(`${process.env.SERVICE_FORMS}/deal/questions/create`, {
                form,
            });
            new CreateSuccess(res, 'Form', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form creation failed!'));
        }
    };

    updateForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form: Form = req.body.form;
            const response = await axios.put(`${process.env.SERVICE_FORMS}/deal/questions/update`, {
                form,
            });
            new UpdateSuccess(res, 'Form', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form update failed!'));
        }
    };

    getForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.params.daoId;
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/${dao_id}`);
            new FetchSuccess(res, 'Form', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form fetch failed!'));
        }
    };

    deleteForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form_id = req.params.formId;
            const response = await axios.delete(`${process.env.SERVICE_FORMS}/deal/questions/${form_id}`);
            new DeleteSuccess(res, 'Form', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form deletion failed!'));
        }
    };

    getSupportQuestions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/support`);
            new FetchSuccess(res, 'Support Questions', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form fetch failed!'));
        }
    };
}
