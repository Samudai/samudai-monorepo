import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { JobPayout } from '@samudai_xyz/gateway-consumer-types';

export class JobPayoutController {
    createPayout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payout: JobPayout = req.body.payout;

            const result = await axios.post(`${process.env.SERVICE_JOB}/payout/create`, {
                payout,
            });
            res.status(201).send({ message: 'Payout Created Successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while creating payout', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updatePayout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payout: JobPayout = req.body.payout;

            const result = await axios.post(`${process.env.SERVICE_JOB}/payout/update`, {
                payout,
            });
            res.status(201).send({ message: 'Payout Updated Successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while updating payout', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updatePayoutStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payout_id = req.body.payoutId;
            const status = req.body.status;

            const result = await axios.post(`${process.env.SERVICE_JOB}/payout/update/status`, {
                payout_id,
                status,
            });

            res.status(201).send({ message: 'Payout Updated PaymentStatus Successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while updating payout', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    completePayout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.post(`${process.env.SERVICE_JOB}/payout/complete/${req.params.payoutId}`);

            res.status(201).send({ message: 'Payout Updated PaymentStatus Successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while updating payout', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    deletePayout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(`${process.env.SERVICE_JOB}/payout/delete/${req.params.payoutId}`);

            res.status(201).send({ message: 'Payout deleted successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while deleting payout', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getPayoutById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/payout/get/${req.params.payoutId}`);

            res.status(201).send({ message: 'Payout fetched successfully', data: result.data });
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
}
