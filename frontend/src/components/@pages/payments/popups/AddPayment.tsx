import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { IProviderList, providerValues } from '../utils/constants';
import { GnosisChainValues, IChainList } from '../utils/providerConstants';
import { paymentsSelectStyles } from '../utils/selectStyles';
import { IMember, Member } from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import clsx from 'clsx';
import { BigNumber, ethers } from 'ethers';
import { selectAccount, selectProvider } from 'store/features/common/slice';
import { useLazySearchMemberQuery } from 'store/services/Search/Search';
import { useGetParcelBalanceMutation } from 'store/services/payments/payments';
import useDebounce from 'hooks/useDebounce';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import { selectRoleStyles } from 'components/@pages/settings/utils/select-role.styles';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Complete from 'ui/Complete/Complete';
import Highlighter from 'ui/Highlighter/Highlighter';
import { toast } from 'utils/toast';
import { IPaymentCurrency } from 'utils/types/Payments';
import { getMemberId } from 'utils/utils';
import PaymentsCustomControl from '../PaymentsCustomControl';
import styles from '../styles/AddPayment.module.scss';
import { usePayments } from 'utils/payments/use-payments';
import { providerList } from 'store/features/payments/paymentsSlice';

require('dotenv').config();

interface AddPaymentProps {
    onClose?: () => void;
}

