import React, { useEffect, useState } from 'react';
import {
    changeContributorProgress,
    selectActiveDao,
    selectContributorProgress,
} from 'store/features/common/slice';
import {
    useGenerateOtpMutation,
    useDeleteTelegramMutation,
    useLazyGetTelegramExistsQuery,
} from 'store/services/Settings/settings';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import ConnectIcon from 'ui/SVG/ConnectIcon';
import DisconnectIcon from 'ui/SVG/DisconnectIcon';
import styles from './styles/IntegrationsConnectItem.module.scss';
import { getMemberId } from 'utils/utils';
import css from './styles/TelegramIntegration.module.scss';
import QRCode from 'react-qr-code';
import Button from 'ui/@buttons/Button/Button';
import CopyIcon from 'ui/SVG/CopyIcon';
import { toast } from 'utils/toast';
import OTPInput from 'ui/@form/OTPInput/OTPInput';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { useUpdateContributorProgressMutation } from 'store/services/userProfile/userProfile';

enum PopupPage {
    GENERATE_LINK = 'generate_link',
    GENERATE_OTP = 'generate_otp',
}

interface IntegrationsConnectItemProps {
    icon: string;
    name: string;
    isConnected?: boolean;
    contentModal?: React.ReactNode;
    value: string;
    contributor?: boolean;
}

const TelegramIntegration: React.FC<IntegrationsConnectItemProps> = ({
    icon,
    name,
    contentModal,
    isConnected,
    value,
    contributor,
}) => {
    const [page, setPage] = useState<PopupPage>(PopupPage.GENERATE_LINK);
    const [otp, setOtp] = useState('');
    const [isConnectedState, setIsConnectedState] = useState(isConnected);
    const connectModal = usePopup();
    const memberId = getMemberId();
    const activeDAO = useTypedSelector(selectActiveDao);
    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const dispatch = useTypedDispatch();

    const [updateContributorProgress] = useUpdateContributorProgressMutation();
    const [generateOtp] = useGenerateOtpMutation();
    const [deleteTelegram] = useDeleteTelegramMutation();
    const [getTelegramExists] = useLazyGetTelegramExistsQuery();

    const telegram_link = process.env.REACT_APP_TELEGRAM_BOT_LINK || '';

    console.log(process.env.REACT_APP_TELEGRAM_BOT_LINK);

    useEffect(() => {
        setIsConnectedState(!!isConnected);
    }, [isConnected]);

    const handleCopy = (text: string, type: 'link' | 'otp') => {
        navigator.clipboard.writeText(text);
        return toast(
            'Success',
            2000,
            type === 'link' ? 'Telegram Link Copied' : 'OTP Copied',
            ''
        )();
    };

    const handleConnect = async () => {
        if (isConnectedState) {
            deleteTelegram(memberId)
                .unwrap()
                .then((res) => {
                    console.log(res);
                    toast('Success', 2000, 'Telegram Successfully Disconnected', '')();
                    setIsConnectedState(false);
                });
        } else {
            setPage(PopupPage.GENERATE_LINK);
            connectModal.open();
        }
    };

    const handleGenerateOtp = async () => {
        try {
            generateOtp({ memberId })
                .unwrap()
                .then((res) => {
                    setOtp(res.data.generatedOtp);
                    setPage(PopupPage.GENERATE_OTP);
                });
        } catch (err) {
            console.log(err);
            toast('Failure', 2000, 'Failed to generate otp', '');
        }
    };

    const handleVerify = async () => {
        try {
            getTelegramExists(memberId)
                .unwrap()
                .then((res) => {
                    console.log(res.data);
                    if (res.data.exist) {
                        setIsConnectedState(true);
                        toast('Success', 2000, 'Telegram Successfully Connected', '')();
                        connectModal.close();
                        if (!currContributorProgress.connect_telegram)
                            updateContributorProgress({
                                memberId: getMemberId(),
                                itemId: [ActivityEnums.NewContributorItems.CONNECT_TELEGRAM],
                            }).then(() => {
                                dispatch(
                                    changeContributorProgress({
                                        contributorProgress: {
                                            ...currContributorProgress,
                                            connect_telegram: true,
                                        },
                                    })
                                );
                            });
                    } else {
                        toast(
                            'Failure',
                            2000,
                            'Bot is unable to get your otp.. Try sending it again!',
                            ''
                        )();
                    }
                });
        } catch (err) {
            console.log(err);
            toast('Failure', 2000, 'Failed to verify telegram', '');
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.icon}>
                    <img src={icon} alt="icon" />
                </div>
                <p className={styles.name}>{name}</p>
                <div className={styles.right}>
                    {!!isConnectedState && <p className={styles.username}>{value}</p>}
                    <button className={styles.connectBtn} onClick={handleConnect}>
                        {isConnectedState ? <DisconnectIcon /> : <ConnectIcon />}
                        <span>{isConnectedState ? 'Disconnect' : 'Connect'}</span>
                    </button>
                </div>
            </div>
            <PopupBox active={connectModal.active} onClose={connectModal.close}>
                <Popup className={css.popup}>
                    <div className={css.container}>
                        <img className={css.img} src={icon} alt="icon" />
                        <div className={css.title}>Connect Telegram</div>
                        {page === PopupPage.GENERATE_LINK && (
                            <>
                                <span className={css.sub_title}>
                                    This link will take you to Telegram and Install the Samudai Bot.
                                </span>
                                <div className={css.qr_container}>
                                    <QRCode value={telegram_link} className={css.qr} />
                                </div>
                                <div className={css.text_container}>
                                    <span>or try this link</span>
                                    <div className={css.copy_text}>
                                        <span onClick={() => window.open(telegram_link, '_blank')}>
                                            {telegram_link}
                                        </span>
                                        {/* <div className={css.copy_text_seperate} />
                                        <CopyIcon onClick={() => handleCopy(telegram_link, 'link')} /> */}
                                    </div>
                                </div>
                                <Button
                                    className={css.btn}
                                    color="orange"
                                    onClick={handleGenerateOtp}
                                >
                                    Generate OTP
                                </Button>
                            </>
                        )}
                        {page === PopupPage.GENERATE_OTP && (
                            <>
                                <span className={css.sub_title}>
                                    Enter the OTP in the chat with Samudai Bot.
                                </span>
                                <div className={css.otp_container}>
                                    <OTPInput length={6} value={otp} disabled />
                                    <div className={css.copy_otp}>
                                        <CopyIcon onClick={() => handleCopy(otp, 'otp')} />
                                    </div>
                                </div>
                                <Button className={css.btn} color="orange" onClick={handleVerify}>
                                    Verify
                                </Button>
                            </>
                        )}
                    </div>
                </Popup>
            </PopupBox>
        </div>
    );
};

export default TelegramIntegration;
