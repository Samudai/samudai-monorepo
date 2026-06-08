import { IMember } from '../../utils/types';

export type PaymentCreatedNotificationMetaData = {
  member: IMember;
  payment_id: string;
  receiver: {
    username: string;
    name: string;
    member_id: string;
  };
  amount: string;
  currency: string;
  redirect_link?: string;
  onReject: {
    status: 'rejected';
  };
  onApprove: {
    safeAddress: string;
    safeTxHash: string;
    provider: string;
  };
};

export type rejectTxnNudgeNotificationMetaData = {
  member: IMember;
  redirect_link?: string;
  safeTxHash?: string;
};

export type ExecutePaymentNotificationMetaData = {
  member: IMember;
  redirect_link?: string;
};

export type PaymentReceivedNotificationMetaData = {
  member: IMember;
  payment_id: string;
  payment_tx_hash: string;
  redirect_link?: string;
};

export type PaymentCompletedNotificationMetaData = {
  member: IMember;
  payment_id: string;
  payment_tx_hash: string;
  redirect_link?: string;
};

export type ProviderAddedNotificationMetaData = {
  member: IMember;
  provider_id: string;
  redirect_link?: string;
};

export type DefaultProviderChangedNotificationMetaData = {
  member: IMember;
  updated_provider_id: string;
  redirect_link?: string;
};
