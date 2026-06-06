import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';
import { MostActiveResponse } from '@samudai_xyz/gateway-consumer-types';

export class MostActiveController {
    mostActiveDao = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/engagement/mostactive/dao`);
            const mostActiveDAO: MostActiveResponse = result.data;

            new FetchSuccess(res, 'Most Active DAO', mostActiveDAO);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Most Active DAO'));
        }
    };

    mostActiveContributor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/engagement/mostactive/contributor`);
            const mostActiveContributor: MostActiveResponse = result.data;

            new FetchSuccess(res, 'Most Active Contributor', mostActiveContributor);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Most Active Contributor'));
        }
    };
}
