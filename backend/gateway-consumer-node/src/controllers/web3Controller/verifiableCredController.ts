import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';

export class VerifiableCredController {
    addVerifiableCred = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.body.memberId;
            const did: string = req.body.did;
            const stream_id: string = req.body.streamId;
            const verifiableCredential: any = req.body.verifiableCredential;
            const result = await axios.post(`${process.env.SERVICE_WEB3}/web3/verifiablecred/add`, {
                member_id: member_id,
                did: did,
                stream_id: stream_id,
                verifiableCredential: verifiableCredential,
            });
            new CreateSuccess(res, 'VERIFIABLE CREDENTIAL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not create verifiable credential'));
        }
    };

    getVerifiableCred = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id: string = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_WEB3}/web3/verifiablecred/get/${member_id}`);
            //console.log(result.data.data);
            if (result.data.data) {
                new FetchSuccess(res, 'VERIFIABLE CREDENTIAL', result.data.data.verifiableCredential);
            } else {
                new FetchSuccess(res, 'VERIFIABLE CREDENTIAL', []);
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch verifiable credential'));
        }
    };
}
