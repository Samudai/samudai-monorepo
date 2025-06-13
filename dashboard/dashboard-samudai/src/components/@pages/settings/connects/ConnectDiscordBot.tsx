import React, { useEffect, useState } from 'react';
//import { Visibility } from '@samudai_xyz/gateway-consumer-types';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import styles from './styles/ConnectSnapshot.module.scss';
import { dropdown } from 'pages/onboarding';
import ReactSelect, { components } from 'react-select';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { selectStyles } from 'root/constants/selectStyles';
import {
    selectSelectedDiscord,
    selectDiscord,
    changeSlectedDiscord,
    changeDiscordData,
} from 'store/features/Onboarding/slice';
import axios from 'axios';
import { getMemberId } from 'utils/utils';
import { selectActiveDao } from 'store/features/common/slice';
import { discordBot } from 'utils/urls';

interface ConnectDiscordBotProps {
    onCloseModal?: () => void;
    callback?: () => void;
}

const ConnectDiscordBot: React.FC<ConnectDiscordBotProps> = ({ onCloseModal, callback }) => {
    const [discordSelected, setDiscordSelected] = useState<dropdown>({} as dropdown);
    const [btnLoading, setBtnLoading] = useState(false);
    const activeDAO = useTypedSelector(selectActiveDao);
    const dSelected = useTypedSelector(selectSelectedDiscord);

    const dispatch = useTypedDispatch();
    let discordData = useTypedSelector(selectDiscord) || [];

    if (discordData?.guildsInfo?.length === 0 && localStorage.getItem('discordGuilds')) {
        discordData = JSON.parse(localStorage.getItem('discordGuilds')!);
    }

    useEffect(() => {
        setBtnLoading(dSelected.isOnboarded);
    }, [dSelected]);

    const handleBotAdd = async () => {
        try {
            localStorage.setItem('discordbot_link_id', activeDAO);
            localStorage.setItem('discordbot_guild_id', discordSelected.value);
            const host = encodeURIComponent(window.location.origin + '/bot');
            window.open(discordBot(host, discordSelected.value));
            onCloseModal?.();
            callback?.();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fun = async () => {
            axios
                .get(`${process.env.REACT_APP_GATEWAY}api/discord/get/guilds/${getMemberId()}`)
                .then((res) => {
                    console.log(res?.data?.data);
                    localStorage.setItem('discordGuilds', JSON.stringify(res?.data?.data));
                    dispatch(changeDiscordData({ discord: res?.data?.data }));
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fun();
    }, []);

    return (
        <React.Fragment>
            <PopupTitle icon="/img/discord-connect.png" title="Connect to Discord Server" />
            <ReactSelect
                value={discordSelected}
                classNamePrefix="rs"
                isSearchable={false}
                options={discordData.guildsInfo}
                onChange={(e: any) => {
                    dispatch(
                        changeSlectedDiscord({
                            selectedDiscord: discordData.memberGuilds[e?.value],
                        })
                    );
                    setDiscordSelected(e);
                }}
                styles={{
                    ...selectStyles,
                    valueContainer: (base, state) => ({
                        ...base,
                        ...selectStyles.valueContainer?.(base, state),
                        marginRight: 'auto',
                        paddingLeft: 8,
                        minWidth: '350px',
                    }),
                }}
                formatOptionLabel={({ value, label }) => (
                    <p style={{ color: 'white' }} className={styles.selectValue}>
                        {label}
                    </p>
                )}
                components={{
                    Control: ({ children, ...props }) => (
                        <components.Control {...props}>{children}</components.Control>
                    ),
                }}
                className={styles.input}
            />
            {dSelected.isOnboarded && (
                <div className={styles.box}>
                    <div className="connect-list-item__content">
                        <div className={styles.smallicon}>
                            <img src="/img/socials/discord.svg" alt="icon" />
                        </div>
                        <p className="connect-list-item__title">{dSelected?.name}</p>
                        <button className="connect-list-item__btn">Already Linked</button>
                    </div>
                </div>
            )}
            <Button
                isLoading={btnLoading}
                color="green"
                className={styles.doneBtn}
                onClick={handleBotAdd}
                data-analytics-click="done_button"
            >
                <span>Done</span>
            </Button>
        </React.Fragment>
    );
};

export default ConnectDiscordBot;
