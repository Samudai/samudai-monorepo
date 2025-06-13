import { useEffect, useState } from 'react';
// import data from './data';
import { NFTProfile } from '@samudai_xyz/web3-sdk';
import clsx from 'clsx';
import { changeProfilePicture, selectAccount, selectProvider } from 'store/features/common/slice';
import { useUploadProfilePicMutation } from 'store/services/Login/login';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { SignUpStateGetSet } from 'pages/sign-up/types';
import Modal from 'components/@signup/Modal/Modal';
import { ControlButton, ModalTitle } from 'components/@signup/elements';
import BackButton from 'components/@signup/elements/BackButton/BackButton';
import './SetupOpensea.scss';

interface DataTemp {
    id: number;
    img: string;
}

type SetupOpenseaProps = SignUpStateGetSet & {
    active: boolean;
    onClose: () => void;
};

const SetupOpensea: React.FC<SetupOpenseaProps> = ({ state, active, onClose, setState }) => {
    interface IData {
        id: number;
        img: string;
    }
    const provider = useTypedSelector(selectProvider);
    const account = useTypedSelector(selectAccount);
    const [data, setData] = useState<IData[]>([]);
    // const [sdk, setSdk] = useState<NFTProfile>();

    const dispatch = useTypedDispatch();
    const [uploadProfilePic] = useUploadProfilePicMutation();

    const sdkInitialize = async () => {
        const chainId: number = await provider!.getNetwork().then((network) => network.chainId);
        const sdk = new NFTProfile(chainId);
        const res: any = await sdk?.getNFTProfilePPs(account!);
        const output = res.ownedNfts.map((val: any) => {
            return {
                id: Number(val.tokenId),
                img: val.rawMetadata.image,
            };
        });
        console.log(output);
        setData(output);
    };

    useEffect(() => {
        sdkInitialize();
    }, []);

    const [selected, setSelected] = useState<IData | null>(null);

    const onToggleSelected = (item: IData) => {
        if (item.id === selected?.id) {
            setSelected(null);
            return;
        }
        console.log(item);
        setSelected(item);
    };

    const onSetImage = ({ img: item }: IData) => {
        setState((prev) => ({ ...prev, img: item }));
        console.log(state.img);

        try {
            const localData = localStorage.getItem('signUp');
            const member_id =
                JSON.parse(localData!) && JSON.parse(localStorage.getItem('signUp')!).member_id;
            const formData = new FormData(); //formdata object
            formData.append('file', '');
            formData.append('memberId', member_id);
            formData.append('typeOfProfilePicture', '1');
            formData.append('nftProfileLink', item);
            console.log('NFT', state.img as string);
            uploadProfilePic(formData)
                .unwrap()
                .then((res) => {
                    console.log(res);
                    dispatch(changeProfilePicture({ profilePicture: res.data }));
                    onClose();
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (err) {
            console.log(err);
        }
    };

    return active ? (
        <Modal className="setup-opensea">
            <div className="setup-opensea__header">
                <BackButton className="setup-opensea__back" onClick={onClose} />
            </div>
            <ModalTitle
                icon={require('components/@signup/icons/Opensea.png')}
                suptitle=""
                title="Use NFT OpenSea"
            />
            <div className="setup-opensea__nfts">
                <ul className="setup-opensea__list">
                    {data?.map((item, id) => (
                        <li
                            className={clsx(
                                'setup-opensea__item',
                                selected?.id === item.id && '--selected'
                            )}
                            key={id}
                            onClick={() => onToggleSelected(item)}
                        >
                            <div className="setup-opensea__img-wrapper">
                                <div className="setup-opensea__img">
                                    <img src={item.img} alt="img" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="modal-controls setup-opensea__controls">
                <ControlButton
                    title="Use"
                    disabled={selected === null}
                    onClick={() => selected && onSetImage(selected)}
                />
            </div>
        </Modal>
    ) : null;
};

export default SetupOpensea;
