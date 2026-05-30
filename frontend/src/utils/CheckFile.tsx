import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mixpanel from './mixpanel/mixpanelInit';
import connectSocket from './notification/connectSocket';
import axios from 'axios';
import { useAccount, useConnect, useWalletClient } from 'wagmi';
import { changeGoTo } from 'store/features/Onboarding/slice';
import {
    changeAccount,
    changeActiveDao,
    changeJwt,
    changeProvider,
    selectUrl,
} from 'store/features/common/slice';
import store from 'store/store';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { walletClientToSigner } from 'pages/onboarding/utils';
import Loader from 'components/Loader/Loader';
import checkIfValidUUID from './checkIfValidUUID';
import { getMemberId } from './utils';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

require('dotenv').config();

const ConnectWalletComp: React.FC = () => {
    const { connector: activeConnector, isConnected } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
        chainId: 1,
    });
    const {
        data: walletClient,
        isError,
        isLoading: isWalletLoading,
    } = useWalletClient({ chainId: 1 });

    // const web3modal = new Web3Modal({ cacheProvider: true });
    const loadUrl = useTypedSelector(selectUrl);
    const navigate = useNavigate();
    const dispatch = useTypedDispatch();
    const search = useLocation().search;
    const inviteCode = new URLSearchParams(search).get('invite');
    localStorage.setItem('inviteCode', inviteCode || '');
    const [url, setUrl] = useState(window.location.href.replace(window.location.origin, ''));
    const { authenticated, ready } = usePrivy();
    const { ready: walletReady, wallets } = useWallets();
    const [loginCheck, SetLoginCheck] = useState(false);
    const samudaiXCaster = localStorage.getItem('samudaiXCaster');

    const routesFun = async () => {
        const path = loadUrl!.split('/');
        if (!!path[1] && checkIfValidUUID(path[1])) {
            if (!!path[2] && path[2] === 'profile') {
                navigate(`/${path[1]}/profile`);
            } else {
                //  path[1] = activeDAO.id;
                dispatch(changeActiveDao({ activeDao: path[1] }));
                let newPath: string;
                if (path[2] === 'dashboard') newPath = path.slice(0, 4).join('/');
                else if (path[2] === 'settings') newPath = path.slice(0, 4).join('/');
                else if (path[2] === 'projects') newPath = path.slice(0, 8).join('/');
                else if (path[2] === 'payments') newPath = path.slice(0, 4).join('/');
                else if (path[2] === 'jobs') newPath = path.slice(0, 8).join('/');
                else if (path[2] === 'applicants') newPath = path.slice(0, 8).join('/');
                else newPath = path.slice(0, 3).join('/');
                navigate(`${newPath}`);
            }
        } else if (!!path[1] && path[1] === 'jobs') {
            navigate(`/jobs`);
        }
        // else if (path[1] === 'invite' && !!getMemberId()) {
        //   //http://localhost:3000/invite/project/b066a76ee

        //   const { data } = await axios.get(
        //     `${process.env.REACT_APP_API_URL}/app/project/invite/${
        //       path[path.length - 1] || path[path.length - 2]
        //     }/${getMemberId()}`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        //       },
        //     }
        //   );
        //   if (data)
        //     navigate(`/${data?.data?.link_id}/projects/${data?.data?.project_id}/board`);
        // }
        else {
            navigate('/dashboard/1');
        }
    };

    const connectWalletUtil = async (provider: ethers.providers.Web3Provider) => {
        try {
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            store.dispatch(changeProvider({ provider: provider }));
            store.dispatch(changeAccount({ account: account }));
            localStorage.getItem('did');
            const localData = localStorage.getItem('signUp');
            const parsedData = JSON.parse(localData!);
            const discord = parsedData.discord;
            const activeDAO = store.getState().commonReducer.activeDao;
            window.location.pathname !==
                ('/gcaluser' ||
                    '/gcaldao' ||
                    '/githubuser' ||
                    '/githuborg' ||
                    '/notion' ||
                    '/discordtemp' ||
                    '/botstemp') &&
                axios
                    .post(`${process.env.REACT_APP_GATEWAY}api/member/login`, {
                        walletAddress: account,
                        chainId: 10,
                        member: {
                            did: localStorage.getItem('did'),
                        },
                        isXcaster: samudaiXCaster === 'true' ? true : false,
                    })
                    .then(({ data: res }) => {
                        if (samudaiXCaster === 'true' && res?.data?.member?.member_id) {
                            window.open(
                                `https://aiipihanfbemhegopmlekpccbeojgfgk.chromiumapp.org?memberId=${res.data.member.member_id}`,
                                '_self'
                            );
                            localStorage.removeItem('samudaiXCaster');
                        }
                        store.dispatch(changeJwt({ jwt: res?.data?.jwt || '' }));
                        localStorage.setItem('jwt', `${res?.data?.jwt}`);
                        localStorage.setItem(
                            'signUp',
                            JSON.stringify({
                                walletAddress: account,
                                member_id: res?.data?.member?.member_id || 'test',
                                discord: discord,
                            })
                        );
                        localStorage.setItem('account_type', res?.data?.member_type);

                        localStorage.setItem(
                            'discord_connected',
                            !res?.data?.member?.discord?.discord_user_id ? 'false' : 'true'
                        );

                        store.dispatch(changeActiveDao({ activeDao: activeDAO }));
                        store.dispatch(changeJwt({ jwt: res?.data?.jwt || '' }));
                        store.dispatch(changeProvider({ provider: provider }));
                        store.dispatch(changeAccount({ account: account }));
                        localStorage.setItem('jwt', `${res?.data?.jwt}`);
                        connectSocket(res?.data?.member?.member_id);

                        mixpanel.register({
                            member_id: res?.data?.member?.member_id,
                            dao_id: activeDAO !== '' ? activeDAO : null,
                            timestamp: new Date().toUTCString(),
                        });

                        window.analytics.identify(`${res?.data?.member?.member_id}`, {
                            email: res?.data?.member?.email,
                            id: res?.data?.member?.member_id,
                            name: res?.data?.member?.name,
                            username: res?.data?.member?.username,
                            wallet_address: res?.data?.member?.default_wallet_address,
                        });
                        mixpanel.identify(`${res?.data?.member?.member_id}`);
                        mixpanel.people.set({
                            $email: res?.data?.member?.email,
                            $name: res?.data?.member?.name,
                            id: res?.data?.member?.member_id,
                            username: res?.data?.member?.username,
                            wallet_address: res?.data?.member?.default_wallet_address,
                        });
                        // store.dispatch({ type: 'socket/connect' });

                        return res;
                    })
                    .then((res: any) => {
                        localStorage.setItem(
                            'isOnboarded',
                            !res?.data?.isOnboarded ? 'false' : 'true'
                        );
                        localStorage.setItem('discord_name', res?.data?.member?.discord?.username);
                        const daoInviteUrl = localStorage.getItem('daoInviteUrl');
                        if (!res?.data?.isOnboarded) {
                            dispatch(changeGoTo({ goTo: res?.data?.goTo?.step }));
                            navigate('/signup');
                        } else if (daoInviteUrl) {
                            navigate(daoInviteUrl);
                            localStorage.removeItem('daoInviteUrl');
                        } else if (
                            url === '' ||
                            url === '/' ||
                            url === '/check' ||
                            url === '/jobs'
                        ) {
                            store.dispatch(changeJwt({ jwt: res?.data?.jwt || '' }));
                            store.dispatch(changeProvider({ provider: provider }));
                            store.dispatch(changeAccount({ account: account }));
                            if (loadUrl) {
                                loadUrl !== ('/check' || '/' || '/signup' || '/jobs' || '/login')
                                    ? navigate(loadUrl)
                                    : navigate('/dashboard/1');
                            }
                            // !!loadUrl ? loadUrl!=='/check' ? navigate(loadUrl) : navigate('/dashboard/1');
                        } else {
                            routesFun();
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        navigate('/login');
                    });
        } catch (err) {
            console.error(err);
            navigate('/login');
        }
    };

    const connectWallet = async () => {
        try {
            const provider = !isWalletLoading && walletClientToSigner(walletClient!);
            // const web3Provider = await web3modal.connect();
            // dispatch(changeWeb3ModalProvider({ web3ModalProvider: web3Provider }));
            // const provider = new ethers.providers.Web3Provider(web3Provider);
            if (!provider) return;
            connectWalletUtil(provider);
            SetLoginCheck(true);
        } catch (err) {
            console.log(err);
            navigate('/login');
        }
    };

    const connectPrivyWallet = async () => {
        try {
            const embeddedWallet = wallets[0];
            const embeddedWalletAddress = embeddedWallet?.address;
            const provider = await embeddedWallet?.getEthersProvider();
            if (!provider) return;
            connectWalletUtil(provider);
            SetLoginCheck(true);
        } catch (err) {
            console.log(err);
            navigate('/login');
        }
    };

    useEffect(() => {
        if (loginCheck) return;
        if (window.location.pathname.split('/')[2] === 'form') {
            navigate(window.location.pathname);
        } else if (ready && !authenticated && isConnected === false) {
            navigate('/login');
        } else if (ready && authenticated && walletReady && wallets.length) {
            connectPrivyWallet();
            const member_id = getMemberId();
            if (member_id) connectSocket(member_id);
        } // else if (isConnected && walletClient) {
        //     connectWallet();
        //     const member_id = getMemberId();
        //     if (member_id) connectSocket(member_id);
        // }
    }, [wallets, ready, walletReady, authenticated, walletClient, isConnected]);

    return (
        <>
            <Loader />
        </>
    );
};

export default ConnectWalletComp;
