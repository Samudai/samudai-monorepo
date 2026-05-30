import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Auth, Payout, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import axios from 'axios';
import { ethers } from 'ethers';
import { selectProvider } from 'store/features/common/slice';
import { useAddPaymentsMutation } from 'store/services/payments/payments';
import { useUpdatePayoutMutation } from 'store/services/projects/tasks';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import { cutText } from 'utils/format';
import { parcelSign } from 'utils/parcelUtils';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import sendNotification from "utils/notification/sendNotification";

interface props {
  payout: Payout;
  setState: React.Dispatch<React.SetStateAction<Payout[]>>;
  state: Payout[];
  taskId: string;
}
const PaySmallComponent: React.FC<props> = ({ payout, state, setState, taskId }) => {
  const providerEth = useTypedSelector(selectProvider);
  const [safeOwners, setSafeOwners] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { daoid } = useParams();
  const [paid, setPaid] = useState<boolean>(payout.completed);
  const [update] = useUpdatePayoutMutation();
  const [addPaymentTrigger, { isLoading }] = useAddPaymentsMutation();

  useEffect(() => {
    getSafeOwners();
  }, []);

  const getSafeOwners = async () => {
    try {
      if (payout.provider.provider_type === 'gnosis') {
        if (!!providerEth && !!payout.provider.chain_id) {
          const value = new Gnosis(providerEth, payout.provider.chain_id);
          const res = (await value.getSafeOwners(payout.provider.address)) as string[];
          if (!res) {
            toast('Failure', 5000, 'Something went wrong', '')();
          }
          if (res.length > 0) {
            setSafeOwners(res);
          }
        }
      }
    } catch (err) {
      //toast
      toast('Failure', 5000, 'You are not a safe owner', '')();
    }
  };

  const pay = async (transaction_hash: string) => {
    try {
      setLoading(true);
      const currentPay = state.find((p) => p.provider_id === payout.provider_id);
      const filter = state.filter((p) => p.provider_id !== payout.provider_id);
      const val = [...filter, { ...currentPay, completed: true } as Payout];
      setState([...filter, { ...currentPay, completed: true } as Payout]);
      update({
        updated_by: getMemberId(),
        payout: val,
        task_id: taskId,
      }).unwrap();
      addPaymentTrigger({
        payment: {
          sender: payout?.,
          receiver: payout?.receiver_address!,
          value: {
            currency: payout?.payout_currency,
            amount: payout?.payout_amount.toString()!,
            contract_address: payout?.token_address || '',
          },
          dao_id: daoid!,
          transaction_hash: transaction_hash,
          payment_type: payout?.provider?.provider_type,
          initiated_at: new Date().toISOString(),
          created_by: getMemberId(),
          status: 'pending',
          chain_id: payout?.provider?.chain_id,
          task_id: taskId,
        },
        reward: {
          member_id: payout?.receiver_address!,
          dao_id: daoid!,
          link_id: taskId,
          type: 'task',
          amount: payout?.payout_amount!,
          currency: payout?.payout_currency,
        },
      }).unwrap()
      .then((res) => {
        sendNotification({
          to: [daoid],
          for: NotificationsEnums.NotificationFor.ADMIN,
          from: getMemberId(),
          origin: '/payments',
          by: NotificationsEnums.NotificationCreatedby.MEMBER,
          metadata: {
            id: res.data.data.payment_id!,
            redirect_link: `/${daoid!}/payments`
            // id: paymentMock.payment_id,
          },
          type: NotificationsEnums.SocketEventsToServicePayment.PAYMENT_CREATED_NOTIFICATION,
        });
      })
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      let chainId: number = await providerEth!
        .getNetwork()
        .then((network) => network.chainId);
      let transaction_hash:
        | GnosisTypes.SafeTransactionResponse
        | GnosisTypes.ErrorResponse = {} as GnosisTypes.SafeTransactionResponse;
      let proposalId = '';
      const signer = providerEth!.getSigner();
      const address = await signer.getAddress();
      if (payout.provider.provider_type === 'gnosis') {
        if (chainId === payout.provider.chain_id) {
          const sdkVale = new Gnosis(providerEth!, chainId);
          transaction_hash = (await (sdkVale as Gnosis).createSingleGnosisTx(
            payout.receiver_address!,
            payout.payout_amount.toString(),
            payout.safe_address,
            address,
            payout?.token_address!
          )) as GnosisTypes.SafeTransactionResponse;

          setLoading(false);
        } else {
          setLoading(false);
          await window.ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(payout?.provider.chain_id!) }],
          });
          return;
        }
      } else if (payout.provider.provider_type === 'parcel') {
        setLoading(false);
        if (chainId !== payout.provider.chain_id) {
          await window.ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(payout?.provider.chain_id!) }],
          });
          return;
        } else {
          const auth: Auth = await parcelSign(providerEth!);
          const headers = {
            authorization: 'Bearer ' + localStorage.getItem('jwt'),
            daoId: daoid!,
          };

          const res = await axios.post(
            `${process.env.REACT_APP_GATEWAY}api/parcel/create`,
            {
              auth,
              chainId: payout?.provider.chain_id,
              safeAddress: payout?.safe_address,
              txData: {
                proposalName: 'samudaiTransaction',
                description: 'Transaction from samudai',
                disbursement: [
                  {
                    token_address: payout.token_address,
                    amount: payout?.payout_amount,
                    address: payout?.receiver_address,
                    tag_name: 'payout',
                    category: 'Bounty',
                    comment: 'Bounty from Samudai',
                    amount_type: 'TOKEN',
                    referenceLink: '',
                  },
                ],
              },
            },
            { headers }
          );
          proposalId = res.data.data.result.proposalId;
          setLoading(false);
        }
      }
      setPaid(true);
      pay(transaction_hash.safeTxHash);
    } catch (err: any) {
      //toast
      setLoading(false);
      toast('Failure', 5000, 'Something went wrong', err?.message)();
    }
  };

  return (
    <div
      style={{
        marginTop: '50px',
        minWidth: '30px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ marginTop: '7px', marginRight: '40px', color: 'white' }}>
        {cutText(payout.name || '', 20)}({cutText(payout?.receiver_address || '', 10)}) -{' '}
        {payout?.payout_currency} {payout?.payout_amount}
      </div>

      {!paid && (
        <Button
          // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
          color="orange"
          style={{
            width: '70px',
            marginRight: '0',
            marginLeft: '10px',
          }}
          disabled={loading}
          onClick={() => {
            handlePay();
          }}
        >
          <span>{loading ? 'Paying' : 'Pay'}</span>
        </Button>
      )}
      {!!paid && (
        <Button
          // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
          color="green"
          style={{
            width: '70px',
            marginRight: '0',
            marginLeft: '10px',
          }}
          onClick={() => {}}
        >
          <span>Paid</span>
        </Button>
      )}
    </div>
  );
};

export default PaySmallComponent;
