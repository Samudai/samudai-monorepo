import styles from 'styles/pages/pipeline-form.module.scss';
import { useSearchParams } from 'react-router-dom';
import { getMemberId } from 'utils/utils';
import { discordRequest } from 'store/services/Login/model';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import { useEffect } from 'react';
import { useReconnectDiscordMutation } from 'store/services/Settings/settings';

require('dotenv').config();

function ReDiscord() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [reconnect] = useReconnectDiscordMutation();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            const payload = {
                code: code,
                memberId: getMemberId(),
                redirectUri: window.location.origin + '/rediscord',
            } as unknown as discordRequest;

            reconnect(payload)
                .unwrap()
                .then((res: any) => {
                    console.log(res);
                    localStorage.setItem('rediscord', 'true');
                    localStorage.setItem('rediscordvalue', res?.data.username);

                    toast('Success', 10000, 'Discord Reconnected Successfully', '')();
                    window.opener = null;
                    window.open('', '_self');
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
                    setTimeout(() => {
                        window.opener = null;
                        window.open('', '_self');
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

export default ReDiscord;
