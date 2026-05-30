import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { selectActiveDao } from 'store/features/common/slice';
import { useAddTokenMutation } from 'store/services/projects/totalProjects';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import styles from 'components/@popups/ProjectCreate/ProjectCreate.module.scss';
import ProjectSelect from 'components/@popups/ProjectImport/elements/ProjectSelect';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { toast } from 'utils/toast';
import { getTokenDetails } from 'utils/web3/getTokenDetails';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
    setDropValues: Dispatch<SetStateAction<dep[]>>;
}

interface dep {
    id: string;
    name: string;
    value?: string;
}

const chains: IChainList[] = [
    {
        id: 10,
        network: 'EVM',
        name: 'Ethereum',
        chain_id: 1,
        type: 'mainnet',
        currency: 'ETH',
        value: 'ethereum',
    },
    {
        id: 13,
        network: 'EVM',
        name: 'Polygon',
        chain_id: 137,
        type: 'mainnet',
        currency: 'MATIC',
        value: 'polygon',
    },
    {
        id: 17,
        network: 'EVM',
        name: 'Goerli',
        chain_id: 5,
        type: 'testnet',
        currency: 'GOR',
        value: 'goerli',
    },
];

interface IChainList {
    id: number;
    network: string;
    name: string;
    chain_id: number;
    type: string;
    currency: string;
    value: string;
}

const AddToken: React.FC<IProps> = ({ onClose, setDropValues }) => {
    const activeDAO = useTypedSelector(selectActiveDao);
    const [load, setLoad] = useState<boolean>(false);

    const [token, setToken] = useState<dep>({} as dep);
    const [lookup, setLookUp] = useState<any>({});
    const [tokenDropDown, setTokenDropDown] = useState<dep[]>([] as dep[]);
    const [title, setTitle] = useInput('');
    const [value, setValue] = useState('');

    const [addToken] = useAddTokenMutation();

    useEffect(() => {
        setTokenDropDown(
            chains.map((chain) => ({ id: chain.value, name: chain.name, value: chain.value }))
        );
        setToken(
            chains.map((chain) => ({
                id: chain.value,
                name: chain.name,
                value: chain.value,
            }))[0]
        );
    }, []);

    const handleLookup = async () => {
        if (!title) return toast('Failure', 5000, 'Please enter a valid address', '')();
        try {
            const res = await getTokenDetails(title, token.value!);
            const val = {
                name: res.symbol!,
                id: res.symbol!,
                add: title,
            };
            setValue(val.name);
            setLookUp(val);

            console.log(res);
        } catch (e: any) {
            toast('Failure', 5000, 'error', e?.message)();
        }
    };
    const handleAdd = async () => {
        if (!lookup.id)
            return toast('Failure', 5000, 'Please lookup the address before adding', '')();
        try {
            await addToken({
                token: {
                    dao_id: activeDAO,
                    average_time_held: 'null',
                    holders: 0,
                    ticker: lookup.name,
                    contract_address: lookup.add,
                },
            }).unwrap();
            setDropValues((prev) => {
                return [...prev, { name: lookup.name, id: lookup.id }];
            });
            onClose();
        } catch (err: any) {
            toast('Failure', 5000, 'Unable to add', err?.message)();
        }
    };
    return (
        <>
            {
                <Popup className={styles.root}>
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Add Token'}
                    />
                    <PopupSubtitle className={styles.subtitle} text="Select Chain" />
                    <ProjectSelect
                        value={token}
                        options={tokenDropDown}
                        onChange={(item) => setToken(item)}
                    />
                    <PopupSubtitle className={styles.subtitle} text="Enter Contract Address" />
                    <Input
                        value={title}
                        className={styles.inputTitle}
                        placeholder="Address..."
                        onChange={setTitle}
                    />
                    {!!lookup.id && (
                        <>
                            <PopupSubtitle className={styles.subtitle} text="Token" />

                            <Input
                                value={value}
                                className={styles.inputTitle}
                                placeholder=""
                                onChange={() => setValue}
                                disabled
                            />
                        </>
                    )}

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            marginTop: '30px',
                        }}
                    >
                        <Button onClick={handleLookup}>LookUp</Button>
                        {!!value && (
                            <Button onClick={handleAdd} color="green">
                                Add Token
                            </Button>
                        )}
                    </div>
                </Popup>
            }
            {load && <Loader />}
        </>
    );
};

export default AddToken;
