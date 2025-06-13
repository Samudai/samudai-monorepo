import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import {
    FormResponse,
    TaskFormResponse,
    Discussion,
    DiscussionEnums,
    ProjectEnums,
} from '@samudai_xyz/gateway-consumer-types';

export class FormResponseController {
    magicNumber: number = 65536;
    createResponse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const formResponse: FormResponse = req.body.response;
            const daoId: string = req.body.daoId;
            const response = await axios.post(`${process.env.SERVICE_FORMS}/deal/response/create`, {
                response: formResponse,
            });

            const investment = await axios.get(`${process.env.SERVICE_PROJECT}/project/investment/forms/${daoId}/${formResponse.form_id}`);
            const projectId: string = investment.data.project_id;

            const getresponses = await axios.get(`${process.env.SERVICE_PROJECT}/response/allresponse/${projectId}`);
            const count: number = getresponses.data.total;

            const taskFormResponse: TaskFormResponse = {
                response_id: '',
                project_id: projectId,
                response_type: ProjectEnums.ResponseType.DEAL,
                mongo_object: response.data.response_id,
                title: formResponse.wallet,
                col: 1,
                position: (count + 1) * this.magicNumber,
            };

            const createResponse = await axios.post(`${process.env.SERVICE_PROJECT}/response/create`, {
                response: taskFormResponse,
            });

            const discussion: Discussion = {
                //discussion_id: '',
                dao_id: daoId,
                topic: `Response ${count + 1}`,
                category: DiscussionEnums.DiscussionCategory.INVESTMENT,
                category_id: createResponse.data.response_id,
                closed: false,
                visibility: DiscussionEnums.Visibility.PRIVATE,
            };

            const createDiscussion = await axios.post(`${process.env.SERVICE_DISCUSSION}/discussion/create`, {
                discussion,
            });

            const updateResponse = await axios.post(`${process.env.SERVICE_PROJECT}/response/update/discussion`, {
                response_id: createResponse.data.response_id,
                discussion_id: createDiscussion.data.discussion_id,
                title: 'Response ' + (count + 1),
            });
            new CreateSuccess(res, 'RESPONSE', {
                response_id: response.data,
                project_id: projectId,
                discussion_id: createDiscussion.data,
            });
        } catch (err: any) {
            next(new ErrorException(err, 'Response creation failed'));
        }
    };

    getFormResponse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/response/${req.params.responseId}`);
            new FetchSuccess(res, 'RESPONSE', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Response fetch failed'));
        }
    };

    getFormResponseForForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form_id = req.params.formId;
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/response/byform/${form_id}`);

            new FetchSuccess(res, 'RESPONSE', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Response fetch failed'));
        }
    };

    getResponseByDAOId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;

            const formResult = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/bydao/${daoId}`);
            const form_id = formResult.data.form.form_id;
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/response/byform/${form_id}`);

            //console.log(response.data);
            new FetchSuccess(res, 'RESPONSE', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Response fetch failed'));
        }
    };

    deleteResponse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response_id = req.params.responseId;
            const response = await axios.delete(`${process.env.SERVICE_FORMS}/deal/response/${response_id}`);
            new DeleteSuccess(res, 'RESPONSE', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Response delete failed'));
        }
    };
}
