import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointController {
    addPoint = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoProfile = req.body.daoProfile;
            const result = await axios.post(`${process.env.SERVICE_DAO}/point/create`, {
                dao: daoProfile,
            });

            new CreateSuccess(res, 'POINT SYSTEM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating Point System'));
        }
    };

    linkdiscordbotForPoint = async (req: Request, res: Response) => {
        try {
            const point_id: string = req.params.point_id;
            const guild_id: string = req.params.guild_id;
            const result = await axios.post(`${process.env.SAMUDAI_BOT}/linkdiscord/point/${point_id}/${guild_id}`);
            return res.status(201).send({
                message: 'Bot Linked With Point System Successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while linking bot to Point', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getPointByPointId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.params.point_id;
            const result = await axios.get(`${process.env.SERVICE_POINT}/point/getpointbyid/${point_id}`);

            new FetchSuccess(res, 'POINT SYSTEM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating Point System'));
        }
    };
    merge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mergeParam = req.body.merge;
            const result = await axios.post(`${process.env.SERVICE_DISCORD}/point/discord/merge`, {
                merge: mergeParam,
            });

            new UpdateSuccess(res, 'Merged Successfully', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error merging'));
        }
    };
    mergeV2 = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const mergeParam = req.body.merge;
            const result = await axios.post(`${process.env.SERVICE_DISCORD}/point/discord/mergeV2`, {
                merge: mergeParam,
            });

            new UpdateSuccess(res, 'Merged Successfully', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error merging'));
        }
    };

    getPointByWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const wallet_address = req.params.wallet_address;
            const result = await axios.get(`${process.env.SERVICE_DISCORD}/member/getpointbywallet/${wallet_address}`);

            new FetchSuccess(res, 'POINT IDS By Wallet', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Point Ids'));
        }
    };
}
