import Sprite from 'components/sprite';
import css from './onboarding.module.scss';
import ConnectWalletComp from './ConnectWalletComp';

const ConnectWallet: React.FC = () => {
    return (
        <div className={css.root} data-analytics-page="connect_wallet_page">
            <div className={css.wrapper} data-analytics-parent="connect_wallet_parent">
                <div className={css.logos}>
                    <img src="/img/graphic.png" alt="logo" />
                </div>

                <a className={css.home_link} href="/" target="_blank">
                    <img src={require('images/logo.png')} alt="logo" />

                    <Sprite url="/img/sprite.svg#samudai" />
                </a>

                <div className={css.connect_modal}>
                    <ConnectWalletComp />
                </div>
            </div>
        </div>
    );
};

export default ConnectWallet;
