import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { changeGcal, changeJwt } from 'store/features/common/slice';
import store from 'store/store';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import styles from 'styles/pages/pipeline-form.module.scss';

function GCal() {
    const [searchParams] = useSearchParams();
    const code = decodeURIComponent(searchParams.get('code')!);
    const localData = localStorage.getItem('signUp');
    const storedData = localData ? JSON.parse(localData) : null;
    const member_id = storedData?.member_id;

    useEffect(() => {
        const localData = localStorage.getItem('signUp');
        const storedData = JSON.parse(localData!);
        const code = searchParams.get('code');
        const member_id = storedData?.member_id;
        const jwt = localStorage.getItem('jwt');
        store.dispatch(changeJwt({ jwt: jwt! }));
        localStorage.setItem('discordId', 'true');
        localStorage.setItem('discord', 'true');
        localStorage.setItem('signUp', JSON.stringify(storedData));
        localStorage.setItem('jwt', jwt!);
        axios
            .post(`${process.env.REACT_APP_GATEWAY}api/plugin/gcal/auth`, {
                linkId: member_id,
                code: code,
                redirectUri: window.location.origin + '/gcaluser',
                member_type: 'memeber',
            })
            .then((res) => {
                console.log(res);
                const localData = localStorage.getItem('signUp');
                const storedData = JSON.parse(localData!);
                const jwt = localStorage.getItem('jwt');
                store.dispatch(changeJwt({ jwt: jwt! }));
                store.dispatch(changeGcal({ gcal: true }));
                localStorage.setItem('google calendar', 'true');
                localStorage.setItem('gcal', 'true');
                localStorage.setItem('signUp', JSON.stringify(storedData));
                localStorage.setItem('jwt', jwt!);
                localStorage.setItem('gcal-user', 'true');
                window.opener = null;
                window.open('', '_self');
                window.close();
            })
            .catch((err) => {
                console.log(err);
                // window.opener = null;
                // window.open('', '_self');
                // window.close();
                toast(
                    'Failure',
                    10000,
                    'Failed to connect Google Calendar, please close this tab and retry again',
                    ''
                )();
                setTimeout(() => {
                    window.opener = null;
                    window.open('', '_self');
                    window.close();
                }, 10000);
            });
    }, [code]);
    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
}

export default GCal;
