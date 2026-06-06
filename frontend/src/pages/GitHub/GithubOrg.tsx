import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { changeJwt, selectActiveDao } from 'store/features/common/slice';
import { useGithubOrgMutation } from 'store/services/Login/login';
import store from 'store/store';
import { useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import styles from 'styles/pages/pipeline-form.module.scss';

const GithubOrg = () => {
    const [searchParams] = useSearchParams();

    const code = searchParams.get('code');
    const installationId = searchParams.get('installation_id');
    const setupAction = searchParams.get('setup_action');
    const state = searchParams.get('state');
    const [gitHubUser] = useGithubOrgMutation();
    const activeDAO = useTypedSelector(selectActiveDao);
    const jwt = localStorage.getItem('jwt');
    store.dispatch(changeJwt({ jwt: jwt! }));
    useEffect(() => {
        gitHubUser({
            code: code || '',
            dao_id: localStorage.getItem('active') || '',
            redirectUri: window.location.origin + '/githuborg',
            installation_id: Number(installationId),
            setup_action: setupAction || '',
            state: state || '',
        })
            .unwrap()
            .then((res) => {
                console.log(res);
                localStorage.setItem('githuborg', 'true');
                const localData = localStorage.getItem('signUp');
                const storedData = JSON.parse(localData!);
                const jwt = localStorage.getItem('jwt');
                store.dispatch(changeJwt({ jwt: jwt! }));
                localStorage.setItem('discordId', 'true');
                localStorage.setItem('discord', 'true');
                localStorage.setItem('signUp', JSON.stringify(storedData));
                localStorage.setItem('jwt', jwt!);
                localStorage.removeItem('active');
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
                    'Failed to connect Github, please close this tab and retry again',
                    ''
                )();
                setTimeout(() => {
                    window.opener = null;
                    window.open('', '_self');
                    window.close();
                }, 10000);
            });
    }, []);
    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
};

export default GithubOrg;
