import React from 'react';
import css from './styles/SetupWallet.module.scss';
import Sprite from 'components/sprite';
import AddProvider from './popups/AddProvider';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';

const SetupWallet: React.FC = () => {
    const addProvider = usePopup();

    return (
        <>
            <button className={css.connectWalletBtn} onClick={addProvider.open}>
                <Sprite url="/img/sprite.svg#wallet" />
                <span>Set Up Wallet</span>
            </button>
            <PopupBox active={addProvider.active} onClose={addProvider.close}>
                <AddProvider onClose={addProvider.close} />
            </PopupBox>
        </>
    );
};

export default SetupWallet;
