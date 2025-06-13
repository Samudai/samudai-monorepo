import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';
import { MostViewedResponse } from '@samudai_xyz/gateway-consumer-types';

export class MostViewedController {
    mostViewedDao = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/engagement/mostviewed/dao`);
            const mostViewedDAO: MostViewedResponse = result.data;

            new FetchSuccess(res, 'Most Viewed DAO', mostViewedDAO);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Most Viewed DAO'));
        }
    };

    mostViewedContributor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/engagement/mostviewed/contributor`);
            const mostViewedContributor: MostViewedResponse = result.data;

            new FetchSuccess(res, 'Most Viewed Contributor', mostViewedContributor);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching Most Viewed Contributor'));
        }
    };
}
