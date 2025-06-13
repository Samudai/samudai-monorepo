import { useEffect } from 'react';
import { changeDaoProgress, changeJwt, selectDaoProgress } from 'store/features/common/slice';
import store from 'store/store';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import styles from 'styles/pages/pipeline-form.module.scss';
import { useLinkDiscordBotMutation, useUpdateDaoProgressMutation } from 'store/services/Dao/dao';
import { toast } from 'utils/toast';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';

function BotsTemp() {
    const dispatch = useTypedDispatch();
    const [linkDiscord] = useLinkDiscordBotMutation();
    const daoId = localStorage.getItem('discordbot_link_id');
    const guildId = localStorage.getItem('discordbot_guild_id');
    const currDaoProgress = useTypedSelector(selectDaoProgress);

    const [updateDaoProgress] = useUpdateDaoProgressMutation();

    useEffect(() => {
        linkDiscord({ daoId: daoId!, guildId: guildId! })
            .then((res) => {
                toast('Success', 5000, 'Discord server connected successfully.', '')();
                const localData = localStorage.getItem('signUp');
                const storedData = JSON.parse(localData!);
                const jwt = localStorage.getItem('jwt');
                store.dispatch(changeJwt({ jwt: jwt! }));
                localStorage.setItem('discordId', 'true');
                localStorage.setItem('discord bot', 'true');
                localStorage.setItem('discord', 'true');
                localStorage.setItem('signUp', JSON.stringify(storedData));
                localStorage.setItem('jwt', jwt!);
                window.opener = null;
                window.open('', '_self');
                window.close();

                if (!currDaoProgress.connect_discord) {
                    updateDaoProgress({
                        daoId: daoId!,
                        itemId: [ActivityEnums.NewDAOItems.CONNECT_DISCORD],
                    }).then(() => {
                        dispatch(
                            changeDaoProgress({
                                daoProgress: {
                                    ...currDaoProgress,
                                    connect_discord: true,
                                },
                            })
                        );
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
}

export default BotsTemp;
