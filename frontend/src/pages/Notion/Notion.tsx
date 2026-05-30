import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { changeJwt, changeNotion } from 'store/features/common/slice';
import { useNotionAuthMutation } from 'store/services/Login/login';
import store from 'store/store';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import styles from 'styles/pages/pipeline-form.module.scss';

function Notion() {
    const [searchParams] = useSearchParams();
    const [notionAuth] = useNotionAuthMutation();
    const code = searchParams.get('code');
    const localData = localStorage.getItem('signUp');
    const storedData = localData ? JSON.parse(localData) : null;
    const member_id = storedData?.member_id;

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await notionAuth({
                    code: code || '',
                    member_id: member_id,
                    redirectUri: window.location.origin + '/notion',
                }).unwrap();
                localStorage.setItem('notion', 'true');
                const localData = localStorage.getItem('signUp');
                const storedData = JSON.parse(localData!);
                const jwt = localStorage.getItem('jwt');
                store.dispatch(changeJwt({ jwt: jwt! }));
                store.dispatch(changeNotion({ notion: true }));
                localStorage.setItem('discordId', 'true');
                localStorage.setItem('discord', 'true');
                localStorage.setItem('signUp', JSON.stringify(storedData));
                localStorage.setItem('jwt', jwt!);
                window.opener = null;
                window.open('', '_self');
                window.close();
            } catch (err: any) {
                console.log(err);
                // window.opener = null;
                // window.open('', '_self');
                // window.close();
                toast(
                    'Failure',
                    10000,
                    'Failed to connect notion, please close this tab and retry again',
                    ''
                )();
                setTimeout(() => {
                    window.opener = null;
                    window.open('', '_self');
                    window.close();
                }, 10000);
            }
        };
        fun();
    }, [code]);

    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
}

export default Notion;
