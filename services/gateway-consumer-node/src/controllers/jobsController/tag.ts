import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';

export class TagController {
    // createTag = async (req: Request, res: Response, next: NextFunction) => {
    //   try {
    //     const tag: Tag = req.body.tag;
    //     const result = await axios.post(`${process.env.SERVICE_JOB}/tag/create`, {
    //       tag: tag,
    //     });
    //     res.status(201).send({ message: 'Tag Created Successfully', data: result.data });
    //   } catch (err: any) {
    //     if (err.response) {
    //       return res
    //         .status(err.response.status)
    //         .send({ message: 'Error while creating a tag', error: err.response.data });
    //     } else {
    //       return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
    //     }
    //   }
    // };

    getTagListForJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/tag/list/job`);
            new FetchSuccess(res, 'TAG', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving tags'));
        }
    };

    getTagListForBounty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/tag/list/bounty`);
            new FetchSuccess(res, 'TAG', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving tags'));
        }
    };

    // deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    //   try {
    //     const result = await axios.delete(`${process.env.SERVICE_JOB}/tag/delete/${req.params.tagId}`);
    //     res.status(200).send({ message: 'Tag Deleted Successfully', data: result.data });
    //   } catch (err: any) {
    //     if (err.response) {
    //       return res
    //         .status(err.response.status)
    //         .send({ message: 'Error while deleting a tag', error: err.response.data });
    //     } else {
    //       return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
    //     }
    //   }
    // };
}
