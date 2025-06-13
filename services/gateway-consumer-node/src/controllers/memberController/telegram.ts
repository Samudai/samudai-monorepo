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

export class TelegramController {
    addTelegramForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const telegram = req.body.telegram;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/telegram/add`, {
                telegram
            });
            new AddSuccess(res, 'TELEGRAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding Telegram'));
        }
    };

    GenerateOtpForTelegram = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.memberId;

            const timestamp = new Date().toString()
            const generatedOtp = generateOTP(member_id, timestamp);

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/telegram/update/generated_id`, {
                member_id,
                generated_telegram_id : generatedOtp
            });

            if(result.data){
                result.data.generatedOtp = generatedOtp;
            }

            new FetchSuccess(res, 'TELEGRAM GENERATED ID', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding Telegram'));
        }
    };

    CheckIfTelegramExists = async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const member_id = req.params.memberId;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/telegram/exist/${member_id}`);
            
            new FetchSuccess(res, 'TELEGRAM GENERATED ID', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Checking if Telegram Exists'));
        }
    }

    GetTelegramForMember = async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const member_id = req.params.memberId;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/telegram/get/${member_id}`);
            
            new FetchSuccess(res, 'TELEGRAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Telegram Exists'));
        }
    }

    DeleteTelegramForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;

            const telegram_info = await axios.get(`${process.env.SERVICE_MEMBER}/telegram/get/${memberId}`);

            const disconnectMessage = await axios.delete(`${process.env.GATEWAY_EXTERNAL}/telegram/disconnect/${telegram_info?.data?.telegram.chat_id}`);

            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/telegram/delete/${memberId}`);
            new DeleteSuccess(res, 'TELEGRAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Adding Telegram'));
        }
    }
}
