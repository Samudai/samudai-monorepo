import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { Comment } from '@samudai_xyz/gateway-consumer-types';

export class CommentsController {
    createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment: Comment = req.body.comment;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/comment/create`, {
                comment: comment,
            });

            new CreateSuccess(res, 'Comment', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating comment'));
        }
    };

    listComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { linkId } = req.params;

            const result = await axios.get(`${process.env.SERVICE_PROJECT}/comment/list/${linkId}`);

            new FetchSuccess(res, 'Comment List', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while listing comment'));
        }
    };

    updateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment: Comment = req.body.comment;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/comment/update`, {
                comment: comment,
            });

            new UpdateSuccess(res, 'Comment', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating comment'));
        }
    };

    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { commentId } = req.params;

            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/comment/delete/${commentId}`);

            new DeleteSuccess(res, 'Comment', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting comment'));
        }
    };
}
