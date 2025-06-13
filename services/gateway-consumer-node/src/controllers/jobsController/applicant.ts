import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { Applicant, Member, AccessEnums, MembersEnums, JobsEnums } from '@samudai_xyz/gateway-consumer-types';

export class ApplicantController {
    createApplicant = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const applicant: Applicant = req.body.applicant;
            const type: JobsEnums.ApplicantType = req.body.type;
            const result = await axios.post(`${process.env.SERVICE_JOB}/applicant/create`, {
                applicant: applicant,
                type: type,
            });
            new CreateSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating an applicant'));
        }
    };

    getApplicant = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/applicant/${req.params.applicantId}`);
            new FetchSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving applicants'));
        }
    };

    getApplicantsList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let result = await axios.get(`${process.env.SERVICE_JOB}/applicant/list/${req.params.jobId}`);
            var i = 0;
            for (var member of result.data.applicants.members) {
                try {
                    const response = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                        type: MembersEnums.FetchMemberType.MEMBER_ID,
                        member_id: member.member_id,
                    });
                    result.data.applicants.members[i].member_details = response.data.member;
                } catch (err: any) {
                    result.data.applicants.members[i].member_details = null;
                }
                i = i + 1;
            }
            new FetchSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving applicants'));
        }
    };

    getApplicantsListForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/applicant/bymember/${req.params.memberId}`);
            var j = 0;
            for (var job of result.data.applicants) {
                try {
                    const res = await axios.get(`${process.env.SERVICE_JOB}/job/${job.job_id}`);
                    result.data.applicants[j].job_details = res.data.opportunity;
                } catch (err: any) {
                    result.data.applicants[j].job_details = null;
                }
                j = j + 1;
            }
            new FetchSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving applicants'));
        }
    };

    getApplicantsListForClan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/applicant/byclan/${req.params.clanId}`);
            new FetchSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving applicants'));
        }
    };

    updateApplicant = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const applicant: Applicant = req.body.applicant;
            const type: JobsEnums.ApplicantType = req.body.type;
            const result = await axios.post(`${process.env.SERVICE_JOB}/applicant/update`, {
                applicant: applicant,
                type: type,
            });
            new UpdateSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating an applicant'));
        }
    };

    updateApplicantStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task_id = req.body.jobAssociatedTaskId;
            const subtask_id = req.body.jobAssociatedSubTaskId;
            const project_id = req.body.jobAssociatedProjectId;
            const applicant: Applicant = req.body.applicant;
            const type: JobsEnums.ApplicantType = req.body.type;
            const result = await axios.post(`${process.env.SERVICE_JOB}/applicant/update/status`, {
                applicant: applicant,
                type: type,
            });

            if (applicant.status === JobsEnums.ApplicantStatusType.ACCEPTED) {
                try {
                    const res = await axios.get(`${process.env.SERVICE_JOB}/job/${applicant.job_id}`);
                    const job = res.data.opportunity;

                    const address = await axios.get(
                        `${process.env.SERVICE_MEMBER}/wallet/default/${applicant.member_id}`
                    );

                    if (address.data.wallet && job.transaction_count) {
                        const res = await axios.post(`${process.env.SERVICE_JOB}/payout/update/bylinkid/transactions`, {
                            link_id: applicant.job_id,
                            receiver_address: address.data.wallet.wallet_address,
                            status: JobsEnums.JobPayoutStatus.MPT,
                            member_id: applicant.member_id,
                            rank: job.transaction_count,
                        });
                    }

                    if (task_id) {
                        await axios.post(`${process.env.SERVICE_PROJECT}/task/add/assignee`, {
                            type: 'member',
                            task_id: task_id,
                            assignee_member: [applicant.member_id],
                            updated_by: applicant.updated_by,
                        });

                        const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/add/formember`, {
                            member_id: applicant.member_id,
                            project_id: project_id,
                            access: AccessEnums.ProjectAccessType.MANAGE_PROJECT,
                        });
                    }

                    if (subtask_id) {
                        await axios.post(`${process.env.SERVICE_PROJECT}/subtask/add/assignee`, {
                            subtask_id: subtask_id,
                            assignee_member: [applicant.member_id],
                            updated_by: applicant.updated_by,
                        });

                        const result = await axios.post(`${process.env.SERVICE_PROJECT}/access/add/formember`, {
                            member_id: applicant.member_id,
                            project_id: project_id,
                            access: AccessEnums.ProjectAccessType.MANAGE_PROJECT,
                        });
                    }

                    if (job.accepted_applicants == job.req_people_count) {
                        await axios.post(`${process.env.SERVICE_JOB}/job/update/status`, {
                            job_id: applicant.job_id,
                            status: JobsEnums.JobStatus.CLOSED,
                            updated_by: applicant.updated_by,
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            new UpdateSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating an applicant'));
        }
    };

    deleteApplicant = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_JOB}/applicant/delete/${req.params.applicantId}`);
            new DeleteSuccess(res, 'APPLICANT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting an applicant'));
        }
    };
}
