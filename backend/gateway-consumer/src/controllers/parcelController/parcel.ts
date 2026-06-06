import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { Networks } from './utils/networks';
import { Auth, TxData } from '@samudai_xyz/gateway-consumer-types';

export class ParcelController {
    getSafes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth: Auth = req.body.auth;
            const chainId: number = req.body.chainId;
            const network = Networks.find((network) => network.chainId === chainId);
            const url = network?.url;
            const apiKey = network?.API_KEY;
            const response = await axios.post(
                `${url}/safes`,
                {
                    auth: {
                        walletAddress: auth.walletAddress,
                        signature: auth.signature,
                        auth_msg: auth.auth_msg,
                    },
                },
                {
                    headers: {
                        'x-parcel-app-token': apiKey!,
                        'x-parcel-network': chainId,
                    },
                }
            );
            new FetchSuccess(res, 'SAFES', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch safes'));
        }
    };

    getSafeBalance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth: Auth = req.body.auth;
            const chainId: number = req.body.chainId;
            const safeAddress: string = req.body.safeAddress;
            const network = Networks.find((network) => network.chainId === chainId);
            const url = network?.url;
            const apiKey = network?.API_KEY;
            const response = await axios.post(
                `${url}/safes/balances/${safeAddress}`,
                {
                    auth: {
                        walletAddress: auth.walletAddress,
                        signature: auth.signature,
                        auth_msg: auth.auth_msg,
                    },
                },
                {
                    headers: {
                        'x-parcel-app-token': apiKey!,
                        'x-parcel-network': chainId,
                    },
                }
            );
            new FetchSuccess(res, 'SAFE BALANCE', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch safe balance'));
        }
    };

    createTx = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth: Auth = req.body.auth;
            const chainId: number = req.body.chainId;
            const txData: TxData = req.body.txData;
            const safeAddress: string = req.body.safeAddress;
            const network = Networks.find((network) => network.chainId === chainId);
            const url = network?.url;
            const apiKey = network?.API_KEY;

            const response = await axios.post(
                `${url}/safes/transaction/${safeAddress}`,
                {
                    auth: {
                        walletAddress: auth.walletAddress,
                        signature: auth.signature,
                        auth_msg: auth.auth_msg,
                    },
                    txData: txData,
                },
                {
                    headers: {
                        'x-parcel-app-token': apiKey!,
                        'x-parcel-network': chainId,
                    },
                }
            );
            new CreateSuccess(res, 'TRANSACTION', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not create transaction'));
        }
    };

    getSafeInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth: Auth = req.body.auth;
            const chainId: number = req.body.chainId;
            const safeAddress: string = req.body.safeAddress;
            const network = Networks.find((network) => network.chainId === chainId);
            const url = network?.url;
            const apiKey = network?.API_KEY;

            const response = await axios.post(
                `${url}/safes/${safeAddress}`,
                {
                    auth: {
                        walletAddress: auth.walletAddress,
                        signature: auth.signature,
                        auth_msg: auth.auth_msg,
                    },
                },
                {
                    headers: {
                        'x-parcel-app-token': apiKey!,
                        'x-parcel-network': chainId,
                    },
                }
            );
            new FetchSuccess(res, 'SAFE INFO', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch safe info'));
        }
    };

    getProposalStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chainId: number = req.body.chainId;
            const proposalId: string = req.body.proposalId;
            const network = Networks.find((network) => network.chainId === chainId);
            const url = network?.url;
            const apiKey = network?.API_KEY;

            const response = await axios.get(`${url}/transaction/${proposalId}`, {
                headers: {
                    'x-parcel-app-token': apiKey!,
                    'x-parcel-network': chainId,
                },
            });
            new FetchSuccess(res, 'PROPOSAL STATUS', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch proposal status'));
        }
    };
}
