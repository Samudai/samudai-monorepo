import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccess, selectActiveDao } from 'store/features/common/slice';
import { useDeleteGcalMutation } from 'store/services/Settings/settings';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import ConnectIcon from 'ui/SVG/ConnectIcon';
import DisconnectIcon from 'ui/SVG/DisconnectIcon';
import { gcaldao, gcaluser } from 'utils/gcalUrl';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './styles/IntegrationsConnectItem.module.scss';

interface IntegrationsConnectItemProps {
    icon: string;
    name: string;
    isConnected?: boolean;
    contentModal?: React.ReactNode;
    value: string;
    contributor?: boolean;
}

const GcalIntegration: React.FC<IntegrationsConnectItemProps> = ({
    icon,
    name,
    contentModal,
    isConnected,
    value,
    contributor,
}) => {
    const { active, open, close: handleClose } = usePopup();
    const [isConnectedState, setIsConnectedState] = useState(isConnected);
    const activeDAO = useTypedSelector(selectActiveDao);
    const [deleteGcal] = useDeleteGcalMutation();
    const { daoid } = useParams();
    const access = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);

    useEffect(() => {
        setIsConnectedState(!!isConnected);
    }, [isConnected]);

    useEffect(() => {
        function checkUserData() {
            if (localStorage.getItem('gcal') === 'true' && !contributor) {
                setIsConnectedState(true);
            } else if (localStorage.getItem('gcal-user') === 'true' && contributor) {
                setIsConnectedState(true);
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    const handleConnect = () => {
        if (!isConnectedState) {
            if (!contributor && !access) {
                return toast('Failure', 5000, 'You do not have permission', '')();
            }
            localStorage.setItem('daoId', activeDAO!);
            !contributor && access && window.open(gcaldao(), '_blank');
            contributor && window.open(gcaluser(), '_blank');
        } else {
            deleteGcal(!contributor ? activeDAO! : getMemberId())
                .unwrap()
                .then((res) => {
                    console.log(res);
                    setIsConnectedState(false);
                });
        }
    };

    return (
        <li className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.icon}>
                    <img src={icon} alt="icon" />
                </div>
                <p className={styles.name}>{name}</p>
                <div className={styles.right}>
                    {isConnectedState && <p className={styles.username}>{value}</p>}
                    <button className={styles.connectBtn} onClick={handleConnect}>
                        {isConnectedState ? <DisconnectIcon /> : <ConnectIcon />}
                        <span>{isConnectedState ? 'Disconnect' : 'Connect'}</span>
                    </button>
                </div>
            </div>
            <PopupBox active={active} onClose={handleClose}>
                <Popup className={styles.popup}>
                    {React.isValidElement(contentModal) &&
                        React.cloneElement(contentModal as React.ReactElement<any>, {
                            onCloseModal: handleClose,
                        })}
                </Popup>
            </PopupBox>
        </li>
    );
};

export default GcalIntegration;
