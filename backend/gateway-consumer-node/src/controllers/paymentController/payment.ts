import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { AddSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { getMemberByWallet } from '../../lib/memberUtils';
import { IMember, Payment, MemberReward, MembersEnums } from '@samudai_xyz/gateway-consumer-types';
export class PaymentController {
    addPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payment: Payment = req.body.payment;
            let reward: MemberReward = req.body.reward ? req.body.reward : null;
            let resp: any;

            const response = await axios.post(`${process.env.SERVICE_WEB3}/web3/payment/add`, {
                payment,
            });

            if (payment.payout_id) {
                if (payment.type === 'Project') {
                    resp = await axios.post(`${process.env.SERVICE_PROJECT}/payout/update/paymentstatus`, {
                        payout_id: payment.payout_id,
                        payment_status: 'payment-initiated',
                    });
                } else {
                    resp = await axios.post(`${process.env.SERVICE_JOB}/payout/update/status`, {
                        payout_id: payment.payout_id,
                        status: 'payment_initiated',
                    });
                }
            }

            if (response.status === 201) {
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.MEMBER_ID,
                    member_id: payment.created_by,
                });
                const approver: IMember = {
                    member_id: result.data.member.member_id,
                    username: result.data.member.username,
                };
                payment.approver = approver;

                if (reward) {
                    const memberResult = await getMemberByWallet(reward.member_id);
                    if (memberResult) {
                        reward.member_id = memberResult.member_id;
                        const rewardResponse = await axios.post(`${process.env.SERVICE_MEMBER}/reward/create`, {
                            reward_earned: reward,
                        });
                    }
                }
            }
            new AddSuccess(res, 'Payment', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Payment could not be added!'));
        }
    };

    getPlatformPaymentsForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const response = await axios.get(`${process.env.SERVICE_WEB3}/web3/payment/get/${daoId}`);

            new FetchSuccess(res, 'Payments for DAO', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Payment could not be retrieved!'));
        }
    };

    getPlatformPaymentsForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const response = await axios.get(`${process.env.SERVICE_WEB3}/web3/payment/get/member/${memberId}`);
            new FetchSuccess(res, 'Payments for Member', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Payment could not be retrieved!'));
        }
    };

    getPaymentForTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskId = req.params.taskId;
            const response = await axios.get(`${process.env.SERVICE_WEB3}/web3/payment/get/task/${taskId}`);
            new FetchSuccess(res, 'Payment for task', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Payment could not be retrieved!'));
        }
    };

    getPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentId = req.params.paymentId;
            const response = await axios.get(`${process.env.SERVICE_WEB3}/web3/payment/get/payment/${paymentId}`);
            new FetchSuccess(res, 'Payment', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Payment could not be retrieved!'));
        }
    };

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { paymentId, completedAt, updatedBy, status } = req.body;
            const response = await axios.post(`${process.env.SERVICE_WEB3}/web3/payment/update/status`, {
                paymentId: paymentId,
                completed_at: completedAt,
                updated_by: updatedBy,
                status,
            });
            new UpdateSuccess(res, 'Payment', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Payment could not be Updated!'));
        }
    };

    getUninitiatedByDAOId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const resultProject = await axios.get(
                `${process.env.SERVICE_PROJECT}/payout/getfordao/${req.params.daoId}`
            );
            let updatedResultProject = resultProject.data?.map((payout: any) => ({
                ...payout,
                type: 'Project',
            }));

            const resultJob = await axios.get(`${process.env.SERVICE_JOB}/payout/get/uninitiated/${req.params.daoId}`);
            let updatedResultJob = resultJob.data?.map((payout: any) => ({
                ...payout,
                type: 'Job',
            }));

            if (updatedResultJob && updatedResultProject) {
                const result = [...updatedResultProject, ...updatedResultJob];
                res.status(200).send({ message: 'Payout fetched successfully', data: result });
            } else if (updatedResultJob && !updatedResultProject) {
                res.status(200).send({ message: 'Payout fetched successfully', data: updatedResultJob });
            } else if (!updatedResultJob && updatedResultProject) {
                res.status(200).send({ message: 'Payout fetched successfully', data: updatedResultProject });
            } else {
                res.status(200).send({ message: 'Payout fetched successfully', data: [] });
            }
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while fetching payout', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    // updateInitiateByPayout = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const payouts = req.body.payouts;
    //         const initiated_by = req.body.initiatedBy;

    //         const jobPayouts: any = [];
    //         const projectPayouts: any = [];

    //         payouts.forEach((payout: any) => {
    //             if (payout.rank === 0 && payout.status) {
    //                 jobPayouts.push(payout);
    //             } else {
    //                 projectPayouts.push(payout);
    //             }
    //         });

    //         const resultProject = await axios.post(`${process.env.SERVICE_PROJECT}/payout/update/initiated_by`, {
    //             payouts: projectPayouts,
    //             initiated_by,
    //         });

    //         const resultJob = await axios.post(`${process.env.SERVICE_JOB}/payout/update/initiated_by`, {
    //             payouts: jobPayouts,
    //             initiated_by,
    //         });

    //         new UpdateSuccess(res, 'Payment', resultJob);
    //     } catch (err: any) {
    //         if (err.response) {
    //             return res
    //                 .status(err.response.status)
    //                 .send({ message: 'Error while fetching payout', error: err.response.data });
    //         } else {
    //             return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
    //         }
    //     }
    // };
}
