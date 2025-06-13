import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class ProgressBarController {
    updateProgressForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.body.daoId;
            const item_id: ActivityEnums.NewDAOItems[] = req.body.itemId;

            const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/progressbar/dao/update`, {
                dao_id,
                item_id,
            });

            // if (item_id === ActivityEnums.DAOItems.COLLABORATION_PASS_CLAIM) {
            //     await axios.post(`${process.env.SERVICE_DAO}/collaborationpass/create`, {
            //         collaboration_pass: {
            //             dao_id,
            //             claimed: true,
            //         },
            //     });
            // }

            new UpdateSuccess(res, 'Updated Progress bar for DAO', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding Onboarding Step'));
        }
    };

    getProgressForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId: string = req.params.daoId;

            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/progressbar/dao/${daoId}`);

            new FetchSuccess(res, 'Progress fetched successfully for DAO', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding Onboarding Step'));
        }
    };

    updateProgressForContributor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.body.memberId;
            const item_id: ActivityEnums.NewContributorItems[] = req.body.itemId;

            const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/progressbar/contributor/update`, {
                member_id,
                item_id,
            });
            new UpdateSuccess(res, 'Updated Progress bar for Contributor', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding Onboarding Step'));
        }
    };

    getProgressForContributor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.params.memberId;

            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/progressbar/contributor/${member_id}`);

            new FetchSuccess(res, 'Progress fetched successfully for Contributor', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding Onboarding Step'));
        }
    };
}
