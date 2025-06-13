import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { IProviderList, providerValues } from '../utils/providerConstants';
import { paymentsSelectStyles } from '../utils/selectStyles';
import { Auth } from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisTypes } from '@samudai_xyz/web3-sdk';
import { selectProvider } from 'store/features/common/slice';
import { useGetParcelSafesMutation } from 'store/services/payments/payments';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import MarkIcon from 'ui/SVG/MarkIcon';
import { parcelSign } from 'utils/parcelUtils';
import { toast } from 'utils/toast';
import PaymentsCustomControl from '../PaymentsCustomControl';
import '../styles/AddProvider.scss';
import { usePayments } from 'utils/payments/use-payments';
import { providerList } from 'store/features/payments/paymentsSlice';
import { ethers } from 'ethers';

export interface AddProviderProps {
    onClose?: () => void;
}

const AddProvider: React.FC<AddProviderProps> = ({ onClose }) => {
    const [provider, setProvider] = useState<IProviderList>(providerValues[0]);
    const [complete, setComplete] = useState<boolean>(false);
    const [addressValue, setAddressValue] = useState<{ label: string; value: string } | undefined>(
        undefined
    );
    const [name, setName, nameValue] = useInput('');
    const [chainId, setChainId] = useState<number | null>(null);
    const [safes, setSafes] = useState<{ label: string; value: string }[]>([]);
    const [btnLoading, setBtnLoading] = useState(false);

    const providers = useTypedSelector(providerList);
    const providerEth = useTypedSelector(selectProvider);

    const { handleAddProvider } = usePayments();
    const [getParcelSafes] = useGetParcelSafesMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!addressValue?.value || !nameValue || !chainId) {
            toast('Failure', 5000, 'Input Field cannot be empty', '')();
            return;
        }
        if (addressValue.value && !!providerEth && provider.value) {
            setBtnLoading(true);
            try {
                const res = await handleAddProvider({
                    provider_type: provider.value,
                    chain_id: chainId!,
                    address: addressValue.value,
                    name: nameValue.trim(),
                });
                setComplete(true);
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            } finally {
                setBtnLoading(false);
            }
        }
    };

    useEffect(() => {
        // getSafes();
        setAddressValue(undefined);
        setSafes([]);
        const funGnosis = async () => {
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId === '0x1') {
                const chainId: number = await providerEth!
                    .getNetwork()
                    .then((network) => network.chainId);
                setChainId(chainId);
                const sdk = new Gnosis(providerEth!, chainId);
                const signer = providerEth?.getSigner();
                const address = await signer?.getAddress();
                const res = (await sdk?.connectGnosis(address!)) as GnosisTypes.UserSafe[];
                setSafes(
                    res
                        .filter(
                            (safe) =>
                                !providers.some((provider) => provider.address === safe.safeAddress)
                        )
                        .map((safe) => ({
                            label: safe.safeAddress,
                            value: safe.safeAddress,
                        }))
                );
                console.log(res);
            } else {
                await window.ethereum!.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(1) }],
                });
                return;
            }
        };

        const funParcel = async () => {
            const auth: Auth = await parcelSign(providerEth!);
            const res = await getParcelSafes({ auth, chainId: chainId! }).unwrap();
            setSafes(
                res?.data?.safes.map((safe) => ({
                    label: safe.safeAddress,
                    value: safe.safeAddress,
                })) || [{ label: '', value: '' }]
            );
        };
        provider.name === 'gnosis' ? funGnosis() : funParcel();
    }, [provider.name, providerEth]);

    return (
        <React.Fragment>
            {!complete ? (
                <Popup className="add-payments" dataParentId="add_provider_modal" onClose={onClose}>
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/magnifier.png"
                        title={
                            <>
                                <strong>Add</strong> Provider
                            </>
                        }
                    />
                    <form className="add-payments__form" onSubmit={handleSubmit}>
                        <Select
                            data-analytics-click="provider_select"
                            className="add-payments__provider-select"
                            defaultValue={providerValues[0]}
                            formatOptionLabel={PaymentsCustomControl}
                            isSearchable={false}
                            styles={paymentsSelectStyles}
                            options={providerValues}
                            value={provider}
                            onChange={(value) => setProvider(value as IProviderList)}
                        />
                        <Input
                            className="add-payments__address"
                            data-analytics-click="provider_name_input"
                            value={name}
                            title="Name"
                            placeholder="Type the name of the provider..."
                            name="address"
                            onChange={setName}
                            autoComplete="off"
                        />
                        <Select
                            className="add-payments__provider-select"
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
                        {/* <Input
              className="add-payments__address"
              value={address}
              title="Address"
              placeholder="Type your address..."
              name="address"
              onChange={setAddress}
              autoComplete="off"
            /> */}
                        {/* <PopupSubtitle text="Chain" className="add-payments__chain-subtitle" />
            <Select
              formatOptionLabel={PaymentsCustomControl}
              isSearchable={false}
              styles={paymentsSelectStyles}
              options={(provider.name === 'gnosis'
                ? GnosisChainValues
                : ParcelChainValues
              ).filter((i) => i.id !== chain.id)}
              value={chain}
              onChange={(value) => setChain(value as IChainList)}
            /> */}
                        <Button
                            className="add-payments__submit"
                            type="submit"
                            data-analytics-click="add_provider_button"
                            disabled={btnLoading}
                        >
                            <span>Add</span>
                        </Button>
                    </form>
                </Popup>
            ) : (
                <Popup className="add-payments add-payments_complete" onClose={onClose}>
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Done'}
                    />
                    <div className="add-payments__mark">
                        <MarkIcon />
                    </div>
                    <p className="add-payments__thx">
                        Thank you, <strong>{provider.value}</strong> provider added
                    </p>
                    <Button className="add-payments__complete-btn" color="green" onClick={onClose}>
                        <span>Close</span>
                    </Button>
                </Popup>
            )}
        </React.Fragment>
    );
};

export default AddProvider;
