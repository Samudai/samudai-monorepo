import React from 'react';
import { DiscordIcons } from '../icons/discord-icons';
import DiscordConnectButton from 'pages/onboarding/DiscordConnectButton';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import css from './connect-discord-modal.module.scss';

interface ConnectDiscordModalProps {
    onClose?: () => void;
}

export const ConnectDiscordModal: React.FC<ConnectDiscordModalProps> = ({ onClose }) => {
    return (
        <Popup className={css.connect} onClose={onClose} dataParentId="connect_discord_modal">
            <PopupTitle icon="/img/discord-connect.png" title="Connect Discord" />

            <p className={css.text}>
                Onboard your DAO and it’s time to unlock the <strong>Future of Work</strong>.
            </p>

            <div className={css.blocks}>
                <DiscordIcons />
            </div>

            <div className={css.btn_container}>
                <DiscordConnectButton />
            </div>
        </Popup>
    );
};
