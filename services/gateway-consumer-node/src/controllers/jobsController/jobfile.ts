import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { JobFile } from '@samudai_xyz/gateway-consumer-types';

export class JobFileController {
    createJobFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const job_file: JobFile = req.body.jobFile;
            const result = await axios.post(`${process.env.SERVICE_JOB}/jobfile/create`, {
                job_file: job_file,
            });
            new CreateSuccess(res, 'Job File', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a job file'));
        }
    };

    getJobFiles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/jobfile/list/${req.params.jobId}`);
            new FetchSuccess(res, 'Job Files', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving job files'));
        }
    };

    deleteFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_JOB}/jobfile/${req.params.fileId}`);
            new DeleteSuccess(res, 'Job File', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a job file'));
        }
    };
}
