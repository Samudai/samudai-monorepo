import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { getPointGuilds } from '../../lib/guilds';

export class PointDiscordController {
    getMemberGuildsForOnboarding = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;

            const { memberGuilds } = await getPointGuilds(member_id);

            new FetchSuccess(res, 'Guilds', { memberGuilds });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching events'));
        }
    };
}
