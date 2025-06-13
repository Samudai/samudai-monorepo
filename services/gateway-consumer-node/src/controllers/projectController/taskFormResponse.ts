import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { mapTaskFormResponseToTask } from '../../lib/project';
import {
    AssignResponse,
    Task,
    TaskFormResponse,
    TaskResponse,
    UpdateResponseColumn,
    UpdateResponsePosition,
} from '@samudai_xyz/gateway-consumer-types';

export class TaskFormResponseController {
    createTaskFormResponse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const formResponseTask: TaskFormResponse = req.body.formResponseTask;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/response/create`, {
                response: formResponseTask,
            });
            new CreateSuccess(res, 'TASK FORM RESPONSE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating task form response'));
        }
    };

    getAllResponseForProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/response/allresponse/${projectId}`);
            let taskFormResponses: TaskResponse[] = [];

            result.data.responses.forEach((response: TaskFormResponse) => {
                taskFormResponses.push(mapTaskFormResponseToTask(response));
            });
            new FetchSuccess(res, 'ALL RESPONSE for PROJECT', taskFormResponses);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while getting all response for project'));
        }
    };

    getTaskFormResponse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const responseId = req.params.responseId;
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/response/${responseId}`);
            let taskFormResponse: Task = mapTaskFormResponseToTask(result.data);
            console.log(taskFormResponse);
            new FetchSuccess(res, 'TASK FORM RESPONSE', taskFormResponse);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while getting task form response'));
        }
    };

    deleteTaskFormResponse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const responseId = req.params.responseId;
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/response/${responseId}`);
            new DeleteSuccess(res, 'TASK FORM RESPONSE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting task form response'));
        }
    };

    updateTaskFormResponseColumn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response_id = req.body.response_id;
            const col = req.body.col;
            const updated_by = req.body.updated_by;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/response/update/column`, {
                response_id,
                col,
                updated_by,
            });
            new UpdateSuccess(res, 'TASK FORM RESPONSE COLUMN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task form response column'));
        }
    };

    updateTaskFormResponseColumnBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskFormResponses: UpdateResponseColumn[] = req.body.taskFormResponses;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/response/update/columnbulk`, {
                responses: taskFormResponses,
            });
            new UpdateSuccess(res, 'TASK FORM RESPONSE COLUMN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task form response column'));
        }
    };

    updateAssignee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const assignee: AssignResponse = req.body.assignee;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/response/update/assignee`, {
                assignee,
            });
            new UpdateSuccess(res, 'TASK FORM RESPONSE ASSIGNEE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task form response assignee'));
        }
    };

    updateTaskFormResponsePosition = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedPosition: UpdateResponsePosition = req.body.taskResponsePosition;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/response/update/position`, {
                project_id: updatedPosition.project_id,
                response_id: updatedPosition.response_id,
                position: updatedPosition.position,
                updated_by: updatedPosition.updated_by,
            });
            new UpdateSuccess(res, 'TASK FORM RESPONSE POSITION', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task form response position'));
        }
    };

    updateTaskFormResponseDiscussion = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const discussion_id = req.body.discussion_id;
            const response_id = req.body.response_id;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/response/update/discussion`, {
                discussion_id,
                response_id,
            });
            new UpdateSuccess(res, 'TASK FORM RESPONSE DISCUSSION', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating task form response discussion'));
        }
    };

    getTaskFormResponsebyFormResponseId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const form_response_id = req.params.formResponseId;
            const result = await axios.get(
                `${process.env.SERVICE_PROJECT}/response/byformresponse/${form_response_id}`
            );
            new FetchSuccess(res, 'Task Form Response', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while getting task form response'));
        }
    };
}
