import Popup from 'components/@popups/components/Popup/Popup';
import css from './LoginModal.module.scss';
import ConnectWalletComp from 'pages/onboarding/ConnectWalletComp';

const LoginModal: React.FC = () => {
    return (
        <Popup className={css.root}>
            {/* <div className={css.connect_title}>LOGIN TO ACCESS</div>
            <div className={css.connect_subtitle}>Login to see the full view</div>
            <LoginComp />
            <div className={css.connect_message}>
                <EyeIcon />
                <span>We will never do anything without your approval.</span>
            </div> */}
            <ConnectWalletComp />
        </Popup>
    );
};

export default LoginModal;
