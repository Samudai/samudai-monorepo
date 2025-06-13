import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { AddSuccess } from '../../lib/helper/Responsehandler';
import { completeOnboarding, daoOnboarding, daoOnboardingComplete } from '../../lib/onboarding';

export class OnboardingController {
    addStep = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const link_id: string = req.body.linkId;
            const step_id: string = req.body.stepId;
            const value: any = req.body.value;

            const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
                link_id,
                step_id,
                value,
            });

            if (step_id === 'PROFILE_DETAILS' && value.name) {
                await axios.post(`${process.env.SERVICE_MEMBER}/member/update/name&pfp&email`, {
                    member_id: link_id,
                    name: value.name,
                    profile_picture: value.profile_picture,
                    email: value.email,
                });

                const res1 = await completeOnboarding({
                    member_id: link_id,
                    admin: value.type_of_member === 'admin' ? true : false,
                    contributor: value.type_of_member === 'contributor' ? true : false,
                    invite_code: '',
                });

                if (value.type_of_member === 'admin' && value.name) {
                    const daoId = await daoOnboarding(link_id, value);

                    const daoOnbComplete = await daoOnboardingComplete(daoId, link_id);

                    return res.status(201).send({
                        message: 'Member Onboarding completed successfully ',
                        data: {
                            daoId: daoId,
                            daoOnboardingComplete: daoOnbComplete,
                        },
                    });
                }

                return res.status(201).send({
                    message: 'Member Onboarding completed successfully ',
                    data: {
                        onboarding: res1,
                    },
                });
            }

            new AddSuccess(res, 'Step', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding Onboarding Step'));
        }
    };
}
