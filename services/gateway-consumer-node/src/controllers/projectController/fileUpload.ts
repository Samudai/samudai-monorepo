import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { FileFolder, ProjectFile, TaskFile } from '@samudai_xyz/gateway-consumer-types';

export class FileController {
    createProjectFolders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileFolder: FileFolder = req.body.fileFolder;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/folder/create`, {
                folder: fileFolder,
            });
            new CreateSuccess(res, 'Project Folder', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating project folder'));
        }
    };

    getProjectFolderById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/folder/${req.params.folderId}`);
            new FetchSuccess(res, 'Project Folder', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving project folder'));
        }
    };

    getProjectFileFolders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/folder/byproject/${req.params.projectId}`);
            new FetchSuccess(res, 'Project Folder', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving project folders'));
        }
    };

    updateProjectFolder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileFolder: FileFolder = req.body.fileFolder;
            const result = await axios.put(`${process.env.SERVICE_PROJECT}/folder/update`, {
                folder: fileFolder,
            });
            new UpdateSuccess(res, 'Project Folder', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating project folder'));
        }
    };

    deleteProjectFolder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/folder/delete/${req.params.folderId}`);
            new DeleteSuccess(res, 'Project Folder', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting project folder'));
        }
    };

    uploadProjectFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const project_file: ProjectFile = req.body.projectFile;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/projectfile/create`, {
                project_file,
            });
            new CreateSuccess(res, 'Project File', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while uploading project file'));
        }
    };

    getProjectFilesForFolder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const folder_id: string = req.params.projectId;
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/projectfile/list/${folder_id}`);
            new FetchSuccess(res, 'Project Files', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching files'));
        }
    };

    deleteProjectFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const project_file_id: string = req.params.projectFileId;
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/projectfile/${project_file_id}`);
            new DeleteSuccess(res, 'Project File', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting file'));
        }
    };

    uploadTaskFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_file: TaskFile = req.body.taskFile;
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/taskfile/create`, {
                task_file,
            });
            new CreateSuccess(res, 'Task File', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while uploading file'));
        }
    };

    getTaskFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_id: string = req.params.taskId;
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/taskfile/${task_id}`);
            new FetchSuccess(res, 'Task File', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching file'));
        }
    };

    deleteTaskFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_file_id: string = req.params.taskFileId;
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/taskfile/${task_file_id}`);
            new DeleteSuccess(res, 'Task File', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting file'));
        }
    };
}
