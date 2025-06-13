import {
    addWallet,
    addProvider,
    addChainList,
    addDefaultProvider,
    providerList,
    addSafeOwners,
    selectDefaultProvider,
    setRefetch,
    selectMemberData,
    addMemberData,
    selectSafeOwners,
    addTokens,
} from 'store/features/payments/paymentsSlice';
import {
    useLazyGetChainListQuery,
    useLazyGetProviderQuery,
    useLazyGetDefaultProviderQuery,
    useAddPaymentsMutation,
    useChangeDefaultMutation,
    useAddProviderMutation,
    useDeleteProviderMutation,
    useUpdatePaymentStatusMutation,
} from 'store/services/payments/payments';
import {
    ActivityEnums,
    NotificationsEnums,
    Payment,
    PaymentEnums,
    Provider,
    addPaymentsRequest,
} from '@samudai_xyz/gateway-consumer-types';
import { useParams } from 'react-router-dom';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { getMemberId, getMemberIdfromAddress, getRawText } from 'utils/utils';
import { selectAccount, selectActiveDao, selectProvider } from 'store/features/common/slice';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { Gnosis, GnosisFetch, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { TxObject } from '@samudai_xyz/web3-sdk/dist/types/gnosis/utils/types';
import { useCompleteProjectPayoutMutation } from 'store/services/projects/totalProjects';
import { useCompleteJobPayoutMutation } from 'store/services/jobs/totalJobs';
import { useGetMemberByIdMutation } from 'store/services/userProfile/userProfile';
import { useCreateDiscussionMutation } from 'store/services/Discussion/discussion';
import { useDiscussionCreate } from 'components/@pages/forum';
import { serialize } from 'components/editor';
import { updateActivity } from 'utils/activity/updateActivity';
import mixpanel from 'mixpanel-browser';
import store from 'store/store';
import { ethers } from 'ethers';
import { QueuedTxnObject } from 'components/@pages/payments/PaymentsHistory';

export const usePayments = () => {
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const providers = useTypedSelector(providerList);
    const providerEth = useTypedSelector(selectProvider);
    const defaultProvider = useTypedSelector(selectDefaultProvider);
    const account = useTypedSelector(selectAccount);
    const memberData = useTypedSelector(selectMemberData);
    const safeOwners = useTypedSelector(selectSafeOwners);
    const dispatch = useTypedDispatch();
    const member_id = getMemberId();

    const handleCreate = useDiscussionCreate();
    const [getChainList] = useLazyGetChainListQuery();
    const [getProviders] = useLazyGetProviderQuery();
    const [getDefaultProvider] = useLazyGetDefaultProviderQuery();
    const [addPaymentTrigger] = useAddPaymentsMutation();
    const [changeDefault] = useChangeDefaultMutation();
    const [addProviderApi] = useAddProviderMutation();
    const [deleteProvider] = useDeleteProviderMutation();
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
    const [completeProjectPayout] = useCompleteProjectPayoutMutation();
    const [completeJobPayout] = useCompleteJobPayoutMutation();
    const [getMember] = useGetMemberByIdMutation();
    const [createDiscussion] = useCreateDiscussionMutation();

    const fetchMemberDataFromAddress = async (walletAddress: string) => {
        if (memberData[walletAddress]) {
            return memberData[walletAddress];
        }

        const res = await getMember({
            member: {
                type: 'wallet_address',
                value: walletAddress,
            },
        })
            .unwrap()
            .then((res) => res.data?.member);

        if (res) {
            const newData = { ...memberData };
            newData[walletAddress] = res;
            dispatch(addMemberData(newData));
        }

        return res;
    };

    const fetchProviderAndWallets = async () => {
        try {
            const providersData = await getProviders(daoid!).unwrap();
            if (providersData?.data?.data) {
                const wallets: Provider[] = [];
                const providersList: Provider[] = [];
                providersData?.data?.data.forEach((item) => {
                    item.provider_type === 'wallet' ? wallets.push(item) : providersList.push(item);
                });
                dispatch(addWallet(wallets));
                dispatch(addProvider(providersList));
                try {
                    const tokens: Record<string, GnosisTypes.WidgetBalance[]> = {};
                    await Promise.all(
                        providersList.map(async (provider) => {
                            const gnosis = new GnosisFetch(provider.address, provider.chain_id);
                            const bal = await gnosis.getWidgetTokenBalance();
                            if (bal) {
                                tokens[provider.address] = bal;
                            }
                        })
                    );
                    dispatch(addTokens(tokens));
                } catch (err) {
                    console.log(err);
                    dispatch(addTokens({}));
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchChainList = async () => {
        try {
            const chainListData = await getChainList().unwrap();
            if (chainListData?.data) {
                dispatch(addChainList(chainListData?.data));
            }
        } catch (err) {
            console.log(err);
        }
    };

    // const fetchTokens = async () => {
    //     if (providers.length) {
    //         try {
    //             const tokens: Record<string, GnosisTypes.WidgetBalance[]> = {};
    //             await Promise.all(
    //                 providers.map(async (provider) => {
    //                     const gnosis = new GnosisFetch(provider.address, provider.chain_id);
    //                     const bal = await gnosis.getWidgetTokenBalance();
    //                     if (bal) {
    //                         tokens[provider.address] = bal;
    //                     }
    //                 })
    //             );
    //             dispatch(addTokens(tokens));
    //         } catch (err) {
    //             console.log(err);
    //             dispatch(addTokens({}));
    //         }
    //     } else {
    //         dispatch(addTokens({}));
    //     }
    // };

    const fetchDefaultProvider = async () => {
        try {
            const defaultProviderData = await getDefaultProvider(daoid!).unwrap();
            if (defaultProviderData?.data) {
                dispatch(addDefaultProvider(defaultProviderData.data));
                if (providerEth) {
                    try {
                        const sdk = new Gnosis(providerEth, defaultProviderData.data.chain_id);
                        const safeOwners = await sdk?.getSafeOwners(
                            defaultProviderData.data.address
                        );
                        dispatch(addSafeOwners(safeOwners || []));
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeDefaultProvider = async (itemId: string) => {
        try {
            await changeDefault({
                providerId: itemId!,
                daoId: daoid!,
            });
            fetchDefaultProvider();
            sendNotification({
                to: [daoid!],
                for: NotificationsEnums.NotificationFor.ADMIN,
                from: getMemberId(),
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: itemId,
                    redirect_link: `/${daoid!}/payments`,
                },
                type: NotificationsEnums.SocketEventsToServicePayment.DEFAULT_PROVIDER_CHANGED,
            });
        } catch (err) {
            console.log(err);
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    const handleAddProvider = async (provider: {
        provider_type: string;
        chain_id: number;
        address: string;
        name: string;
    }) => {
        const payload = {
            ...provider,
            dao_id: activeDao!,
            created_by: getMemberId(),
            is_default: providers.length === 0,
        };
        try {
            const res = await addProviderApi({ provider: payload }).unwrap();
            fetchProviderAndWallets();
            if (res?.data?.provider_id) {
                sendNotification({
                    to: [daoid!],
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: getMemberId(),
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res.data.provider_id,
                        redirect_link: `/${daoid!}/payments`,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment.PROVIDER_ADDED,
                });
            }
            toast('Success', 5000, 'Provider added successfully', '')();
        } catch (err) {
            console.log(err);
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    const handleDeleteProvider = async (providerId: string) => {
        try {
            await deleteProvider(providerId);
            fetchProviderAndWallets();
            toast('Success', 5000, 'Provider deleted successfully', '')();
        } catch (err) {
            console.log(err);
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    const handleAddPayment = async (payment: addPaymentsRequest) => {
        await addPaymentTrigger(payment)
            .unwrap()
            .then(async (res) => {
                console.log(res);
                const receiver = await getMemberIdfromAddress(res.data!.data.receiver);
                dispatch(setRefetch(true));
                toast('Success', 5000, 'Payment initiated successfully', '')();
                sendNotification({
                    to: [activeDao],
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: member_id,
                    origin: '/payments',
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res.data?.data?.payment_id || '',
                        // id: paymentMock.payment_id,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment
                        .PAYMENT_CREATED_NOTIFICATION,
                });

                sendNotification({
                    to: [receiver],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: member_id,
                    origin: '/payments',
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res.data!.data.payment_id!,
                        redirect_link: `/${daoid!}/payments`,
                        // id: paymentMock.payment_id,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment
                        .PAYMENT_CREATED_TO_CONTRIBUTOR_NOTIFICATION,
                });

                sendNotification({
                    to: payment.payment.sender_safe_owner,
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: member_id,
                    origin: '/payments',
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res.data!.data.payment_id!,
                        redirect_link: `/${daoid!}/payments`,
                        // id: paymentMock.payment_id,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment.FIRST_SIGNING_PAYMENT,
                });
            });
    };

    const handleExecute = async (queuedData: QueuedTxnObject, payment?: Payment) => {
        if (providerEth) {
            const connectedWallet = await providerEth.getSigner().getAddress();
            const sdk = new Gnosis(providerEth, queuedData.provider.chain_id);
            const owners = await sdk?.getSafeOwners(queuedData.provider.address);
            if (owners && !owners.includes(connectedWallet)) {
                toast(
                    'Failure',
                    5000,
                    'Unable to execute transaction',
                    'You are not an owner of this safe'
                )();
                return;
            }
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId === `0x${queuedData.provider.chain_id}`) {
                try {
                    const sdk = new Gnosis(providerEth, queuedData.provider.chain_id);
                    await sdk.executeTransaction(
                        queuedData.safeTxHash,
                        queuedData.provider.address
                    );
                    dispatch(setRefetch(true));
                    toast('Success', 5000, 'Transaction Executed', '')();

                    if (payment) {
                        await updatePaymentStatus({
                            paymentId: payment.payment_id,
                            status: PaymentEnums.PaymentStatus.PAID,
                            completedAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                        if (payment.payout_id) {
                            if (payment.type === 'Job') {
                                await completeJobPayout(payment.payout_id);
                            } else {
                                await completeProjectPayout(payment.payout_id);
                            }
                        }
                    }

                    sendNotification({
                        to: [daoid!],
                        for: NotificationsEnums.NotificationFor.ADMIN,
                        from: getMemberId(),
                        origin: '/payments/complete',
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: queuedData.safeTxHash,
                            redirect_link: `/${daoid!}/payments`,
                        },
                        type: NotificationsEnums.SocketEventsToServicePayment
                            .PAYMENT_COMPLETED_NOTIFICATION,
                    });

                    sendNotification({
                        to: queuedData.transactionDetails.map((item) => item.walletAddress),
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: getMemberId(),
                        origin: '/payments/complete',
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: queuedData.safeTxHash,
                            redirect_link: `/${daoid!}/payments`,
                        },
                        type: NotificationsEnums.SocketEventsToServicePayment
                            .CONTRIBUTOR_PAYMENT_RECEIVED,
                    });
                } catch (err) {
                    toast('Failure', 5000, 'Something went wrong', '')();
                    console.log(err);
                }
            } else {
                await window.ethereum!.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(queuedData.provider.chain_id) }],
                });
                return;
            }
        }
    };

    const handleApprove = async (queuedData: QueuedTxnObject, payment?: Payment) => {
        if (providerEth) {
            const connectedWallet = await providerEth.getSigner().getAddress();
            const sdk = new Gnosis(providerEth, queuedData.provider.chain_id);
            const owners = await sdk?.getSafeOwners(queuedData.provider.address);
            if (owners && !owners.includes(connectedWallet)) {
                toast(
                    'Failure',
                    5000,
                    'Unable to approve transaction',
                    'You are not an owner of this safe'
                )();
                return;
            }
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId === `0x${queuedData.provider.chain_id}`) {
                try {
                    await sdk.confirmTransaction(
                        queuedData.safeTxHash,
                        queuedData.provider.address
                    );
                    dispatch(setRefetch(true));
                    sendNotification({
                        to: [payment?.sender || ''],
                        for: NotificationsEnums.NotificationFor.ADMIN,
                        from: member_id,
                        origin: '/payments',
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: payment?.payment_id || '',
                            redirect_link: `/${daoid!}/payments`,
                            // id: paymentMock.payment_id,
                        },
                        type: NotificationsEnums.SocketEventsToServicePayment.SIGNING_PAYMENT,
                    });
                    toast('Success', 5000, 'Transaction Confirmed', '')();
                } catch (err) {
                    toast('Failure', 5000, 'Something went wrong', '')();
                    console.log(err);
                }
            } else {
                await window.ethereum!.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(queuedData.provider.chain_id) }],
                });
                return;
            }
        }
    };

    const handleReject = async (queuedData: QueuedTxnObject) => {
        if (providerEth && account) {
            const connectedWallet = await providerEth.getSigner().getAddress();
            const sdk = new Gnosis(providerEth, queuedData.provider.chain_id);
            const owners = await sdk?.getSafeOwners(queuedData.provider.address);
            if (owners && !owners.includes(connectedWallet)) {
                toast(
                    'Failure',
                    5000,
                    'Unable to reject transaction',
                    'You are not an owner of this safe'
                )();
                return;
            }
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId === `0x${queuedData.provider.chain_id}`) {
                try {
                    await sdk.rejectTransaction(
                        queuedData.provider.address,
                        queuedData.nonce,
                        account
                    );
                    dispatch(setRefetch(true));
                    toast('Success', 5000, 'Transaction Rejected', '')();
                } catch (err) {
                    toast('Failure', 5000, 'Something went wrong', '')();
                    console.log(err);
                }
            } else {
                await window.ethereum!.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(queuedData.provider.chain_id) }],
                });
                return;
            }
        }
    };

    const handleNudge = async (type: 'reject' | 'approve', queuedData: QueuedTxnObject) => {
        if (queuedData) {
            try {
                const gnosis = new GnosisFetch(
                    queuedData.provider.address,
                    queuedData.provider.chain_id
                );
                const res = await gnosis.getOwnersNeedToBeNudged(queuedData.confirmations);
                if (res) {
                    sendNotification({
                        to: res,
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: getMemberId(),
                        origin: '/payments',
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: queuedData.safeTxHash || '',
                            redirect_link: `/${daoid!}/payments`,
                        },
                        type:
                            type === 'reject'
                                ? NotificationsEnums.SocketEventsToServicePayment.REJECT_TXN_NUDGE
                                : NotificationsEnums.SocketEventsToServicePayment.ACCEPT_TXN_NUDGE,
                    });
                }
                toast('Success', 5000, 'Transaction Nudged', '')();
            } catch (err) {
                toast('Failure', 5000, 'Something went wrong', '')();
                console.log(err);
            }
        }
    };

    const handleCreateDiscussion = async (data: TxObject) => {
        try {
            const participants = await Promise.all(
                safeOwners.flatMap((address) => {
                    return fetchMemberDataFromAddress(address)
                        .then((member) => member?.member_id || '')
                        .catch(() => '');
                })
            );

            const modifiedString = [{ type: 'paragraph', children: [{ text: 'Transaction' }] }];
            const topic = `[Transaction] ${data.safeTxHash.slice(0, 8)}...`;
            createDiscussion({
                discussion: {
                    topic: topic,
                    description: serialize(modifiedString),
                    description_raw: getRawText(modifiedString),
                    category: 'transaction',
                    tags: ['payments'],
                    closed: false,
                    visibility: 'private',
                    dao_id: activeDao,
                    created_by: member_id,
                },
                participants: participants.filter((i) => !!i),
            })
                .unwrap()
                .then((res) => {
                    toast('Success', 5000, 'Discussion Created', '')();
                    mixpanel.track('create_discussion', {
                        discussion_id: res.data.discussion_id,
                        dao_id: activeDao,
                        topic: topic,
                        created_by: member_id,
                        category: 'Transaction',
                        closedStatus: false,
                        origin: 'discussion',
                        timestamp: new Date().toUTCString(),
                    });
                    updateActivity({
                        dao_id: activeDao,
                        member_id: getMemberId(),
                        project_id: '',
                        task_id: '',
                        discussion_id: res.data.discussion_id,
                        job_id: '',
                        payment_id: '',
                        bounty_id: '',
                        action_type: ActivityEnums.ActionType.DISCUSSION_ADDED,
                        visibility: ActivityEnums.Visibility.PUBLIC,
                        member: {
                            username: store.getState().commonReducer?.member?.data.username || '',
                            profile_picture:
                                store.getState().commonReducer?.member?.data.profile_picture || '',
                        },
                        dao: {
                            dao_name: store.getState().commonReducer?.activeDaoName || '',
                            profile_picture: store.getState().commonReducer?.profilePicture || '',
                        },
                        project: {
                            project_name: '',
                        },
                        task: {
                            task_name: '',
                        },
                        action: {
                            message: '',
                        },
                        metadata: {
                            title: topic,
                            id: res.data.discussion_id,
                        },
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (err) {
            toast('Failure', 5000, 'Something went wrong', '')();
            console.error(err);
        }
    };

    return {
        fetchChainList,
        fetchProviderAndWallets,
        fetchDefaultProvider,
        handleAddPayment,
        changeDefaultProvider,
        handleAddProvider,
        handleDeleteProvider,
        handleApprove,
        handleExecute,
        handleReject,
        handleNudge,
        fetchMemberDataFromAddress,
        handleCreateDiscussion,
    };
};
