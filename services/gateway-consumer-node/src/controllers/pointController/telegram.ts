import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import {
    AddSuccess,
    CreateSuccess,
    DeleteSuccess,
    FetchSuccess,
    UpdateSuccess,
} from '../../lib/helper/Responsehandler';
import { generateOTP } from '../../lib/otp';

export class PointTelegramController {
    addTelegramForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const telegram = req.body.telegram;
            const result = await axios.post(`${process.env.SERVICE_POINT}/telegram/add`, {
                telegram,
            });
            new AddSuccess(res, 'TELEGRAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding Telegram'));
        }
    };

    GenerateOtpForTelegram = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.memberId;
            const point_id = req.body.pointId;
            const chat_type = req.body.chatType;

            const timestamp = new Date().toString();
            const generatedOtp = generateOTP(member_id, timestamp);

            const result = await axios.post(`${process.env.SERVICE_POINT}/telegram/update/otp`, {
                member_id,
                point_id,
                chat_type,
                otp: generatedOtp,
            });

            if (result.data) {
                result.data.generatedOtp = generatedOtp;
            }

            new FetchSuccess(res, 'TELEGRAM GENERATED ID', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding Telegram'));
        }
    };

    GetTelegramForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;

            const result = await axios.get(`${process.env.SERVICE_POINT}/telegram/getformember/${member_id}`);

            new FetchSuccess(res, 'TELEGRAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Telegram Exists'));
        }
    };

    GetTelegramForPoint = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.params.pointId;

            const result = await axios.get(`${process.env.SERVICE_POINT}/telegram/getforpoint/${point_id}`);

            new FetchSuccess(res, 'TELEGRAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Telegram Exists'));
        }
    };

    AddTelegramEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const telegram_events = req.body.telegram_events;
            const result = await axios.post(`${process.env.SERVICE_POINT}/telegram/events/add`, {
                telegram_events,
            });
            new CreateSuccess(res, 'Telegram Events', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a telegram event'));
        }
    };

    UpdateTelegramEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const telegram_events = req.body.telegram_events;
            const result = await axios.post(`${process.env.SERVICE_POINT}/telegram/events/update`, {
                telegram_events,
            });
            new CreateSuccess(res, 'Telegram Events', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a telegram event'));
        }
    };

    GetTelegramEventsForPoint = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const point_id = req.params.pointId;

            const result = await axios.get(`${process.env.SERVICE_POINT}/telegram/getevents/${point_id}`);

            new FetchSuccess(res, 'TELEGRAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Telegram Events'));
        }
    };
}
