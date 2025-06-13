// import { UserContext } from './enums';

// export type Activity = {
//   member_id: string;
//   action: string;
//   timestamp: number;
//   context: string;
//   access: string;
//   visibility: string;
// };

// export type UserActivity = {
//   action: string;
//   timestamp: number;
//   context: UserContext;
//   metadata: {
//     [key: string]: string;
//   };
// };

export type ResourceId = {
  baseUrl: string;
  path: string;
  orgId: string;
  role: string;
  extraData: string;
};

export type AccessControlConditions = {
  contractAddress: string;
  standardContractType: string;
  chain: string;
  method: string;
  parameters: string[];
  returnValueTest: {
    comparator: string;
    value: string;
  };
};

export type PaymentValue = {
  amount: 'string';
  currency: 'string';
  contract_address: 'string';
};

export type PayoutCurrency = {
  currency: string;
  symbol?: string;
  balance: string;
  token_address: string;
  name: string;
  decimal: number;
  logo_uri: string;
}

export type PaymentType = {
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
};
