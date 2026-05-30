import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';

export class Web3Controller {
    getTokenFromContract = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contractAddress = req.params.address;

            const data = JSON.stringify({
                query: `{
               token(id: "${contractAddress}"){
                 name
                 symbol
               }
              }`,
                variables: {},
            });

            const config = {
                method: 'post',
                url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data,
            };

            const result = await axios(config);
            new FetchSuccess(res, 'TOKEN FROM CONTRACT', result.data.data.token);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while getting token from contract'));
        }
    };
}
