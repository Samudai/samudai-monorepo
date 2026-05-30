import React from 'react';
import Board from '../board/board';
import styles from './connect-wallet.module.scss';

interface ConnectWalletProps {
    onNext: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onNext }) => {
    return (
        <Board icon="/img/icons/wallet.png" title="Connect to Wallet">
            <div className={styles.wallet_list}>
                <button className={styles.wallet_item} onClick={onNext}>
                    <img src="/img/icons/eth.svg" alt="ethereum" />
                    <span>Ethereum</span>
                </button>
                <button className={styles.wallet_item} onClick={onNext}>
                    <img src="/img/icons/polygon.svg" alt="polygon" />
                    <span>Polygon</span>
                </button>
                <button className={styles.wallet_item} onClick={onNext}>
                    <img src="/img/icons/solana.svg" alt="solana" />
                    <span>Solana</span>
                </button>
            </div>
        </Board>
    );
};

export default ConnectWallet;