const AddPayment: React.FC<AddPaymentProps> = ({ onClose }) => {
    const [safeOwners, setSafeOwners] = useState<string[]>([]);
    const [safeGnosis, setSafeGnosis] = useState<IProviderList[]>([
        {
            id: 0,
            name: 'Select Safe Address',
            chain_id: 0,
        },
    ]);
    const [provider, setProvider] = useState<IProviderList>(providerValues[0]);
    const [safeGnosisData, setSafeGnosisData] = useState<IProviderList>(safeGnosis[0]);
    const [currency, setCurrency] = useState<IPaymentCurrency>({} as IPaymentCurrency);
    const [currencyList, setCurrencyList] = useState<IPaymentCurrency[]>([] as IPaymentCurrency[]);
    const [chain, setChain] = useState<IChainList>(GnosisChainValues[0]);
    const [complete, setComplete] = useState<boolean>(false);
    const [address, setAddress] = useState('');
    const [bounty, setBounty] = useInput('');
    const [sdkVale, setSdkValue] = useState<Gnosis | null>(null);
    const [search, setSearch] = useState('');
    const [memberData, setMemberData] = useState<any[]>([]);
    const [chainId, setChainId] = useState<number>(0);

    const { daoid } = useParams();
    const providerEth = useTypedSelector(selectProvider);
    const connectedWallet = useTypedSelector(selectAccount);
    const account = useTypedSelector(selectAccount);
    const providers = useTypedSelector(providerList);
    const member_id = getMemberId();

    const [searchMember] = useLazySearchMemberQuery();
    const { handleAddPayment } = usePayments();
    const [getParcelBalance] = useGetParcelBalanceMutation();

    useEffect(() => {
        const newSafeGnosis: IProviderList[] = [
            {
                id: 0,
                name: 'Select Safe Address',
                chain_id: 0,
            },
        ];
        providers.forEach((item) => {
            if (item.provider_type === 'gnosis') {
                newSafeGnosis.push({
                    id: Number(item.id),
                    name: item.address,
                    chain_id: item?.chain_id,
                });
            }
        });
        setSafeGnosis(newSafeGnosis);
    }, [providers]);

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const fun2 = async () => {
        if (search.length < 3) return;
        try {
            const res2 = await searchMember(search ? `${search}` : '').unwrap();
            setMemberData(res2?.data || ([] as Member[]));
        } catch (err) {
            toast('Failure', 5000, 'Error in fetching discovery data', '')();
        }
    };
    const funMember = useDebounce(fun2, 500);

    const handleChange = (e: any) => {
        setAddress(e?.default_wallet_address || '');
    };

    useEffect(() => {
        funMember(undefined);
    }, [search]);

    console.log(memberData);

    // const [balance, setBalance] = useState<>('');
    const getCurrency = async () => {
        setCurrency({} as IPaymentCurrency);
        setCurrencyList([] as IPaymentCurrency[]);
        let value;
        const currencyVal: IPaymentCurrency[] = [];
        try {
            if (provider.name === 'gnosis') {
                if (!!providerEth && !!safeGnosisData.chain_id) {
                    value = new Gnosis(providerEth, safeGnosisData.chain_id);
                    const res = (await value.getSafeBalance(
                        safeGnosisData.name
                    )) as GnosisTypes.SafeBalanceUsdResponse[];
                    if (res.length > 0) {
                        res.forEach((item: GnosisTypes.SafeBalanceUsdResponse, id: number) => {
                            currencyVal.push({
                                currency: item.token
                                    ? item.token.name
                                    : safeGnosisData.chain_id === 1 || safeGnosisData.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                balance: item.token
                                    ? ethers.utils.formatUnits(
                                          BigNumber.from(item.balance),
                                          item.token.decimals
                                      )
                                    : ethers.utils.formatEther(item.balance),
                                token_address: item.tokenAddress,
                                name: item.token
                                    ? item.token.name
                                    : safeGnosisData.chain_id === 1 || safeGnosisData.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                decimal: item.token ? item.token.decimals : 0,
                                logo_uri: item.token ? item.token.logoUri : '',
                            });
                        });

                        setCurrency(currencyVal[0]);
                        setCurrencyList(currencyVal);
                    }
                }
            } else if (provider.name === 'parcel') {
                // if (safeParcelData.chain_id) {
                //     setCurrency({} as IPaymentCurrency);
                //     setCurrencyList([] as IPaymentCurrency[]);
                //     const auth: Auth = await parcelSign(providerEth!);
                //     const payload = {
                //         auth,
                //         chainId: safeParcelData.chain_id,
                //         safeAddress: safeParcelData.name,
                //     };
                //     getParcelBalance(payload)
                //         .unwrap()
                //         .then((res) => {
                //             if (
                //                 (res?.data?.balances as GnosisTypes.SafeBalanceUsdResponse[])
                //                     .length > 0
                //             ) {
                //                 res.data?.balances.forEach(
                //                     (item: GnosisTypes.SafeBalanceUsdResponse) => {
                //                         currencyVal.push({
                //                             currency: item.token
                //                                 ? item.token.name
                //                                 : safeParcelData.chain_id === 1 ||
                //                                   safeParcelData.chain_id === 5
                //                                 ? 'ETH'
                //                                 : 'MATIC',
                //                             balance: item.token
                //                                 ? ethers.utils.formatUnits(
                //                                       BigNumber.from(item.balance),
                //                                       item.token.decimals
                //                                   )
                //                                 : ethers.utils.formatEther(item.balance),
                //                             token_address: item.tokenAddress,
                //                             name: item.token
                //                                 ? item.token.name
                //                                 : safeParcelData.chain_id === 1 ||
                //                                   safeParcelData.chain_id === 5
                //                                 ? 'ETH'
                //                                 : 'MATIC',
                //                             decimal: item.token ? item.token.decimals : 0,
                //                             logo_uri: item.token ? item.token.logoUri : '',
                //                         });
                //                     }
                //                 );
                //                 setCurrency(currencyVal[0]);
                //                 setCurrencyList(currencyVal);
                //             }
                //         });
                // }
            } else if (provider.name === 'wallet') {
                // TODO: Commented for now
                // setCurrency({} as IPaymentCurrency);
                // setCurrencyList([] as IPaymentCurrency[]);
                // const tokenBalance = new UserTokenBalance();
                // const chainId: number = await providerEth!
                //     .getNetwork()
                //     .then((network) => network.chainId);
                // setChainId(chainId);
                // const signer = providerEth?.getSigner();
                // const bal = await signer?.getBalance();
                // const res = await tokenBalance.getBalance(chainId!, connectedWallet!);
                // console.log(chainId!, connectedWallet!);
                // (res as UserTokenBalanceResponse[]).forEach((item) => {
                //     currencyVal.push({
                //         currency: item.symbol || 'ETH',
                //         balance: item.balance || '0',
                //         token_address: item.contractAddress || '',
                //         name: item.symbol || 'ETH',
                //         decimal: 0,
                //         logo_uri: '',
                //     });
                // });
                // currencyVal.push(currencyAdd(chainId, ethers.utils.formatEther(bal!)));
                // setCurrency(currencyVal[0]);
                // setCurrencyList(currencyVal);
                // if (value) setSdkValue(value);
            }
        } catch (err) {
            //toast
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    const getSafeOwners = async () => {
        try {
            if (provider.name === 'gnosis') {
                if (!!providerEth && !!safeGnosisData.chain_id) {
                    const value = new Gnosis(providerEth, safeGnosisData.chain_id);
                    const res = (await value.getSafeOwners(safeGnosisData.name)) as string[];
                    // if (!res) {
                    //   toast('Failure', 5000, 'You are not a safe owner', '')();
                    // }
                    if (res.length > 0) {
                        setSafeOwners(res);
                    }
                }
            }
        } catch (err) {
            //toast
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    useEffect(() => {
        getCurrency();
        getSafeOwners();
    }, [getParcelBalance, provider, providerEth, safeGnosisData]);

    // useEffect(() => {
    //   console.log('receiver', receiver);
    //   if (receiver.trim().length === 0) return;
    //   const fun = async () => {
    //     try {
    //       const res = await searchMember(receiver).unwrap();
    //       setReceiversData(res.data || []);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };
    //   fun();
    // }, [receiver]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!address && !bounty) {
            toast('Failure', 5000, 'Input Field cannot be empty', '')();
            return;
        }

        if (address.length !== 42) {
            toast('Failure', 5000, 'Invalid Address', '')();
            return;
        }

        if (Number(bounty) > Number(currency.name)) {
            return toast('Failure', 5000, 'Insufficient Balance', '')();
        }
        if (provider.name === 'gnosis') {
            if (providerEth) {
                const connectedWallet = await providerEth.getSigner().getAddress();
                if (!safeOwners.includes(connectedWallet)) {
                    toast(
                        'Failure',
                        5000,
                        'Unable to create transaction',
                        'You are not an owner of this safe'
                    )();
                    return;
                }
            }
        }
        try {
            const chainId: number = await providerEth!
                .getNetwork()
                .then((network: any) => network.chainId);
            let transaction_hash: GnosisTypes.SafeTransactionResponse | GnosisTypes.ErrorResponse =
                {} as GnosisTypes.SafeTransactionResponse;

            if (!!address && !!bounty) {
                if (provider.name === 'gnosis') {
                    if (chainId === safeGnosisData.chain_id) {
                        const sdkVale = new Gnosis(providerEth!, chainId);
                        transaction_hash = (await (sdkVale as Gnosis).createSingleGnosisTx(
                            address,
                            bounty,
                            safeGnosisData.name,
                            account!,
                            currency.token_address
                        )) as GnosisTypes.SafeTransactionResponse;
                        const date = new Date().toISOString();

                        handleAddPayment({
                            payment: {
                                sender: safeGnosisData.name,
                                sender_safe_owner: safeOwners,
                                receiver: address,
                                value: {
                                    currency: currency,
                                    amount: bounty,
                                    contract_address: currency.token_address || '',
                                },
                                dao_id: daoid!,
                                safe_transaction_hash: transaction_hash.safeTxHash,
                                payment_type: provider.name,
                                initiated_at: date,
                                created_by: member_id,
                                status: 'pending',
                                chain_id: safeGnosisData.chain_id!,
                            },
                        });
                        setComplete(true);
                    } else {
                        await window.ethereum!.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: ethers.utils.hexValue(safeGnosisData.chain_id!) }],
                        });
                        return;
                    }
                } else if (provider.name === 'parcel') {
                    // if (chainId !== safeParcelData.chain_id) {
                    //     // await window.ethereum!.request({
                    //     //     method: 'wallet_switchEthereumChain',
                    //     //     params: [{ chainId: ethers.utils.hexValue(safeGnosisData.chain_id!) }],
                    //     // });
                    //     return;
                    // } else {
                    //     const auth: Auth = await parcelSign(providerEth!);
                    //     const headers = {
                    //         authorization: 'Bearer ' + localStorage.getItem('jwt'),
                    //         daoId: daoid!,
                    //     };
                    //     const res = await axios.post(
                    //         `${process.env.REACT_APP_GATEWAY}api/parcel/create`,
                    //         {
                    //             auth,
                    //             chainId: safeParcelData.chain_id,
                    //             safeAddress: safeParcelData.name,
                    //             txData: {
                    //                 proposalName: 'samudaiTransaction',
                    //                 description: 'Transaction from samudai',
                    //                 disbursement: [
                    //                     {
                    //                         token_address: currency.token_address,
                    //                         amount: bounty,
                    //                         address: address,
                    //                         tag_name: 'payout',
                    //                         category: 'Bounty',
                    //                         comment: 'Bounty from Samudai',
                    //                         amount_type: 'TOKEN',
                    //                         referenceLink: '',
                    //                     },
                    //                 ],
                    //             },
                    //         },
                    //         { headers }
                    //     );
                    //     proposalId = res.data.data.result.proposalId;
                    // }
                } else {
                    // if (chainId === safeWalletData.chain_id) {
                    //   hash = await tokenTransaction(
                    //     providerEth!,
                    //     bounty,
                    //     address,
                    //     currency.token_address
                    //   );
                    // }
                }
            }
        } catch (err) {
            //toast
            toast('Failure', 5000, 'Something went wrong', '')();
        }
    };

    const allowButton = [address, bounty].every((val) => val.trim() !== '');

    return (
        <React.Fragment>
            {!complete ? (
                <Popup className={styles.root} onClose={onClose}>
                    <PopupTitle
                        icon="/img/icons/file.png"
                        title={
                            <>
                                <strong>New</strong> Payment
                            </>
                        }
                    />
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <PopupSubtitle
                            text="Select a Payment Method"
                            className={styles.providerTitle}
                        />
                        <Select
                            value={provider}
                            className={styles.select}
                            options={providerValues
                                .map((item) => ({ ...item, value: item.id }))
                                .filter((i) => i.id !== provider.id && i.id !== 0)}
                            onChange={(value) => setProvider(value as IProviderList)}
                            formatOptionLabel={PaymentsCustomControl}
                            isSearchable={false}
                            classNamePrefix="rs"
                            styles={paymentsSelectStyles}
                        />
                        <div className={styles.item}>
                            {provider.name === 'gnosis' && (
                                <Select
                                    value={safeGnosisData}
                                    className={styles.select}
                                    options={safeGnosis
                                        .map((item) => ({ ...item, value: item.id }))
                                        .filter((i) => i.id !== safeGnosisData.id && i.id !== 0)}
                                    onChange={(value) => setSafeGnosisData(value as IProviderList)}
                                    formatOptionLabel={PaymentsCustomControl}
                                    isSearchable={false}
                                    classNamePrefix="rs"
                                    styles={paymentsSelectStyles}
                                />
                            )}
                            {/* {provider.name === 'parcel' && (
                                <Select
                                    value={safeParcelData}
                                    className={styles.select}
                                    options={safeParcel
                                        .map((item) => ({ ...item, value: item.id }))
                                        .filter((i) => i.id !== safeParcelData.id && i.id !== 0)}
                                    onChange={(value) => setSafeParcelData(value as IProviderList)}
                                    formatOptionLabel={PaymentsCustomControl}
                                    isSearchable={false}
                                    classNamePrefix="rs"
                                    styles={paymentsSelectStyles}
                                />
                            )}
                            {provider.name === 'wallet' && (
                                <>
                                    <Input
                                        value={connectedWallet!}
                                        className={styles.input}
                                        placeholder="Wallet Address"
                                    />
                                    <PopupSubtitle
                                        text="Chain"
                                        className="add-payments__chain-subtitle"
                                    />
                                    <Select
                                        formatOptionLabel={PaymentsCustomControl}
                                        isSearchable={false}
                                        styles={paymentsSelectStyles}
                                        options={GnosisChainValues.filter(
                                            (i) => i.chain_id === chainId
                                        )}
                                        value={GnosisChainValues.find(
                                            (i) => i.chain_id === chainId
                                        )}
                                        onChange={(value) => setChain(value as IChainList)}
                                    />
                                </>
                            )} */}
                        </div>
                        <div className={styles.item}>
                            <Select
                                classNamePrefix="rs"
                                inputValue={search}
                                isSearchable
                                isClearable
                                onChange={handleChange}
                                onInputChange={handleSearch}
                                options={memberData.map((item) => ({
                                    ...item,
                                    value: item.member_id,
                                    label: item.username,
                                }))}
                                placeholder="Address of the recipient"
                                styles={selectRoleStyles}
                                formatOptionLabel={(user: IMember) => (
                                    <div className={styles.content}>
                                        <p
                                            className={styles.contentName}
                                            data-select-name
                                            style={{ color: 'white' }}
                                        >
                                            <Highlighter
                                                search={search}
                                                text={user.username}
                                                highlightClass={styles.highlight}
                                            />
                                        </p>
                                    </div>
                                )}
                            />
                        </div>
                        <div className={styles.item}>
                            <div className={styles.row}>
                                <div className={styles.col}>
                                    <PopupSubtitle
                                        text="Bounty/Payout"
                                        className={styles.mSuptitle}
                                    />
                                    <Input
                                        value={bounty}
                                        className={styles.mInput}
                                        placeholder={
                                            !currency.balance
                                                ? '$amount'
                                                : currency.balance.slice(0, 4)
                                        }
                                        onChange={setBounty}
                                    />
                                </div>
                                <div className={styles.col}>
                                    <PopupSubtitle text="Currency" className={styles.mSuptitle} />
                                    <Select
                                        value={currency}
                                        options={currencyList
                                            .map((item) => ({ ...item, value: item.currency }))
                                            .filter((i) => i.currency !== currency.currency)}
                                        onChange={(value) => setCurrency(value as IPaymentCurrency)}
                                        isSearchable={false}
                                        className={styles.currency}
                                        classNamePrefix="rs"
                                        formatOptionLabel={({ currency }: IPaymentCurrency) => (
                                            <div className={styles.currencyName}>{currency}</div>
                                        )}
                                        styles={paymentsSelectStyles}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button
                            data-analytics-click="new_payment_created"
                            className={styles.submitBtn}
                            disabled={!allowButton}
                            type="submit"
                            color="orange"
                        >
                            <span>Pay</span>
                        </Button>
                    </form>
                </Popup>
            ) : (
                <Popup className={styles.root} onClose={onClose}>
                    <PopupTitle icon="/img/icons/wallet.png" title="Done" />
                    <div className={styles.center}>
                        <Complete />
                        <p className={styles.sent}>
                            The payment has been <span>sent</span>
                        </p>
                    </div>
                    <Button
                        color="green"
                        onClick={onClose}
                        className={clsx(styles.submitBtn, styles.submitBtnComplete)}
                    >
                        <span>Complete</span>
                    </Button>
                </Popup>
            )}
        </React.Fragment>
    );
};

export default AddPayment;
