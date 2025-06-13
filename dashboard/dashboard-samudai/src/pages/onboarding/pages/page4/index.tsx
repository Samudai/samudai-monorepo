import React from 'react';
import Sprite from 'components/sprite';
import css from '../../onboarding.module.scss';
import ReactSelect, { components } from 'react-select';
import styles from 'root/components/@popups/ProjectCreate/ProjectCreate.module.scss';
import { selectStyles } from 'root/constants/selectStyles';
import { changeSlectedDiscord, selectDiscord } from 'store/features/Onboarding/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { discordBot } from 'utils/urls';
import { dropdown } from 'pages/onboarding';

interface Page4Props {
    discordSelected: dropdown;
    setDiscordSelected: (value: dropdown) => void;
    callback: () => Promise<void>;
}

const Page4: React.FC<Page4Props> = ({ discordSelected, setDiscordSelected, callback }) => {
    const dispatch = useTypedDispatch();
    let discordData = useTypedSelector(selectDiscord) || [];

    if (discordData?.guildsInfo?.length === 0 && localStorage.getItem('discordGuilds')) {
        discordData = JSON.parse(localStorage.getItem('discordGuilds')!);
    }

    return (
        <div className={css.content_third}>
            <div className={css.subTitle}>DISCORD CONNECTED SUCCESSFULLY</div>
            <h1 className={css.title}>CONNECT DISCORD</h1>

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
                className={css.select}
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
            />

            <div className={css.hintMessage}>
                Add Samudai bot to your selected server. This is required to fetch your community
                activities and give you a wholesome experience on Samudai
            </div>

            <div className={css.controls}>
                <button
                    className={css.controls_discordBtn}
                    onClick={() => {
                        const host = encodeURIComponent(window.location.origin + '/bot');
                        window.open(discordBot(host, discordSelected.value), '_blank');
                        localStorage.setItem('daoId', 'fetching data...');
                        setTimeout(() => {
                            callback();
                        }, 10000);
                    }}
                    data-analytics-click="add_samudai_bot_button"
                >
                    <Sprite url="/img/sprite.svg#inline-discord" />
                    <span>Add Samudai Bot</span>
                </button>
            </div>
        </div>
    );
};

export default Page4;
