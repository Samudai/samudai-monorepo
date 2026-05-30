import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { ConnectionRequest } from '@samudai_xyz/gateway-consumer-types';

export class MemberConnectionController {
    createConnection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const connection = req.body.connection;

            const exist = await axios.get(
                `${process.env.SERVICE_MEMBER}/connection/exist/${connection.sender_id}/${connection.receiver_id}`
            );

            if (exist.data) {
                return res.status(500).json({ message: 'Request for connection is already there' });
            }

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/connection/create`, {
                connection: connection,
            });
            new CreateSuccess(res, 'connection', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a connection'));
        }
    };

    listbySender = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/connection/listbysender/${memberId}`);
            new FetchSuccess(res, 'connection', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a connection'));
        }
    };

    listbyReceiver = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/connection/listbyreceiver/${memberId}`);
            new FetchSuccess(res, 'connection', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a connection'));
        }
    };

    getConnectionsByMemberId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/connection/list/${memberId}`);
            new FetchSuccess(res, 'connection', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a connection'));
        }
    };

    getAllConnectionsByMemberId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/connection/listall/${memberId}`);
            new FetchSuccess(res, 'connection', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a connection'));
        }
    };

    updateConnection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const connection: ConnectionRequest = req.body.connection;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/connection/update`, {
                connection: connection,
            });
            new UpdateSuccess(res, 'connection', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a connection'));
        }
    };

    deleteConnection = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = req.params.senderId;
            const receiverId = req.params.receiverId;
            const result = await axios.delete(
                `${process.env.SERVICE_MEMBER}/connection/delete/${senderId}/${receiverId}`
            );
            new DeleteSuccess(res, 'connection', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a connection'));
        }
    };

    getConnectionStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const viewerId = req.params.viewerId;
            const memberId = req.params.memberId;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/connection/status/${viewerId}/${memberId}`);
            new FetchSuccess(res, 'CONNECTION STATUS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a connection'));
        }
    };
}
