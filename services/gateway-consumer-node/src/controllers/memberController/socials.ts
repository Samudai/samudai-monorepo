import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { Social } from '@samudai_xyz/gateway-consumer-types';

export class MemberSocialsController {
    createMemberSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const socials: Social[] = req.body.socials;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/social/create`, {
                socials: socials,
            });

            // const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/member/add`, {
            //     member_id: socials[0].member_id,
            //     step_id: OnboardingFlowStep.PROFILE_PICTURE_USERNAME,
            //     value: {
            //         socials: socials,
            //     },
            // });
            new CreateSuccess(res, 'MEMBER SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a member social'));
        }
    };

    getMemberSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/social/list/${memberId}`);
            new FetchSuccess(res, 'MEMBER SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member social'));
        }
    };

    updateMemberSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const socials: Social[] = req.body.socials;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/social/update`, {
                socials: socials,
            });
            new UpdateSuccess(res, 'MEMBER SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member social'));
        }
    };

    deleteMemberSocial = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const socialId = req.params.socialId;
            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/social/delete/${socialId}`);
            new DeleteSuccess(res, 'MEMBER SOCIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a member social'));
        }
    };
}
