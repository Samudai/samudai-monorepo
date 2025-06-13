import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';

export class MemberReviewController {
    createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const review = req.body.review;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/reviews/create`, {
                review: review,
            });
            new CreateSuccess(res, 'REVIEW', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a review'));
        }
    };

    listReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/reviews/list/${memberId}`);
            new FetchSuccess(res, 'REVIEW', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a review'));
        }
    };

    listByReviewerId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviewerId = req.params.reviewerId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/reviews/listbyreviewerid/${reviewerId}`);
            new FetchSuccess(res, 'REVIEW', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a review'));
        }
    };

    deleteReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviewId = req.params.reviewId;
            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/reviews/delete/${reviewId}`);
            new DeleteSuccess(res, 'REVIEW', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a review'));
        }
    };
}
