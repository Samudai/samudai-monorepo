import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class PointAccessController {
    createAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const access = req.body.access;
            const result = await axios.post(`${process.env.SERVICE_POINT}/access/create`, {
                access,
            });
            new CreateSuccess(res, 'Access', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating an access'));
        }
    };

    getAccessForPoint = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pointId = req.params.pointId;
            const result = await axios.get(`${process.env.SERVICE_POINT}/access/listbypointid/${pointId}`);

            new FetchSuccess(res, 'Point Access Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching access roles'));
        }
    };

    updateAccessRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const access = req.body.access;
            const result = await axios.post(`${process.env.SERVICE_POINT}/access/update`, {
                access,
            });
            new UpdateSuccess(res, 'Access Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating an Access Role'));
        }
    };

    updateAllAccessRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accesses = req.body.accesses;
            const result = await axios.post(`${process.env.SERVICE_POINT}/access/update/allaccess`, {
                accesses,
            });
            new UpdateSuccess(res, 'Access Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating all Access Roles'));
        }
    };

    deleteAccess = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_POINT}/access/delete/${req.params.pointId}`);
            new DeleteSuccess(res, 'Access Role', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting an Access Role'));
        }
    };

    getAccessForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.params.pointId;
            const member_id = req.params.memberId;
            const result = await axios.post(`${process.env.SERVICE_POINT}/access/formember`, {
                point_id,
                member_id,
            });
            new FetchSuccess(res, 'Access for member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching access roles for member'));
        }
    };

    getAccessForMemberByGuildId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const guild_id = req.params.guildId;
            const discord_user_id = req.params.discordUserId;
            const result = await axios.post(`${process.env.SERVICE_POINT}/access/formemberbyguildid`, {
                guild_id,
                discord_user_id,
            });
            new FetchSuccess(res, 'Access for member', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching access roles for member'));
        }
    };
}
