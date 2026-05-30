import { Payment } from '../../models/payment';
import { PaymentType } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';

export class PaymentQuery {
  addPayment = async (payment: PaymentType) => {
    try {
      console.log(payment);
      const newPayment = new Payment({
        dao_id: payment.dao_id,
        payment_id: uuidv4(),
        sender: payment.sender,
        receiver: payment.receiver,
        value: payment.value,
        task_id: payment.task_id,
        job_id: payment.job_id,
        bounty_id: payment.job_id,
        safe_transaction_hash: payment.safe_transaction_hash,
        initiated_at: payment.initiated_at,
        completed_at: payment.completed_at,
        payment_type: payment.payment_type,
        created_by: payment.created_by,
        status: payment.status,
        chain_id: payment.chain_id,
        payout_id: payment.payout_id,
        link_type: payment.link_type,
        type: payment.type,
        updated_by: payment.updated_by,
        created_at: new Date().toISOString(),
      });
      await newPayment.save();
      return newPayment;
    } catch (err) {
      console.log(err);
    }
  };

  getPaymentForDAO = async (dao_id: string) => {
    try {
      const payment = await Payment.find({ dao_id: dao_id }).exec();
      return payment;
    } catch (err) {
      console.log(err);
    }
  };

  getPaymentByReceiver = async (receiver: string) => {
    try {
      const payment = await Payment.find({ receiver: receiver }).exec();
      return payment;
    } catch (err) {
      console.log(err);
    }
  };

  getPaymentByTask = async (task_id: string) => {
    try {
      const payment = await Payment.find({ task_id: task_id }).exec();
      return payment;
    } catch (err) {
      console.log(err);
    }
  };

  getPaymentById = async (payment_id: string) => {
    try {
      const payment = await Payment.find({ payment_id: payment_id }).exec();
      return payment;
    } catch (err) {
      console.log(err);
    }
  };

  updatePaymentStatus = async (payment_id: string, status: string, completed_at: string, updated_by: string) => {
    try {
      const payment = await Payment.findOneAndUpdate(
        { payment_id: payment_id },
        {
          $set: {
            status: status,
            completed_at: completed_at,
            updated_by: updated_by,
            updated_at: new Date().toISOString(),
          },
        },
        { new: true }
      );
      return payment;
    } catch (err) {
      console.log(err);
    }
  };
}
