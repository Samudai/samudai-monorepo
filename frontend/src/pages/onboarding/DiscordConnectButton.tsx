import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeDiscordData } from 'store/features/Onboarding/slice';
import { useTypedDispatch } from 'hooks/useStore';
import Sprite from 'components/sprite';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { discordOAuth } from 'utils/urls';
import { getMemberId } from 'utils/utils';
import css from './onboarding.module.scss';

interface DiscordConnectButtonProps {
    type?: 'default' | 'new';
}

const DiscordConnectButton: React.FC<DiscordConnectButtonProps> = ({ type = 'default' }) => {
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const memberType = localStorage.getItem('account_type');
    const memberId = getMemberId();

    const handleClick = () => {
        mixpanel.track('connect_discord', {
            step: 'connect_apps',
            member_id: getMemberId(),
            type_of_member: localStorage.account_type,
            timestamp: new Date().toUTCString(),
        });
        const host = encodeURIComponent(window.location.origin + '/discord');
        window.open(discordOAuth(host));
    };

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('discord');
            if (localData) {
                window.location.reload();
                window.location.href = `/signup`;
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('discordGuilds');
            dispatch(changeDiscordData({ discord: JSON.parse(localData!) }));
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
            localStorage.removeItem('discordGuilds');
        };
    }, []);

    return (
        <>
            {type === 'default' ? (
                <button
                    className={css.controls_discordBtn}
                    onClick={handleClick}
                    data-analytics-click="connect_discord_button"
                >
                    <Sprite url="/img/sprite.svg#inline-discord" />
                    <span>Connect Discord</span>
                </button>
            ) : (
                <button
                    className={css.controls_discordBtn_new}
                    onClick={handleClick}
                    data-analytics-click="connect_discord_button"
                >
                    <img src="/img/discord-connect.png" alt="discord-connect" />
                    <span>Connect</span>
                </button>
            )}
        </>
    );
};

export default DiscordConnectButton;
