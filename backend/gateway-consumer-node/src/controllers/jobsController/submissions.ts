import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UniversalSuccess } from '../../lib/helper/Responsehandler';
import { Submission, JobsEnums, MembersEnums } from '@samudai_xyz/gateway-consumer-types';

export class SubmissionController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const submission: Submission = req.body.submission;
            const type: JobsEnums.ApplicantType = req.body.type;
            const result = await axios.post(`${process.env.SERVICE_JOB}/submission/create`, {
                submission: submission,
                type: type,
            });
            new CreateSuccess(res, 'SUBMISSION', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a submission'));
        }
    };

    getSubmissionById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/submission/${req.params.submissionId}`);
            new FetchSuccess(res, 'SUBMISSIONS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving submissions'));
        }
    };

    getSubmissionsByBounty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/submission/list/${req.params.bountyId}`);
            var i = 0;
            for (var member of result.data.submissions.clans) {
                try {
                    const response = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                        type: MembersEnums.FetchMemberType.MEMBER_ID,
                        member_id: member.member_id,
                    });
                    result.data.submissions.clans[i].member_details = response.data.member;
                } catch (err: any) {
                    result.data.submissions.clans[i].member_details = null;
                }
                i = i + 1;
            }
            new FetchSuccess(res, 'SUBMISSIONS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving submissions'));
        }
    };

    getSubmissionsByMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/submission/bymember/${req.params.memberId}`);
            var j = 0;
            for (var bounty of result.data.submissions) {
                try {
                    const res = await axios.get(`${process.env.SERVICE_JOB}/bounty/${bounty.bounty_id}`);
                    result.data.submissions[j].bounty_details = res.data.bounty;
                } catch (err: any) {
                    result.data.submissions[j].bounty_details = null;
                }
                j = j + 1;
            }
            new FetchSuccess(res, 'SUBMISSIONS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving submissions'));
        }
    };

    getSubmissionsByClan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/submission/byclan/${req.params.clanId}`);
            new FetchSuccess(res, 'SUBMISSIONS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving submissions'));
        }
    };

    reviewSubmission = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const submission: Submission = req.body.submission;
            const result = await axios.post(`${process.env.SERVICE_JOB}/submission/review`, {
                submission,
            });

            if (submission.status == JobsEnums.ApplicantStatusType.ACCEPTED) {
                const res = await axios.get(`${process.env.SERVICE_JOB}/bounty/${submission.bounty_id}`);
                const bounty = res.data.bounty;

                const address = await axios.get(`${process.env.SERVICE_MEMBER}/wallet/default/${submission.member_id}`);

                if (address.data.wallet) {
                    const res = await axios.post(`${process.env.SERVICE_JOB}/payout/update/bylinkid/rank`, {
                        link_id: submission.bounty_id,
                        rank: submission.rank,
                        receiver_address: address.data.wallet.wallet_address,
                        member_id: submission.member_id,
                        status: JobsEnums.JobPayoutStatus.UNASSIGNED,
                        initiated_by: submission.updated_by
                    });
                }

                if (bounty.accepted_submissions == bounty.winner_count) {
                    await axios.post(`${process.env.SERVICE_JOB}/bounty/update/status`, {
                        bounty_id: submission.bounty_id,
                        status: JobsEnums.JobStatus.CLOSED,
                        updated_by: '',
                    });
                }
            }

            new UniversalSuccess(res, 'SUBMISSION REVIEWED', result.data);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while reviewing a submission'));
        }
    };

    deleteSubmission = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(
                `${process.env.SERVICE_JOB}/submission/delete/${req.params.submissionId}`
            );
            new DeleteSuccess(res, 'SUBMISSION', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a submission'));
        }
    };
}
