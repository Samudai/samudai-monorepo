import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { JobFilter, JobPayout, Opportunity, JobsEnums, ProjectEnums } from '@samudai_xyz/gateway-consumer-types';

type OpportunityResponse = {
    opportunity: Opportunity[];
};

export class JobsController {
    createJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var createdTaskId;

            const opportunity: Opportunity = req.body.opportunity;
            opportunity.transaction_count = opportunity.payout?.length!;

            if (!opportunity.task_id && !opportunity.subtask_id) {
                const task = {
                    title: opportunity.title,
                    project_id: opportunity.project_id,
                    created_by: opportunity?.created_by,
                    col: 1,
                    description: opportunity.description,
                    description_raw: opportunity.description_raw,
                    poc_member_id: opportunity.created_by,
                    source: ProjectEnums.TaskCreatedSource.JOB,
                };

                const taskres: any = await axios.post(`${process.env.SERVICE_PROJECT}/task/create`, {
                    task: task,
                });

                createdTaskId = taskres.data.task_id;

                opportunity.task_id = createdTaskId;
            }

            const result: any = await axios.post(`${process.env.SERVICE_JOB}/job/create`, {
                opportunity: opportunity,
            });

            var payoutids: string[] = [];
            const contributor_count = opportunity.req_people_count;

            if (result && opportunity.payout) {
                await Promise.all(
                    opportunity.payout.map(async (payout: JobPayout, index) => {
                        const indi_amount = payout.payout_amount / contributor_count;
                        payout.link_type = JobsEnums.JobPayoutLinkType.TASK;
                        payout.link_id = result.data.job_id;
                        payout.payout_amount = indi_amount;
                        payout.rank = index + 1;

                        const res: any = await axios.post(`${process.env.SERVICE_JOB}/payout/create/multiple`, {
                            payout: payout,
                            count: contributor_count,
                        });

                        payoutids = [...payoutids, res.data.payout_ids];
                    })
                );
            }

            if (opportunity.task_id) {
                const updatedTask = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/associatejob`, {
                    task_id: opportunity.task_id,
                    associated_job_type: JobsEnums.JobPayoutLinkType.TASK,
                    associated_job_id: result.data.job_id,
                });
            }

            if (opportunity.subtask_id) {
                const updatedSubTask = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/associatejob`, {
                    subtask_id: opportunity.subtask_id,
                    associated_job_type: JobsEnums.JobPayoutLinkType.TASK,
                    associated_job_id: result.data.job_id,
                });
            }

            var response = {
                job_id: result.data.job_id,
                payout: payoutids,
                task_id: opportunity.task_id ? opportunity.task_id : createdTaskId,
                subtask_id: opportunity.subtask_id,
            };

            new CreateSuccess(res, 'OPPORTUNITY', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating an opportunity'));
        }
    };

    updateJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const opportunity: Opportunity = req.body.opportunity;
            const result = await axios.post(`${process.env.SERVICE_JOB}/job/update`, {
                opportunity: opportunity,
            });
            new UpdateSuccess(res, 'OPPORTUNITY', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating an opportunity'));
        }
    };

    getJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/job/${req.params.jobId}`);
            // if(result.data.opportunity){
            //     result.data.opportunity = await getAttachmentJob(result.data.opportunity);
            // }

            new FetchSuccess(res, 'OPPORTUNITY', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving an opportunity'));
        }
    };

    getJobCreatedByMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_JOB}/job/createdby/${req.params.memberId}`, {
                limit: limit,
                offset: offset,
            });

            // if(result.data.opportunities){
            //     result.data.opportunities = await getAttachmentJobs(result.data.opportunities);
            // }

            new FetchSuccess(res, 'OPPORTUNITIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving opportunities'));
        }
    };

    getJobsForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_JOB}/job/list/${req.params.daoId}`, {
                limit: limit,
                offset: offset,
            });

            // if(result.data.opportunities){
            //     result.data.opportunities = await getAttachmentJobs(result.data.opportunities);
            // }

            new FetchSuccess(res, 'OPPORTUNITIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving opportunities'));
        }
    };

    getJobsForBulkDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const dao_ids = req.body.dao_ids;
            var results = [];
            for (let i = 0; i < dao_ids.length; i++) {
                const result = await axios.post(`${process.env.SERVICE_JOB}/job/list/${dao_ids[i]}`, {
                    limit: limit,
                    offset: offset,
                });
                results.push(result.data);
            }

            // if(result.data.opportunities){
            //     result.data.opportunities = await getAttachmentJobs(result.data.opportunities);
            // }

            new FetchSuccess(res, 'Bulk OPPORTUNITIES', results);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving opportunities'));
        }
    };

    getPublicJobs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query: string = req.query.query?.toString() ? req.query.query.toString() : '';
            const page: string = req.query.page ? (req.query.page as string) : '1';
            let querySkills: string = req.query.skills as string;
            let queryDaoNames: string = req.query.daoNames as string;
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const skills = querySkills ? querySkills.split(',') : [];
            const dao_names = queryDaoNames ? queryDaoNames.split(',') : [];
            const result: any = await axios.post(`${process.env.SERVICE_JOB}/job/publiclist`, {
                query,
                skills,
                dao_names,
                limit: limit,
                offset: offset,
            });

            // if(result.data.opportunities){
            //     result.data.opportunities = await getAttachmentJobs(result.data.opportunities);
            // }

            new FetchSuccess(res, 'OPPORTUNITIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving opportunities'));
        }
    };

    deleteJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_JOB}/job/delete/${req.params.jobId}`);
            new DeleteSuccess(res, 'OPPORTUNITY', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting an opportunity'));
        }
    };

    updateJobStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const job_id: string = req.body.jobId;
            const status: string = req.body.status;
            const updated_by = req.body.updatedBy;
            const result = await axios.post(`${process.env.SERVICE_JOB}/job/update/status`, {
                job_id,
                status,
                updated_by,
            });
            new UpdateSuccess(res, 'JOB', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a job status'));
        }
    };

    listProjectJobsForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_dao_ids: string[] = req.body.userDAOIds;
            const filter: JobFilter = req.body.filter;
            const result = await axios.post(`${process.env.SERVICE_JOB}/job/search/project`, {
                user_dao_ids: user_dao_ids,
                filter: filter,
            });

            // if(result.data.opportunities){
            //     result.data.opportunities = await getAttachmentJobs(result.data.opportunities);
            // }

            new FetchSuccess(res, 'OPPORTUNITIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving Jobs'));
        }
    };

    listTaskJobsForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_dao_ids: string[] = req.body.userDAOIds;
            const filter: JobFilter = req.body.filter;
            const result = await axios.post(`${process.env.SERVICE_JOB}/job/search/task`, {
                user_dao_ids: user_dao_ids,
                filter: filter,
            });

            // if(result.data.opportunities){
            //     result.data.opportunities = await getAttachmentJobs(result.data.opportunities);
            // }

            new FetchSuccess(res, 'OPPORTUNITIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving Jobs'));
        }
    };
}
