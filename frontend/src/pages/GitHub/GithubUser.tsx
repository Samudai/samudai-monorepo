import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { changeJwt } from 'store/features/common/slice';
import { useGithubUserMutation } from 'store/services/Login/login';
import store from 'store/store';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import styles from 'styles/pages/pipeline-form.module.scss';

const GithubUser = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const [gitHubUser] = useGithubUserMutation();
    const localData = localStorage.getItem('signUp');
    const storedData = localData ? JSON.parse(localData) : null;
    const member_id = storedData?.member_id;

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await gitHubUser({
                    code: code || '',
                    member_id: member_id,
                    redirectUri: window.location.origin + '/githubuser',
                }).unwrap();
                localStorage.setItem('github', 'true');
                const localData = localStorage.getItem('signUp');
                const storedData = JSON.parse(localData!);
                const jwt = localStorage.getItem('jwt');
                store.dispatch(changeJwt({ jwt: jwt! }));
                localStorage.setItem('git-user', 'true');
                localStorage.setItem('discord', 'true');
                localStorage.setItem('signUp', JSON.stringify(storedData));
                localStorage.setItem('jwt', jwt!);
                localStorage.setItem('discordId', 'true');

                window.opener = null;
                window.open('', '_self');
                window.close();
            } catch (err) {
                localStorage.setItem('git-user', 'false');

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
            }
        };
        fun();
        // gitHubUser({
        //   code: code || '',
        //   member_id: member_id,
        //   redirectUri: 'http://localhost:3000/githubuser',
        // })
        //   .then((res) => {
        //     debugger;
        //     console.log(res);
        //     localStorage.setItem('github', 'true');
        //     const localData = localStorage.getItem('signUp');
        //     let storedData = JSON.parse(localData!);
        //     const jwt = localStorage.getItem('jwt');
        //     store.dispatch(changeJwt({ jwt: jwt! }));
        //     localStorage.setItem('discordId', 'true');
        //     localStorage.setItem('git user', 'true');
        //     localStorage.setItem('discord', 'true');
        //     localStorage.setItem('signUp', JSON.stringify(storedData));
        //     localStorage.setItem('jwt', jwt!);
        //     window.opener = null;
        //     window.open('', '_self');
        //     window.close();
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     // window.opener = null;
        //     // window.open('', '_self');
        //     // window.close();
        //     toast(
        //       'Failure',
        //       10000,
        //       'Failed to connect notion, please close this tab and retry again',
        //       ''
        //     )();
        //   });
    }, []);
    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
};

export default GithubUser;
