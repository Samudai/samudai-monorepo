import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import { Auth, Provider } from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisFetch, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { selectStyles } from 'root/constants/selectStyles1';
import { selectProvider } from 'store/features/common/slice';
import { useGetParcelBalanceMutation, useGetProviderQuery } from 'store/services/payments/payments';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { parcelSign } from 'utils/parcelUtils';
import { toast } from 'utils/toast';
import { IPaymentCurrency } from 'utils/types/Payments';
import styles from './TaskAdd.module.scss';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

// interface IMember {
//   member_id: string;
//   profile_picture: string | null;
//   username: string;
//   name: string;
//   default_wallet_address?: string;
// }
interface IProviderList {
    id: string;
    provider: Provider;
    receiver_address: string;
    payout_amount: number;
    payout_currency: string;
    safe_address: string;
    token_address: string;
    user: IMember;
}

interface props {
    personal?: boolean;
    contributors: IMember[];
    providerList: IProviderList[];
    setProviderList: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                provider: Provider;
                receiver_address: string;
                payout_amount: number;
                payout_currency: string;
                safe_address: string;
                token_address: string;
                user: IMember;
            }[]
        >
    >;
}

const Bounty: React.FC<props> = ({ personal, contributors, providerList, setProviderList }) => {
    const { daoid } = useParams();
    const providerEth = useTypedSelector(selectProvider);
    const [activeProvider, setActiveProvider] = useState<Provider>({} as Provider);
    const [options, setOptions] = useState<Provider[]>([] as Provider[]);
    const [bounty, setBounty, _, clearBounty] = useInput('');
    const [balance, setBalance] = useState<string>('');
    const { data: providerData, isSuccess } = useGetProviderQuery(daoid!);
    const [currency, setCurrency] = useState<IPaymentCurrency>({} as IPaymentCurrency);
    const [currencyList, setCurrencyList] = useState<IPaymentCurrency[]>([] as IPaymentCurrency[]);
    const [user, setUser] = useState<IMember>({} as IMember);

    const [tokenType, setTokenType] = useState<string>('');
    const [tokenAddress, setTokenAddress] = useState<string>('');
    const [getParcelBalance] = useGetParcelBalanceMutation();
    const [sdkVale, setSdkValue] = useState<Gnosis | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const onClickProvider = (provider: Provider) => {
        setActiveProvider(provider);
    };
    const onClickContributor = (member: IMember) => {
        setUser(member);
    };

    const handleAddProvider = () => {
        if (!activeProvider.name) return toast('Failure', 5000, 'Please select a provider', '')();
        if (!bounty) return toast('Failure', 5000, 'Please enter a bounty amount', '')();
        if (isNaN(Number(bounty)))
            return toast('Failure', 5000, 'Please enter a valid bounty amount', '')();
        // if (!!balance && Number(bounty) > Number(balance))
        //   return toast('Failure', 5000, 'Insufficient balance', '')();
        // if (Number(bounty) > Number(balance)) {
        //   toast('Failure', 5000, 'Insufficient Balance', 'Bounty amount is more than the safe balance')()
        //   return;}
        setProviderList([
            ...providerList,
            {
                id: uuidv4(),
                receiver_address: '',
                provider: activeProvider,
                payout_amount: Number(bounty),
                payout_currency: currency?.symbol || '',
                safe_address: activeProvider.address,
                token_address: currency.token_address,
                user,
            },
        ]);
        clearBounty();
        setBalance('');
        setTokenType('');
        setTokenAddress('');
    };

    const filteredOptions = () => {
        if (providerList.length === 0) return providerData?.data?.data;
        const option1 = providerData?.data?.data.filter(
            (item) => item.name === providerList[0].provider.name
        );
        const selected = providerList.map((item) => item.provider.name);
        return option1?.filter((item) => !selected.includes(item.name));
    };

    useEffect(() => {
        // const opt = filteredOptions();
        setOptions(providerData?.data?.data || []);
    }, [activeProvider.id, providerList.length, providerData]);

    useEffect(() => {
        if (activeProvider.provider_type !== 'wallet') {
            const gnosis = new GnosisFetch(activeProvider.address!, activeProvider.chain_id!);
            gnosis.getSafeBalance().then((res) => {
                const balance = res as GnosisTypes.SafeBalanceUsdResponse[];
                setBalance(
                    ethers.utils
                        .formatEther(balance?.[0]?.balance)
                        .toString()
                        .slice(0, 6)
                );
                setTokenType(balance?.[0]?.token?.symbol || 'ETH');
                setTokenAddress(balance?.[0]?.tokenAddress);
            });
        } else {
            setBalance('');
            setTokenType('');
            setTokenAddress('');
        }
    }, [activeProvider.id, daoid]);

    useEffect(() => {
        const getCurrency = async () => {
            const provider = activeProvider;
            setCurrency({} as IPaymentCurrency);
            setCurrencyList([] as IPaymentCurrency[]);
            let value;
            const currencyVal: IPaymentCurrency[] = [];
            if (provider.provider_type === 'gnosis') {
                if (!!providerEth && !!provider.chain_id) {
                    value = new Gnosis(providerEth, provider.chain_id);
                    const res = (await value.getSafeBalance(
                        provider.address!
                    )) as GnosisTypes.SafeBalanceUsdResponse[];
                    console.log('here:', res);
                    if (res.length > 0) {
                        res.forEach((item: GnosisTypes.SafeBalanceUsdResponse, id: number) => {
                            currencyVal.push({
                                currency: item.token
                                    ? item.token.name
                                    : activeProvider.chain_id === 1 || activeProvider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                symbol: item.token
                                    ? item.token.name
                                    : activeProvider.chain_id === 1 || activeProvider.chain_id === 5
                                    ? 'ETH'
                                    : 'MATIC',
                                balance: item.balance,
                                token_address: item.tokenAddress,
                                name: item.token
                                    ? item.token.name
                                    : activeProvider.chain_id === 1 || activeProvider.chain_id === 5
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
            } else if (provider.provider_type === 'parcel') {
                if (provider.chain_id) {
                    setCurrency({} as IPaymentCurrency);
                    setCurrencyList([] as IPaymentCurrency[]);
                    const auth: Auth = await parcelSign(providerEth!);
                    const payload = {
                        auth,
                        chainId: provider.chain_id,
                        safeAddress: provider.address,
                    };
                    getParcelBalance(payload)
                        .unwrap()
                        .then((res) => {
                            if (
                                (res?.data?.balances as GnosisTypes.SafeBalanceUsdResponse[])
                                    .length > 0
                            ) {
                                res.data?.balances.forEach(
                                    (item: GnosisTypes.SafeBalanceUsdResponse) => {
                                        currencyVal.push({
                                            currency: item.token
                                                ? item.token.name
                                                : activeProvider.chain_id === 1 ||
                                                  activeProvider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            symbol: item.token
                                                ? item.token.name
                                                : activeProvider.chain_id === 1 ||
                                                  activeProvider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            balance: item.balance,
                                            token_address: item.tokenAddress,
                                            name: item.token
                                                ? item.token.name
                                                : activeProvider.chain_id === 1 ||
                                                  activeProvider.chain_id === 5
                                                ? 'ETH'
                                                : 'MATIC',
                                            decimal: item.token ? item.token.decimals : 0,
                                            logo_uri: item.token ? item.token.logoUri : '',
                                        });
                                    }
                                );
                                setCurrency(currencyVal[0]);
                                setCurrencyList(currencyVal);
                            }
                        });
                }
            } else if (provider.provider_type === 'wallet') {
                console.log(providerEth?._network.name);
            }

            if (value) setSdkValue(value);
        };
        getCurrency();
    }, [activeProvider.id, daoid]);

    const handleDelete = (id: string) => () => {
        setProviderList(providerList.filter((item) => item.id !== id));
    };

    const renderList = () => {
        return providerList.map((item) => {
            const displayName = `${item.provider.provider_type} - ${item.provider.name}`;
            return (
                <ul key={item.id} className={styles.row} data-row-second>
                    <li className="members__item" data-role="item" style={{ marginTop: '8px' }}>
                        <img
                            src={item?.user?.profile_picture || '/img/icons/user-4.png'}
                            alt="user"
                        />
                    </li>
                    <li className={styles.col} style={{ width: '200px' }}>
                        <Input title="" value={displayName} disabled />
                    </li>
                    <li className={styles.col} style={{ maxWidth: '120px' }}>
                        <Input
                            title=""
                            value={`${item.payout_amount} ${item.payout_currency}`}
                            disabled
                        />
                    </li>
                    <li>
                        <p className={styles.githubTitle} style={{ marginBottom: '15px' }}>
                            <span></span>
                        </p>
                        <img
                            src="/img/icons/delete.png"
                            alt="delete"
                            onClick={handleDelete(item.id)}
                            style={{
                                cursor: 'pointer',
                                maxWidth: '30px',
                                maxHeight: '30px',
                                width: 'auto',
                                height: 'auto',
                            }}
                        />
                    </li>
                </ul>
            );
        });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PopupSubtitle className={styles.providerSubtitle} text={'Add Bounties'} />
                <div style={{ marginTop: '20px' }}>
                    <Button color="green" onClick={() => setShow(!show)}>
                        {show ? 'Cancel' : 'Add'}
                    </Button>
                </div>
            </div>

            {!personal && show && (
                <>
                    <ul className={styles.bountyRow}>
                        <li className={styles.bountyCol1}>
                            <PopupSubtitle
                                className={styles.providerSubtitle}
                                text="Select Contributor"
                            />
                            <ReactSelect
                                className={styles.selectProvider}
                                value={user}
                                classNamePrefix="rs"
                                isSearchable={false}
                                styles={selectStyles}
                                options={(contributors || []).map((pr) => ({
                                    ...pr,
                                    value: pr.name,
                                }))}
                                onChange={(pr) => onClickContributor(pr)}
                                formatOptionLabel={({ name }) => (
                                    <p className={styles.selectValue}>{name}</p>
                                )}
                            />
                        </li>
                        <li className={styles.bountyCol1}>
                            <PopupSubtitle
                                className={styles.providerSubtitle}
                                text="Select Provider"
                            />
                            <ReactSelect
                                className={styles.selectProvider}
                                value={activeProvider}
                                classNamePrefix="rs"
                                isSearchable={false}
                                styles={selectStyles}
                                options={(options || []).map((pr) => ({ ...pr, value: pr.name }))}
                                onChange={(pr) => onClickProvider(pr)}
                                formatOptionLabel={({ provider_type, name }) => (
                                    <p className={styles.selectValue}>
                                        {provider_type} - {name}
                                    </p>
                                )}
                            />
                        </li>
                    </ul>
                    <ul className={styles.bountyRow}>
                        <li className={styles.bountyCol}>
                            <PopupSubtitle className={styles.bountySubtitle} text="Bounty/Payout" />
                            <Input
                                value={bounty}
                                placeholder={balance || 'Amount'}
                                onChange={setBounty}
                            />
                        </li>
                        <li className={styles.bountyCol}>
                            <PopupSubtitle className={styles.bountySubtitle} text="Bounty/Payout" />
                            <ReactSelect
                                value={currency}
                                classNamePrefix="rs"
                                isSearchable={false}
                                styles={selectStyles}
                                options={(currencyList || [])
                                    .filter((val) => val.token_address !== currency.token_address)
                                    .map((cur) => ({ ...cur, value: cur.symbol }))}
                                onChange={(cur) => setCurrency(cur)}
                                formatOptionLabel={({ symbol }) => (
                                    <p className={styles.selectValue}>{symbol}</p>
                                )}
                            />
                        </li>
                    </ul>
                    <Button
                        className={styles.addProviderBtn}
                        color="orange"
                        onClick={handleAddProvider}
                    >
                        <span>Confirm Bounty</span>
                    </Button>
                </>
            )}
            {providerList.length > 0 && (
                <>
                    <PopupSubtitle className={styles.subtitle} text="Added Bounties" />
                    {renderList()}
                </>
            )}
        </>
    );
};

export default Bounty;
