import React, { useEffect, useState } from 'react';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { ClaimSubdomain } from '@samudai_xyz/web3-sdk';
import clsx from 'clsx';
import {
    changeContributorProgress,
    changeDaoProgress,
    changeDaoSubdomainClaimed,
    changeMemberSubdomainClaimed,
    selectAccount,
    selectActiveDao,
    selectContributorProgress,
    selectDaoProgress,
    selectProvider,
} from 'store/features/common/slice';
import {
    useCreateSubdomainDaoMutation,
    useLazyCheckSubdomainAccessForDaoQuery,
    useUpdateDaoProgressMutation,
} from 'store/services/Dao/dao';
import {
    useCreateSubdomainMutation,
    useLazyCheckSubdomainAccessForMemberQuery,
    useLazyGetCIDQuery,
    useUpdateContributorProgressMutation,
} from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './claim-subdomain-modal.module.scss';
import { useNavigate } from 'react-router-dom';
import sendNotification from 'utils/notification/sendNotification';
import { ActivityEnums, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
interface ClaimSubdomainModalProps {
    type?: 'dao' | 'contributor';
    onClose?: () => void;
}

export const ClaimSubdomainModal: React.FC<ClaimSubdomainModalProps> = ({ type, onClose }) => {
    const daoid = useTypedSelector(selectActiveDao);
    const walletAddress = useTypedSelector(selectAccount);
    const [subdomain, setSubdomain] = useState('');
    const [subdomainAvailable, setSubdomainAvailable] = useState(false);
    const [popop, setPopop] = useState(1);
    const [safes, setSafes] = useState<{ label: string; value: string }[]>([]);
    const providerEth = useTypedSelector(selectProvider);
    const [daoClaimed, setDaoClaimed] = useState(true);
    const [memberClaimed, setMemberClaimed] = useState(true);
    const [chainId, setChainId] = useState<number | null>(null);
    const memberId = getMemberId();
    const dispatch = useTypedDispatch();
    const claimSubdomainInstance = new ClaimSubdomain();
    const [errorMessage, setErrorMessage] = useState('');
    const [errorColor, setErrorColor] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const navigate = useNavigate();
    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const currDaoProgress = useTypedSelector(selectDaoProgress);

    const [updateDaoProgress] = useUpdateDaoProgressMutation();
    const [updateContributorProgress] = useUpdateContributorProgressMutation();
    const [createSubdomain] = useCreateSubdomainMutation();
    const [createSubdomainDao] = useCreateSubdomainDaoMutation();
    const [checkSubdomainAccessForDao] = useLazyCheckSubdomainAccessForDaoQuery();
    const [checkSubdomainAccessForMember] = useLazyCheckSubdomainAccessForMemberQuery();
    const [getCID] = useLazyGetCIDQuery();

    useEffect(() => {
        // getSafes();
        setSafes([]);
        const funGnosis = async () => {
            const chainId: number = await providerEth!
                .getNetwork()
                .then((network) => network.chainId);
            setChainId(chainId);
            const sdk = new Gnosis(providerEth!, chainId);
            const signer = providerEth?.getSigner();
            const address = await signer?.getAddress();
            const res = (await sdk?.connectGnosis(address!)) as GnosisTypes.UserSafe[];
            setSafes(
                res.map((safe) => ({
                    label: safe.safeAddress,
                    value: safe.safeAddress,
                }))
            );
            console.log(res);
        };
        funGnosis();
    }, [providerEth]);

    useEffect(() => {
        const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const validSubdomain = specialChar.test(subdomain);
        if (subdomain === '') {
            setErrorMessage('');
            setErrorColor('');
            setIsButtonDisabled(true);
        } else if (!validSubdomain && !subdomain.includes(' ')) {
            const delayDebounceFn = setTimeout(() => {
                claimSubdomainInstance.isSubdomainAvailable(subdomain).then((res) => {
                    setSubdomainAvailable(res);
                    if (res) {
                        setIsButtonDisabled(false);
                        setErrorMessage('This looks good :)');
                        setErrorColor('green');
                    } else {
                        setIsButtonDisabled(true);
                        setErrorMessage('This subdomain is already taken');
                        setErrorColor('red');
                    }
                });
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setIsButtonDisabled(true);
            setErrorMessage('Invalid format for name!');
            setErrorColor('red');
        }
    }, [subdomain]);

    const handleMemberClaim = async () => {
        if (!subdomain) {
            toast('Attention', 5000, 'Enter subdomain name', '')();
            return;
        }
        if (memberClaimed) {
            toast('Attention', 5000, 'You have already claimed a subdomain', '')();
            return;
        }
        try {
            dispatch(changeMemberSubdomainClaimed({ memberSubdomainClaimed: false }));
            setIsButtonDisabled(true);
            setPopop(2);
            const res = await getCID({ memberId, subdomain });
            claimSubdomainInstance.setCID(res.data?.data?.cid as string);
            const subdomainClaimTX = await claimSubdomainInstance.claimSubdomain(
                subdomain,
                walletAddress!
            );

            console.log('subdomainClaimTX', subdomainClaimTX.transactionHash);

            if (subdomainClaimTX.success) {
                const payload = {
                    subdomain: {
                        member_id: memberId,
                        subdomain: subdomain,
                        redirection_link: window.location.origin + '/' + memberId + '/profile',
                        wallet_address: walletAddress!,
                        transaction_hash: subdomainClaimTX.transactionHash,
                    },
                };
                createSubdomain(payload)
                    .unwrap()
                    .then(() => {
                        setIsButtonDisabled(false);
                        sendNotification({
                            to: [memberId],
                            for: NotificationsEnums.NotificationFor.MEMBER,
                            from: getMemberId(),
                            origin: '/subdomain',
                            by: NotificationsEnums.NotificationCreatedby.MEMBER,
                            metadata: {
                                id: '',
                                redirect_link: `/${getMemberId()}/profile`,
                            },
                            type: NotificationsEnums.SocketEventsToServiceContributorProfile
                                .CONTRIBUTOR_SUBDOMAIN_CLAIMED_SUCCESS,
                        });
                        if (!currContributorProgress.claim_subdomain)
                            updateContributorProgress({
                                memberId: getMemberId(),
                                itemId: [ActivityEnums.NewContributorItems.CLAIM_SUBDOMAIN],
                            }).then(() => {
                                dispatch(
                                    changeContributorProgress({
                                        contributorProgress: {
                                            ...currContributorProgress,
                                            claim_subdomain: true,
                                        },
                                    })
                                );
                            });
                    });
            } else {
                toast('Failure', 5000, 'Something went wrong', 'Try again later!')();
            }
            dispatch(changeMemberSubdomainClaimed({ memberSubdomainClaimed: true }));
        } catch (err: any) {
            //Address already claimed subdomain
            toast('Failure', 5000, 'Something went wrong', err?.reason || err?.message)();
        }
    };
    const handleDaoClaim = async () => {
        if (!subdomain) {
            toast('Attention', 5000, 'Enter subdomain name', '')();
            return;
        }
        if (daoClaimed) {
            toast('Attention', 5000, 'You have already claimed a subdomain', '')();
            return;
        }
        try {
            dispatch(changeDaoSubdomainClaimed({ daoSubdomainClaimed: false }));
            setIsButtonDisabled(true);
            setPopop(2);
            const res = await getCID({ memberId: daoid, subdomain });
            claimSubdomainInstance.setCID(res.data?.data?.cid as string);
            const subdomainClaimTX = await claimSubdomainInstance.claimSubdomain(
                subdomain,
                walletAddress!
            );

            console.log('subdomainClaimTX', subdomainClaimTX.transactionHash);

            if (subdomainClaimTX.success) {
                const payload = {
                    subdomain: {
                        dao_id: daoid,
                        subdomain: subdomain,
                        redirection_link: window.location.origin + '/discovery/dao/' + daoid,
                        wallet_address: walletAddress!,
                        transaction_hash: subdomainClaimTX.transactionHash,
                    },
                };
                createSubdomainDao(payload)
                    .unwrap()
                    .then(() => {
                        setIsButtonDisabled(false);
                        sendNotification({
                            to: [daoid],
                            for: NotificationsEnums.NotificationFor.ADMIN,
                            from: getMemberId(),
                            origin: '/subdomain',
                            by: NotificationsEnums.NotificationCreatedby.DAO,
                            metadata: {
                                id: '',
                                redirect_link: `/${getMemberId()}/profile`,
                            },
                            type: 'dao_subdomain_claimed_success',
                        });
                        if (!currDaoProgress.claim_subdomain)
                            updateDaoProgress({
                                daoId: daoid!,
                                itemId: [ActivityEnums.NewDAOItems.CLAIM_SUBDOMAIN],
                            }).then(() => {
                                dispatch(
                                    changeDaoProgress({
                                        daoProgress: {
                                            ...currDaoProgress,
                                            claim_subdomain: true,
                                        },
                                    })
                                );
                            });
                    });
            } else {
                toast('Failure', 5000, 'Something went wrong', 'Try again later!')();
            }
            dispatch(changeDaoSubdomainClaimed({ daoSubdomainClaimed: true }));
        } catch (err: any) {
            //Address already claimed subdomain
            toast('Failure', 5000, 'Something went wrong', err?.reason || err?.message)();
        }
    };

    useEffect(() => {
        if (type === 'dao') {
            const fn = async () => {
                const res = await checkSubdomainAccessForDao(daoid!).unwrap();
                if (res.data?.access) {
                    setDaoClaimed(false);
                } else if (res.data) {
                    setDaoClaimed(true);
                }
            };
            fn();
        }

        if (type === 'contributor') {
            const fn = async () => {
                const res = await checkSubdomainAccessForMember(memberId!).unwrap();
                if (res.data?.access) {
                    setMemberClaimed(false);
                } else if (res.data) {
                    setMemberClaimed(true);
                }
            };
            fn();
        }
    }, [daoid, memberId]);

    return (
        <Popup className={css.root} onClose={onClose}>
            {popop === 1 ? (
                <div data-analytics-parent="subdomain_claim_modal">
                    <h2 className={css.title}>
                        <span>🎉</span>
                        <span>Claim Subdomain</span>
                    </h2>

                    <p className={css.text}>
                        {type === 'dao'
                            ? 'Your DAO now has an identity, send it to anyone over the internet.'
                            : 'You now have a unique identity, send it to anyone over the internet.'}
                    </p>

                    <PopupSubtitle className={css.subtitle} text="Claim Subdomain" />

                    <div className={css.input_container}>
                        <Input
                            className={css.input}
                            value={subdomain}
                            onChange={(ev) => {
                                const subdomain = ev.target.value.toLowerCase();
                                setSubdomain(subdomain);
                            }}
                            placeholder={type === 'dao' ? 'Your DAO Name' : 'Your Name'}
                            redOrGreen={errorColor}
                            error={errorMessage}
                        />
                        <div className={clsx(css.text, css.input_text)}>.samudai.eth</div>
                    </div>

                    {/* {type === 'dao' && (
                        <div className={css.input_container}>
                            <Input
                                className={clsx(css.input, css.input_wallet)}
                                value={addressValue}
                                onChange={(ev) => setAddressValue(ev.target.value)}
                                placeholder={'Wallet Address'}
                            />
                            <Select
                        className={clsx(css.select)}
                        classNamePrefix="rs"
                        // defaultValue={
                        //   safes.map((safe) => ({
                        //     label: safe,
                        //     value: safe,
                        //   }))[0]
                        // }
                        formatOptionLabel={(data: { value: string }) => (
                            <div style={{ color: 'white' }}>{data.value}</div>
                        )}
                        placeholder="Choose Wallet"
                        isMulti={false}
                        isSearchable={false}
                        styles={paymentsSelectStyles}
                        options={safes.filter((safe) => safe.value !== addressValue?.value)}
                        value={addressValue}
                        isClearable={false}
                        onChange={(value) => {
                            console.log(value);
                            setAddressValue(value as { label: string; value: string });
                        }}
                        data-analytics-click="safe_select"
                    />
                        </div>
                    )} */}

                    <button
                        data-analytics-click="subdomaim_claim"
                        className={css.button}
                        onClick={() => {
                            type === 'dao' ? handleDaoClaim() : handleMemberClaim();
                        }}
                        style={{ background: isButtonDisabled ? '#52585E' : '' }}
                        disabled={isButtonDisabled}
                    >
                        Request Subdomain
                    </button>
                </div>
            ) : (
                <div>
                    <h2 className={css.title}>
                        <span>🎉</span>
                        <span>Subdomain Claimed!</span>
                    </h2>

                    <p className={css.text}>
                        {type === 'dao'
                            ? 'Your DAO now has an identity, send it to anyone over the internet.'
                            : 'You now have a unique identity, send it to anyone over the internet.'}
                    </p>

                    <p className={css.text}>We will notify it to you once done ✨</p>

                    <img className={css.frame} src="/img/telegram-frame.png" alt="" />

                    <p className={css.text} style={{ maxWidth: '370px' }}>
                        Also connect your Telegram for Instant Notifications.
                    </p>

                    <button
                        className={css.button}
                        onClick={() => {
                            navigate(`/${memberId}/settings/contributor/apps`);
                            onClose?.();
                        }}
                    >
                        Connect Telegram
                    </button>
                </div>
            )}
        </Popup>
    );
};
