import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { Bounty, BountyFile, BountyFilter, JobPayout, JobsEnums } from '@samudai_xyz/gateway-consumer-types';

export class BountyController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // var createdTaskId;
            const bounty: Bounty = req.body.bounty;

            // if (!bounty.task_id && !bounty.subtask_id) {
            //     const task = {
            //         title: bounty.title,
            //         project_id: bounty.project_id,
            //         created_by: bounty?.created_by,
            //         col: 1,
            //     };

            //     const taskres: any = await axios.post(`${process.env.SERVICE_PROJECT}/task/create`, {
            //         task: task,
            //     });

            //     createdTaskId = taskres.data.task_id;
            //     bounty.task_id = createdTaskId;
            // }

            const result: any = await axios.post(`${process.env.SERVICE_JOB}/bounty/create`, {
                bounty: bounty,
            });

            var payoutids: string[] = [];
            if (result && bounty.payout) {
                await Promise.all(
                    bounty.payout.map(async (payout: JobPayout) => {
                        payout.link_type = JobsEnums.JobPayoutLinkType.BOUNTY;
                        payout.link_id = result.data.bounty_id;

                        const res = await axios.post(`${process.env.SERVICE_JOB}/payout/create`, {
                            payout: payout,
                        });

                        payoutids.push(res.data.payout_id);
                    })
                );
            }

            if (bounty.task_id) {
                const updatedTask = await axios.post(`${process.env.SERVICE_PROJECT}/task/update/associatejob`, {
                    task_id: bounty.task_id,
                    associated_job_type: JobsEnums.JobPayoutLinkType.BOUNTY,
                    associated_job_id: result.data.bounty_id,
                });
            }

            if (bounty.subtask_id) {
                const updatedSubTask = await axios.post(`${process.env.SERVICE_PROJECT}/subtask/update/associatejob`, {
                    subtask_id: bounty.subtask_id,
                    associated_job_type: JobsEnums.JobPayoutLinkType.BOUNTY,
                    associated_job_id: result.data.bounty_id,
                });
            }

            var response = {
                bounty_id: result.data.bounty_id,
                payout: payoutids,
                // task_id: bounty.task_id ? bounty.task_id : createdTaskId,
                // subtask_id: bounty.subtask_id,
            };

            new CreateSuccess(res, 'BOUNTY', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a bounty'));
        }
    };

    getBountyById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/bounty/${req.params.bountyId}`);

            // if (result.data.bounty) {
            //     result.data.bounty = await getAttachmentBounty(result.data.bounty);
            // }

            new FetchSuccess(res, 'BOUNTY', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a bounty'));
        }
    };

    listBountyForDao = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_JOB}/bounty/list/${req.params.daoId}`, {
                limit: limit,
                offset: offset,
            });

            // if (result.data.bounty) {
            //     result.data.bounty = await getAttachmentBounties(result.data.bounty);
            // }

            new FetchSuccess(res, 'BOUNTIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching bounties'));
        }
    };

    listBountyForBulkDao = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const dao_ids = req.body.dao_ids;
            var results = [];
            for (let i = 0; i < dao_ids.length; i++) {
                const result = await axios.post(`${process.env.SERVICE_JOB}/bounty/list/${dao_ids[i]}`, {
                    limit: limit,
                    offset: offset,
                });
                results.push(result.data);
            }
            new FetchSuccess(res, 'Bulk BOUNTIES', results);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching bounties'));
        }
    };

    listOpenBounty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query: string = req.query.query?.toString() ? req.query.query.toString() : '';
            const page: string = req.query.page ? (req.query.page as string) : '1';
            let querySkills: string = req.query.skills as string;
            let queryDaoNames: string = req.query.daoNames as string;
            const limit = 25;
            const offset = (parseInt(page) - 1) * limit;
            const skills = querySkills ? querySkills.split(',') : [];
            const dao_names = queryDaoNames ? queryDaoNames.split(',') : [];
            const result = await axios.post(`${process.env.SERVICE_JOB}/bounty/openlist`, {
                query,
                skills,
                dao_names,
                limit: limit,
                offset: offset,
            });

            // if (result.data.bounty) {
            //     result.data.bounty = await getAttachmentBounties(result.data.bounty);
            // }

            new FetchSuccess(res, 'BOUNTIES', result);
        } catch (err) {
            next(new ErrorException(err, 'Error while fetching bounties'));
        }
    };

    listCreatedBountyByMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_JOB}/bounty/createdby/${req.params.memberId}`, {
                limit: limit,
                offset: offset,
            });

            // if (result.data.bounties) {
            //     result.data.bounty = await getAttachmentBounties(result.data.bounties);
            // }

            new FetchSuccess(res, 'BOUNTIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching bounties'));
        }
    };

    listForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_ids: string[] = req.body.dao_ids;
            const filter: BountyFilter = req.body.filter;
            const result = await axios.post(`${process.env.SERVICE_JOB}/bounty/search`, {
                dao_ids: dao_ids,
                filter: filter,
            });

            // if (result.data.bounties) {
            //     result.data.bounty = await getAttachmentBounties(result.data.bounties);
            // }

            new FetchSuccess(res, 'BOUNTIES', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching bounties'));
        }
    };

    updateBounty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bounty: Bounty = req.body.bounty;
            const result = await axios.post(`${process.env.SERVICE_JOB}/bounty/update`, {
                bounty: bounty,
            });
            new UpdateSuccess(res, 'BOUNTY', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a bounty'));
        }
    };

    updateBountyStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bounty_id: string = req.body.bountyId;
            const status: string = req.body.status;
            const updated_by = req.body.updatedBy;
            const result = await axios.post(`${process.env.SERVICE_JOB}/bounty/update/status`, {
                bounty_id,
                status,
                updated_by,
            });
            new UpdateSuccess(res, 'BOUNTY', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a bounty status'));
        }
    };

    deleteBounty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_JOB}/bounty/delete/${req.params.bountyId}`);
            new DeleteSuccess(res, 'BOUNTY', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a bounty'));
        }
    };

    bountyFileCreate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bounty_file: BountyFile = req.body.bountyFile;

            const result = await axios.post(`${process.env.SERVICE_JOB}/bountyfile/create`, {
                bounty_file: bounty_file,
            });
            new CreateSuccess(res, 'BOUNTY FILE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a bounty'));
        }
    };

    getBountyFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/bountyfile/list/${req.params.bountyId}`);
            new FetchSuccess(res, 'BOUNTY FILE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a bounty file'));
        }
    };

    deleteBountyFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_JOB}/bountyfile/${req.params.bountyFileId}`);
            new DeleteSuccess(res, 'BOUNTY FILE', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a bountyfile'));
        }
    };
}
