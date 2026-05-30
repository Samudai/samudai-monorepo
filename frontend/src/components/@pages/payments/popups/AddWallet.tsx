import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { paymentsSelectStyles } from '../utils/selectStyles';
import { selectActiveDao } from 'store/features/common/slice';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import MarkIcon from 'ui/SVG/MarkIcon';
import { toast } from 'utils/toast';
import PaymentsCustomControl from '../PaymentsCustomControl';
import '../styles/AddWallet.scss';

const ChainValues: IChainList[] = [
    {
        id: 10,
        network: 'EVM',
        name: 'Ethereum',
        chain_id: 1,
        type: 'mainnet',
        currency: 'ETH',
        value: 'Ethereum',
    },
    {
        id: 11,
        network: 'EVM',
        name: 'Ropsten',
        chain_id: 3,
        type: 'testnet',
        currency: 'ROP',
        value: 'Ropsten',
    },
    {
        id: 12,
        network: 'EVM',
        name: 'Kovan',
        chain_id: 42,
        type: 'testnet',
        currency: 'KOV',
        value: 'Kovan',
    },
    {
        id: 13,
        network: 'EVM',
        name: 'Polygon',
        chain_id: 137,
        type: 'mainnet',
        currency: 'MATIC',
        value: 'Polygon',
    },
    {
        id: 14,
        network: 'EVM',
        name: 'Polygon-Mumbai',
        chain_id: 80001,
        type: 'testnet',
        currency: 'MATIC',
        value: 'Polygon-Mumbai',
    },
    {
        id: 15,
        network: 'SOLANA',
        name: 'Solana',
        chain_id: 20,
        type: 'mainnet',
        currency: 'SOL',
        value: 'Solana',
    },
    {
        id: 16,
        network: 'SOLANA',
        name: 'Solana-Testnet',
        chain_id: 22,
        type: 'testnet',
        currency: 'SOL',
        value: 'Solana-Testnet',
    },
    {
        id: 17,
        network: 'EVM',
        name: 'Goerli',
        chain_id: 5,
        type: 'testnet',
        currency: 'GOR',
        value: 'Goerli',
    },
];
export interface AddWalletProps {
    onClose?: () => void;
    onSubmit?: (wallet: {
        provider_type: string;
        chain_id: number;
        address: string;
        name: string;
    }) => void;
}

interface IChainList {
    id: number;
    network: string;
    name: string;
    chain_id: number;
    type: string;
    currency: string;
    value: string;
}

const AddWallet: React.FC<AddWalletProps> = ({ onSubmit, onClose }) => {
    // const ChainValues = useTypedSelector(chainList);
    const activeData = useTypedSelector(selectActiveDao);
    const [wallet, setWallet] = useState<IChainList>(ChainValues[0]);
    const [complete, setComplete] = useState<boolean>(false);
    const [address, setAddress, addressValue] = useInput('');
    const [name, setName, nameValue] = useInput('');
    const [chain, setChain] = useState<IChainList>(ChainValues[0]);

    const handleChangeProvider = (wallet: IChainList) => {
        // console.log(wallet);
        setChain(wallet);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!addressValue || !nameValue) {
            toast('Failure', 5000, 'Input Field cannot be empty', '')();
            return;
        }

        if (addressValue && onSubmit) {
            onSubmit({
                address: addressValue,
                provider_type: 'wallet',
                chain_id: chain.chain_id,
                name: nameValue.trim(),
            });
            setComplete(true);
        }
    };

    useEffect(() => {
        setChain(ChainValues[0]);
    }, [activeData]); //TODO add ChainValues

    return (
        <React.Fragment>
            {!complete ? (
                <Popup className="add-payments">
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/magnifier.png"
                        title={
                            <>
                                <strong>Add</strong> Wallet
                            </>
                        }
                    />
                    <form className="add-payments__form" onSubmit={handleSubmit}>
                        <Select
                            className="add-payments__select-wallet"
                            value={chain}
                            options={ChainValues.filter((item) => item.id !== chain.id)}
                            classNamePrefix="rs"
                            styles={paymentsSelectStyles}
                            formatOptionLabel={PaymentsCustomControl}
                            isSearchable={false}
                            onChange={(value) => setChain(value as IChainList)}
                        />
                        <Input
                            className="add-payments__address"
                            value={name}
                            title="Name"
                            placeholder="Type the name of the Wallet..."
                            name="address"
                            onChange={setName}
                            autoComplete="off"
                        />
                        <Input
                            className="add-payments__address"
                            value={address}
                            title="Address"
                            placeholder="Type your address..."
                            name="address"
                            onChange={setAddress}
                            autoComplete="off"
                        />
                        <Button className="add-payments__submit" type="submit">
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
                        Thank you, <strong>{chain.name}</strong> Wallet added
                    </p>
                    <Button className="add-payments__complete-btn" color="green" onClick={onClose}>
                        <span>Close</span>
                    </Button>
                </Popup>
            )}
        </React.Fragment>
    );
};

export default AddWallet;
