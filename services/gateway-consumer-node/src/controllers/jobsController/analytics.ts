import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';

export class AnalyticsController {
    getJobAppliedCountForMember = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const member_id = req.body.memberId;
            const dao_ids = req.body.daoIds;

            const appliedJobresult = await axios.get(`${process.env.SERVICE_JOB}/job/analytics/totaljobsappliedcount/${member_id}`);
            const appliedJobCount =  appliedJobresult?.data?.applied_job_count

            const applicantresult = await axios.post(`${process.env.SERVICE_JOB}/job/analytics/fetch/applicantcount`, {
                member_id,
                dao_ids
            })
            const applicantCount = applicantresult?.data?.applicant_count

            new FetchSuccess(res, 'Job Applied Count', { appliedJobCount , applicantCount });
        }catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving job analytics'));
        }
    }
}
