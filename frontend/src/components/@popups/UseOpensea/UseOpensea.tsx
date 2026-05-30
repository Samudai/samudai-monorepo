import { useEffect, useState } from 'react';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { NFTProfile } from '@samudai_xyz/web3-sdk';
import clsx from 'clsx';
import { selectAccount, selectProvider } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import styles from './UseOpensea.module.scss';

interface IData {
    id: number;
    img: string;
}

interface UseOpenseaProps {
    handleNFT: (file: string) => void;
    onClose: () => void;
}

const UseOpensea: React.FC<UseOpenseaProps> = ({ handleNFT, onClose }) => {
    const provider = useTypedSelector(selectProvider);
    const account = useTypedSelector(selectAccount);

    const [data, setData] = useState<IData[]>([]);
    const [selected, setSelected] = useState<IData | null>(null);

    const onToggleSelected = (item: IData) => {
        if (item.id === selected?.id) {
            setSelected(null);
            return;
        }
        console.log(item);
        setSelected(item);
    };

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

    return (
        <Popup className={styles.root}>
            <PopupTitle icon="/img/socials/opensea.svg" title="Use NFT OpenSea" />
            <div className={styles.nfts}>
                <ul className={clsx(styles.nftsList, 'orange-scrollbar')}>
                    {data?.map((nft) => (
                        <li
                            className={styles.nftsItem}
                            key={nft.id}
                            data-active={nft.id === selected?.id}
                            onClick={() => onToggleSelected(nft)}
                        >
                            <div className={styles.nftsWrapper}>
                                <div className={styles.nftsImg}>
                                    <img src={nft.img} alt="nft" style={{ borderRadius: '50%' }} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Button
                color="orange"
                className={styles.useBtn}
                onClick={async () => {
                    selected && handleNFT(selected.img.toString());

                    onClose();
                }}
            >
                <span>Use</span>
            </Button>
        </Popup>
    );
};

export default UseOpensea;
