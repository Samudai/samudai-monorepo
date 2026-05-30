import { Request, Response } from 'express';
import { PaymentQuery } from '../controller/query/payment';
import { PaymentType } from '../utils/types';

export class PaymentController {
  paymentQuery: PaymentQuery;

  constructor() {
    this.paymentQuery = new PaymentQuery();
  }

  addPayment = async (req: Request, res: Response) => {
    try {
      const payment: PaymentType = req.body.payment;
      const result = await this.paymentQuery.addPayment(payment);
      res.status(201).json({ message: 'Payment created successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not create Payment', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error creating Payment', error: err });
      }
    }
  };

  getPlatformPaymentsForDAO = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.params.daoId;
      console.log('dao_id', dao_id);
      const result: any = await this.paymentQuery.getPaymentForDAO(dao_id);
      res.status(200).json({ message: 'Payments retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Payments for dao', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Payments for a dao', error: JSON.stringify(err) });
      }
    }
  };

  getPlatformPaymentsByReceiver = async (req: Request, res: Response) => {
    try {
      const receiver: string = req.params.memberId;
      console.log('receiver', receiver);
      const result: any = await this.paymentQuery.getPaymentByReceiver(receiver);
      res.status(200).json({ message: 'Payments retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Payments for receiver', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Payments for a receiver', error: JSON.stringify(err) });
      }
    }
  };

  getPlatformPaymentsByTaskId = async (req: Request, res: Response) => {
    try {
      const task_id: string = req.params.taskId;
      console.log('task_id', task_id);
      const result: any = await this.paymentQuery.getPaymentByTask(task_id);
      res.status(200).json({ message: 'Payments retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Payments for task', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Payments for a task', error: JSON.stringify(err) });
      }
    }
  };

  getPaymentById = async (req: Request, res: Response) => {
    try {
      const payment_id: string = req.params.paymentId;
      console.log('payment_id', payment_id);
      const result: any = await this.paymentQuery.getPaymentById(payment_id);
      res.status(200).json({ message: 'Payment retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res.status(err.response.status).send({ message: 'Could not get Payment', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Payment', error: JSON.stringify(err) });
      }
    }
  };

  updatePaymentStatus = async (req: Request, res: Response) => {
    try {
      const payment_id: string = req.body.paymentId;
      const status: string = req.body.status;
      const completed_at: string = req.body.completed_at;
      const updated_by: string = req.body.updated_by;
      console.log('payment_id', payment_id);
      const result: any = await this.paymentQuery.updatePaymentStatus(payment_id, status, completed_at, updated_by);
      res.status(200).json({ message: 'Payment status updated successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not update Payment status', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error updating Payment status', error: JSON.stringify(err) });
      }
    }
  };
}
