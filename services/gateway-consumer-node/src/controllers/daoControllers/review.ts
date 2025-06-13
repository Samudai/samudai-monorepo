import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { mapMemberToUsername } from '../../lib/memberUtils';
import { Review, ReviewResponse } from '@samudai_xyz/gateway-consumer-types';

export class DAOReviewController {
    createReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const review: Review = req.body.review;
            const result = await axios.post(`${process.env.SERVICE_DAO}/reviews/create`, {
                review,
            });
            new CreateSuccess(res, 'REVIEW', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a Review'));
        }
    };

    listReviewForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/reviews/list/${daoId}`);

            let reviewResponse: ReviewResponse[] = [];

            const reviews = result.data.reviews;

            for (let review of reviews) {
                const member = await mapMemberToUsername(review.member_id);
                const reviewData: ReviewResponse = {
                    ...review,
                };
                if (member) {
                    reviewData.member = {
                        member_id: member.member_id,
                        username: member.username,
                        profile_picture: member.profile_picture,
                        name: member.name,
                    };
                } else {
                    reviewData.member = {
                        member_id: review.member_id,
                        username: 'Unknown',
                        profile_picture: '',
                        name: 'Unknown',
                    };
                }
                reviewResponse.push({
                    ...reviewData,
                });
            }

            new FetchSuccess(res, 'REVIEW', reviewResponse);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a Review'));
        }
    };

    deleteReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviewId = req.params.reviewId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/reviews/delete/${reviewId}`);
            new DeleteSuccess(res, 'REVIEW', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a Review'));
        }
    };
}
