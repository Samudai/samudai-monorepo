import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { bulkMemberMap } from '../../lib/memberUtils';
import { ProjectAccess, ProjectAccessResponse } from '@samudai_xyz/gateway-consumer-types';

export class ProjectAccessController {
    createProjectAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectAccess: ProjectAccess[] = req.body.projectAccess;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/create`, {
                access: projectAccess,
            });
            new CreateSuccess(res, 'Project Access', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Project Access'));
        }
    };

    getProjectAccessForProjectId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/access/listbyprojectid/${projectId}`);
            let projectAccessResponse: ProjectAccessResponse[] = [];
            const projectAccess: ProjectAccess[] = result.data;

            for (const access of projectAccess) {
                const members = await bulkMemberMap(access.members);
                projectAccessResponse.push({
                    ...access,
                    members,
                });
            }
            new FetchSuccess(res, 'Project Access for project id', projectAccessResponse);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Project Access for project id'));
        }
    };

    getProjectAccessForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.body.memberId;
            const project_id: string = req.body.projectId;
            const roles: string[] = req.body.roles;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/bymemberid`, {
                member_id,
                project_id,
                roles,
            });
            new FetchSuccess(res, 'Project Access for member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Project Access for member'));
        }
    };

    updateProjectAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectAccess: ProjectAccess[] = req.body.projectAccess;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/update`, {
                access: projectAccess,
            });
            new UpdateSuccess(res, 'Project Access', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a Project Access'));
        }
    };

    deleteProjectAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/access/delete/${projectId}`);
            new DeleteSuccess(res, 'Project Access', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a Project Access'));
        }
    };

    updateProjectAccessVisbility = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectAccess: ProjectAccess[] = req.body.projectAccess;
            const visibility: string = req.body.visibility;
            const project_id: string = req.body.projectId;
            const updated_by = req.body.updatedBy;

            const visibiltyResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/update/visibility`, {
                visibility: visibility,
                project_id: project_id,
                updated_by: updated_by,
            });

            const projectAccessResult = await axios.post(`${process.env.SERVICE_PROJECT}/access/update`, {
                access: projectAccess,
            });

            new UpdateSuccess(res, 'Project Access Visibility', projectAccessResult);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a Project Access Visibility'));
        }
    };
}
