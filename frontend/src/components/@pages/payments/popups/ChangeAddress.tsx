import React, { useState } from 'react';
import Select from 'react-select';
import Popup from '../../../@popups/components/Popup/Popup';
import PopupTitle from '../../../@popups/components/PopupTitle/PopupTitle';
import { ProviderDetails } from '../model/model';
import {
    GnosisChainValues,
    IChainList,
    IProviderList,
    ParcelChainValues,
    providerValues,
} from '../utils/providerConstants';
import { paymentsSelectStyles } from '../utils/selectStyles';
import { Gnosis } from '@samudai_xyz/web3-sdk';
import { selectProvider } from 'store/features/common/slice';
import { useUpdateProviderMutation } from 'store/services/payments/payments';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import MarkIcon from 'ui/SVG/MarkIcon';
import PaymentsCustomControl from '../PaymentsCustomControl';
import '../styles/AddProvider.scss';

export interface ChangeAddressProps {
    onClose?: () => void;
    selectedProvider: ProviderDetails;
    is_default: boolean;
}

const ChangeAddress: React.FC<ChangeAddressProps> = ({ selectedProvider, onClose, is_default }) => {
    // const ChainValues = useTypedSelector(chainList);
    // const activeData = useTypedSelector(selectActiveDao);
    const [updateProvider] = useUpdateProviderMutation();

    const providerEth = useTypedSelector(selectProvider);
    const [provider, setProvider] = useState<IProviderList>(providerValues[0]);
    const [chain, setChain] = useState<IChainList>(
        GnosisChainValues.find((c) => c.chain_id === selectedProvider.chain_id) ||
            GnosisChainValues[0]
    );
    const [complete, setComplete] = useState<boolean>(false);
    const [address, setAddress, addressValue] = useInput(selectedProvider.address);
    const [name, setName, nameValue] = useInput(selectedProvider.name);
    const [addDisable, setAddDisable] = useState<boolean>(true);

    const handleChangeChain = (chain: IChainList) => {
        setChain(chain);
    };

    const getSelectedProviderChain = (): IChainList => {
        if (selectedProvider.provider_type === 'gnosis') {
            return GnosisChainValues.filter(
                (item) =>
                    provider.value === selectedProvider.provider_type &&
                    selectedProvider.chain_id === item.chain_id
            )[0];
        } else if (selectedProvider.provider_type === 'parcel') {
            return ParcelChainValues.filter(
                (item) =>
                    provider.value === selectedProvider.provider_type &&
                    selectedProvider.chain_id === item.chain_id
            )[0];
        } else {
            return GnosisChainValues[0];
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (addressValue) {
            if (!!providerEth && provider.value === 'gnosis') {
                const gnosis = new Gnosis(providerEth, chain.chain_id);
                const result = await gnosis.verifySafe(addressValue);
                if (result) {
                    updateProvider({
                        provider: {
                            name: name,
                            id: selectedProvider!.id,
                            address: address,
                            updated_at: new Date().toISOString(),
                            chain_id: chain.chain_id,
                            is_default: is_default,
                        },
                    })
                        .unwrap()
                        .then(() => setComplete(true))
                        .catch((err) => console.log(err));
                }
            } else {
                updateProvider({
                    provider: {
                        name: name,
                        id: selectedProvider!.id,
                        address: address,
                        updated_at: new Date().toISOString(),
                        chain_id: chain.chain_id,
                        is_default: is_default,
                    },
                })
                    .unwrap()
                    .then(() => setComplete(true))
                    .catch((err) => console.log(err));
            }
        }
    };
    // useEffect(() => {
    //   setChain(ChainValues[0]);
    // }, [activeData]); //TODO add ChainValues

    return (
        <React.Fragment>
            {!complete ? (
                <Popup className="add-payments" dataParentId="change_address_modal">
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/magnifier.png"
                        title={
                            <>
                                <strong>Change</strong> Address
                            </>
                        }
                    />
                    <form className="add-payments__form" onSubmit={handleSubmit}>
                        <Input
                            data-analytics-click="provider_name_input"
                            className="add-payments__address"
                            value={name}
                            title="Name"
                            placeholder="Type the name of the provider..."
                            name="address"
                            onChange={setName}
                            autoComplete="off"
                        />
                        <Input
                            data-analytics-click="address_input"
                            className="add-payments__address"
                            value={address}
                            title="Address"
                            placeholder="Type your address..."
                            name="address"
                            onChange={setAddress}
                            autoComplete="off"
                        />
                        <Select
                            data-analytics-click="select_wallet_dropdown"
                            className="add-payments__select-wallet"
                            value={chain}
                            options={(provider.value === 'gnosis'
                                ? GnosisChainValues
                                : ParcelChainValues
                            ).filter((i) => i.id !== chain.id)}
                            classNamePrefix="rs"
                            styles={paymentsSelectStyles}
                            formatOptionLabel={PaymentsCustomControl}
                            isSearchable={false}
                            defaultValue={getSelectedProviderChain()}
                            onChange={(value) => setChain(value as IChainList)}
                        />
                        <Button
                            className="add-payments__submit"
                            type="submit"
                            data-analytics-click="add_button"
                        >
                            <span>Add</span>
                        </Button>
                    </form>
                </Popup>
            ) : (
                <Popup className="add-payments add-payments_complete">
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

export default ChangeAddress;
