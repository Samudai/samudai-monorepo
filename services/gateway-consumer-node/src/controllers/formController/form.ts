import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { ProjectEnums } from '@samudai_xyz/gateway-consumer-types';
import { Form, Project } from '@samudai_xyz/gateway-consumer-types';
import { bulkMemberMap } from '../../lib/memberUtils';

export class FormController {
    createForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form: Form = req.body.form;

            const subscriptionData = await axios.get(
                `${process.env.SERVICE_DAO}/dao/getsubscription/fordao/${form.dao_id}`
            );

            const formLimit = subscriptionData.data.data.current_plan.forms;

            const formCount = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/count/${form.dao_id}`);

            const formUsed = formCount.data.count;

            if (formUsed >= formLimit) {
                return res.status(500).send({ message: 'Form Creating Limit Used', error: 'Form Creating Limit Used' });
            }

            const response = await axios.post(`${process.env.SERVICE_FORMS}/deal/questions/create`, {
                form,
            });

            console.log(response.data);

            const form_id = response.data.form_id;

            if (response.status === 200) {
                const project: Project = {
                    link_id: form.dao_id,
                    type: ProjectEnums.LinkType.DAO,
                    project_type: ProjectEnums.ProjectType.INVESTMENT,
                    title: form.name,
                    description: `${form.name} Responses`,
                    visibility: ProjectEnums.Visibility.PRIVATE,
                    created_by: form.created_by,
                    completed: false,
                    pinned: false,
                    form_id: form_id,
                };

                const projectResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/create`, {
                    project,
                });
            }

            form.form_id = form_id;
            new CreateSuccess(res, 'Form', form);
        } catch (err: any) {
            next(new ErrorException(err, 'Form creation failed!'));
        }
    };

    updateForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form: Form = req.body.form;
            const response = await axios.post(`${process.env.SERVICE_FORMS}/deal/questions/update`, {
                form,
            });
            new UpdateSuccess(res, 'Form', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form update failed!'));
        }
    };

    getFormByDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.params.daoId;
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/bydao/${dao_id}`);

            let forms = response.data.form;

            const created_by = forms.map((form: any) => form.created_by);
            const updated_by = forms.map((form: any) => form.updated_by);
            const memberList = await bulkMemberMap([...created_by, ...updated_by]);
            const memberMap = new Map();

            memberList?.forEach((member: any) => {
                memberMap.set(member.member_id, member);
            });

            forms = forms.map((form: any) => {
                form.created_by = memberMap.get(form.created_by) || form.created_by;
                form.updated_by = memberMap.get(form.updated_by) || form.updated_by;
                return form;
            });
            new FetchSuccess(res, 'Form by DAO', forms);
        } catch (err: any) {
            next(new ErrorException(err, 'Form fetch failed!'));
        }
    };

    deleteForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form_id = req.params.formId;
            const response = await axios.delete(`${process.env.SERVICE_FORMS}/deal/questions/delete/${form_id}`);
            new DeleteSuccess(res, 'Form', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form deletion failed!'));
        }
    };

    getFormById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form_id = req.params.formId;
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/${form_id}`);
            new FetchSuccess(res, 'Form by ID', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Form fetch failed!'));
        }
    };

    getSupportQuestions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/support`);
            new FetchSuccess(res, 'Support Questions', response);
        } catch (err: any) {
            next(new ErrorException(err, 'SUPPORT QUESTIONS fetch failed!'));
        }
    };
}
