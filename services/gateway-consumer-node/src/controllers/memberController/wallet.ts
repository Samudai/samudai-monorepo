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
import { Wallet } from '@samudai_xyz/gateway-consumer-types';

export class MemberWalletController {
    addMemberWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const walletAddress = req.body.walletAddress;
            const chainId = req.body.chainId;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/addwallet`, {
                member_id: memberId,
                wallet_address: walletAddress,
                chain_id: chainId,
            });
            new AddSuccess(res, 'MEMBER WALLET', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member'));
        }
    };

    createWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const wallet: Wallet = req.body.wallet;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/wallet/create`, {
                wallet: wallet,
            });
            new CreateSuccess(res, 'WALLET', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a wallet'));
        }
    };

    updateWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const wallet: Wallet = req.body.wallet;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/wallet/update`, {
                wallet: wallet,
            });
            new UpdateSuccess(res, 'WALLET', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a wallet'));
        }
    };

    deleteWalletForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const wallet_add = req.params.walletAddress;
            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/wallet/delete/${memberId}/${wallet_add}`);
            new DeleteSuccess(res, 'WALLET', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a wallet'));
        }
    };

    getDefaultWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/wallet/default/${memberId}`);
            new FetchSuccess(res, 'WALLET', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a wallet'));
        }
    };
}
