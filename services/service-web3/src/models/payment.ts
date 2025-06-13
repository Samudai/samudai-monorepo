import mongoose from 'mongoose';
import { PayoutCurrency } from '../utils/types';

const { Schema } = mongoose;

interface IModel {
  dao_id: string;
  payment_id: string;
  sender: string;
  receiver: string;
  value: [
    {
      amount: string;
      currency: PayoutCurrency;
      contract_address: string;
    }
  ];
  task_id: string;
  job_id?: string;
  bounty_id?: string;
  safe_transaction_hash: string;
  initiated_at: string;
  completed_at: string;
  payment_type: string;
  created_by: string;
  status: string;
  chain_id: number;
  payout_id?: string;
  link_type? : string;
  type?: string;
  updated_by: string;

  created_at: string;
  updated_at: string;
}

const paymentSchema = new Schema<IModel>({
  dao_id: { type: String, required: true },

  payment_id: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  value: [
    {
      amount: { type: String, required: true },
      currency: { 
          currency : { type: String },
          symbol:  { type: String },
          balance: { type: String },
          token_address:  { type: String },
          name:  { type: String },
          decimal: { type: String },
          logo_uri: { type: String }
      },
      contract_address: { type: String },
    },
  ],
  task_id: { type: String },
  job_id: { type: String },
  bounty_id: { type: String },
  safe_transaction_hash: { type: String, required: true },
  initiated_at: { type: String, required: true },
  completed_at: { type: String },
  payment_type: { type: String, required: true },
  created_by: { type: String, required: true },
  status: { type: String, required: true },
  chain_id: { type: Number, required: true },
  payout_id: { type: String },
  link_type: { type: String },
  type:       { type: String },
  updated_by: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
});

export const Payment = mongoose.model('Payment', paymentSchema);
