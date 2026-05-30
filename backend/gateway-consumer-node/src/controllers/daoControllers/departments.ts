import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';

export class DAODepartmentController {
    createDepartmentOnboarding = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.body.daoId;
            const departments: string[] = req.body.departments;
            const result = await axios.post(`${process.env.SERVICE_DAO}/department/createbulk`, {
                dao_id: daoId,
                departments,
            });

            // const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
            //     link_id: daoId,
            //     step_id: DAOOnboardingFlowStep.DEPARTMENTS,
            //     value: {
            //         departments,
            //     },
            // });

            new CreateSuccess(res, 'DEPARTMENT ONBOARDING', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a department onboarding'));
        }
    };

    createDepartment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.body.daoId;
            const department: string = req.body.department;
            const result = await axios.post(`${process.env.SERVICE_DAO}/department/create`, {
                dao_id: daoId,
                department: department,
            });
            new CreateSuccess(res, 'DEPARTMENT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a department'));
        }
    };

    listDepartmentForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/department/list/${daoId}`);
            new FetchSuccess(res, 'DEPARTMENT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a department'));
        }
    };

    deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const departmentId = req.params.departmentId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/department/delete/${departmentId}`);
            new DeleteSuccess(res, 'DEPARMENT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a department'));
        }
    };
}
