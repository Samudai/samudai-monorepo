import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDiscordMutation, useCompleteTrialDashboardMutation } from 'store/services/Login/login';
import { discordRequest } from 'store/services/Login/model';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/pipeline-form.module.scss';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectContributorProgress, changeContributorProgress } from 'store/features/common/slice';
import { useUpdateContributorProgressMutation } from 'store/services/userProfile/userProfile';

require('dotenv').config();

function DiscordTemp() {
    const [discordUpdate] = useDiscordMutation();
    const [completeTrial] = useCompleteTrialDashboardMutation();
    const navigate = useNavigate();
    const jwt = localStorage.getItem('jwt');
    const memberType = localStorage.getItem('account_type');
    const dispatch = useTypedDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const currContributorProgress = useTypedSelector(selectContributorProgress);

    const [updateContributorProgress] = useUpdateContributorProgressMutation();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            const localData = localStorage.getItem('signUp');
            console.log('localData', localData);
            const payload = {
                code: code,
                memberId: getMemberId(),
                redirectUri: window.location.origin + '/discord',
                type_of_member: memberType,
            } as unknown as discordRequest;
            discordUpdate(payload)
                .unwrap()
                .then((res) => {
                    if (localData) {
                        const storedData = {
                            ...JSON.parse(localData),
                            discord: res?.data?.discord,
                        };
                        localStorage.setItem('signUp', JSON.stringify(storedData));
                    }
                    if (localStorage.getItem('account_type') === 'admin') {
                        axios
                            .get(
                                `${
                                    process.env.REACT_APP_GATEWAY
                                }api/discord/get/guilds/${getMemberId()}`
                            )
                            .then((res) => {
                                localStorage.setItem(
                                    'discordGuilds',
                                    JSON.stringify(res?.data?.data)
                                );
                            })
                            .catch((err) => {
                                console.error(err);
                                toast('Failure', 10000, 'Failed to fetch guilds', 'error')();
                            });
                    } else {
                        mixpanel.track('contributor_discord_connect', {
                            member_id: getMemberId(),
                            timestamp: new Date().toUTCString(),
                        });
                    }

                    if (!currContributorProgress.connect_discord) {
                        updateContributorProgress({
                            memberId: getMemberId(),
                            itemId: [ActivityEnums.NewContributorItems.CONNECT_DISCORD],
                        }).then(() => {
                            dispatch(
                                changeContributorProgress({
                                    contributorProgress: {
                                        ...currContributorProgress,
                                        connect_discord: true,
                                    },
                                })
                            );
                        });
                    }

                    localStorage.setItem('discordId', 'true');
                    localStorage.setItem('discord', 'true');
                    localStorage.setItem('discordbotlinking', 'false');
                    localStorage.setItem('jwt', jwt!);
                    localStorage.setItem('discordvalue', res?.data?.discord?.username);
                    console.log(res);
                    window.opener = null;
                    window.close();
                })
                .catch((err) => {
                    console.error(err);
                    toast(
                        'Failure',
                        10000,
                        'Failed to link discord, please close this tab and retry again',
                        ''
                    )();
                    console.log(err);
                    setTimeout(() => {
                        window.opener = null;
                        window.close();
                    }, 10000);
                });
        }
    }, []);
    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
}

export default DiscordTemp;
