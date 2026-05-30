import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { Payout } from '@samudai_xyz/gateway-consumer-types';

export class PayoutController {
    createPayout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payout: Payout = req.body.payout;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/payout/create`, {
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

    createBulkPayout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payouts: Payout[] = req.body.payouts;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/payout/createbulk`, {
                payouts,
            });
            res.status(201).send({ message: 'Payouts Created Successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Error while creating payouts', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updatePayout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payout: Payout = req.body.payout;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/payout/update`, {
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

    updatePayoutPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payout_id = req.body.payoutId;
            const payment_status = req.body.payment_status;

            const result = await axios.post(`${process.env.SERVICE_PROJECT}/payout/update/paymentstatus`, {
                payout_id,
                payment_status,
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
            const result = await axios.post(`${process.env.SERVICE_PROJECT}/payout/complete/${req.params.payoutId}`);

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
            const result = await axios.delete(`${process.env.SERVICE_PROJECT}/payout/delete/${req.params.payoutId}`);

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
            const result = await axios.get(`${process.env.SERVICE_PROJECT}/payout/get/${req.params.payoutId}`);

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
