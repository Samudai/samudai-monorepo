import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { AddSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { Analytics } from '@samudai_xyz/gateway-consumer-types';

export class DAOAnalyticsController {
    addAnalytics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const analytics: Analytics = req.body.analytics;
            analytics.visitor_ip = req.socket.remoteAddress as string;

            // console.log('analytics', analytics);

            const result = await axios.post(`${process.env.SERVICE_DAO}/analytics/add`, {
                dao_id: analytics.dao_id,
                visitor_ip: analytics.visitor_ip,
                member_id: analytics.member_id,
            });
            new AddSuccess(res, 'DAO Analytics', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while adding analytics'));
        }
    };

    getAnalyticsForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/analytics/${daoId}`);
            new FetchSuccess(res, 'DAO Analytics', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching analytics'));
        }
    };

    getApplicantCountforday = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_JOB}/applicant/get/applicantcount/${daoId}`);
            new FetchSuccess(res, 'Applicant Count Analytics', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching analytics'));
        }
    };

    getActiveTaskCountforday = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/task/getopentasks/${daoId}`);
            new FetchSuccess(res, 'Task Count Analytics', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching analytics'));
        }
    };

    getActiveForumCountforday = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DISCUSSION}/discussion/getactiveforum/${daoId}`);
            new FetchSuccess(res, 'Forum Count Analytics', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching analytics'));
        }
    };

    getActiveProposalCountforday = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/proposal/get/activeproposal/${daoId}`);
            new FetchSuccess(res, 'Pending Proposal Count Analytics', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching analytics'));
        }
    };
}
