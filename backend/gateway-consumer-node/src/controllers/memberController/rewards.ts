import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess, UniversalSuccess } from '../../lib/helper/Responsehandler';
import { MemberReward } from '@samudai_xyz/gateway-consumer-types';

export class MemberRewardController {
    createReward = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reward: MemberReward = req.body.reward;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/reward/create`, {
                reward_earned: reward,
            });
            new UniversalSuccess(res, 'Captain discovered', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while discovering a captain'));
        }
    };

    getRewardsForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;
            const dao_id = req.query.dao_id ? req.query.dao_id : undefined;
            const type = req.query.type ? req.query.type : undefined;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/reward/formember`, {
                member_id,
            });
            new FetchSuccess(res, 'Rewards', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching rewards'));
        }
    };
}
