import clsx from 'clsx';
import styles from './public-page.module.scss';
import Sidebar from 'components/new-sidebar/public';
import { Suspense, useEffect } from 'react';
import Loader from 'components/Loader/Loader';
import Header from 'components/new-header/public';
import React from 'react';
import { IRoute } from 'root/router/types';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import LoginModal from '../popup/login/LoginModal';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import {
    changeAccount,
    changeJwt,
    changeProvider,
    changeUrl,
    loginModalState,
    openLoginModal,
} from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import { ethers } from 'ethers';
import mixpanel from 'mixpanel-browser';
import { useNavigate } from 'react-router-dom';
import { changeDiscordData, changeGoTo } from 'store/features/Onboarding/slice';
import { useLoginMutation } from 'store/services/Login/login';
import { ceramicInit } from 'utils/ceramic/ceramic';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { useAccount, useWalletClient } from 'wagmi';
import Web3Modal from 'web3modal';

interface PublicPageProps {
    component: IRoute['component'];
}

const PublicPage: React.FC<PublicPageProps> = ({ component: Component }) => {
    const loginState = useTypedSelector(loginModalState);
    const dispatch = useTypedDispatch();

    const loginModal = usePopup();

    const { connector: activeConnector, isConnected } = useAccount();
    const { data: walletClient, isError, isLoading } = useWalletClient({ chainId: 1 });
    const web3modal = new Web3Modal({ cacheProvider: true });
    const navigate = useNavigate();
    const inviteCode = localStorage.getItem('inviteCode');

    const [login] = useLoginMutation();

    const ConnectWalletHandler = async (provider: ethers.providers.Web3Provider) => {
        localStorage.removeItem('discord bot');
        try {
            const signer = provider.getSigner();
            const ceramic = await ceramicInit(signer);
            if (ceramic !== null) {
                const did = ceramic?.did?.id;
                const accounts = await signer.getAddress();
                if (ceramic.did?.id) {
                    dispatch(changeProvider({ provider: provider }));
                    dispatch(changeAccount({ account: accounts }));
                    login({
                        walletAddress: accounts,
                        chainId: 10,
                        member: {
                            did: did!,
                        },
                        inviteCode: inviteCode ? inviteCode : undefined,
                    })
                        .unwrap()
                        .then((res) => {
                            localStorage.setItem(
                                'signUp',
                                JSON.stringify({
                                    walletAddress: accounts,
                                    member_id: res?.data?.member?.member_id,
                                })
                            );
                            localStorage.setItem('account_type', res?.data?.member_type || '');
                            localStorage.setItem(
                                'isOnboarded',
                                !res?.data?.isOnboarded ? 'false' : 'true'
                            );
                            localStorage.setItem('access_token', Date.now().toString());
                            if (!res?.data?.isOnboarded) {
                                sessionStorage.setItem('new', JSON.stringify(res?.data?.member));
                                localStorage.removeItem('google calendar');
                                localStorage.removeItem('discord bot');
                                localStorage.removeItem('discordId');
                                localStorage.removeItem('discord');
                                localStorage.removeItem('github');
                                localStorage.removeItem('invitecode');
                                localStorage.removeItem('daomember');
                                sessionStorage.setItem(
                                    'apps',
                                    JSON.stringify(res?.data?.onboardingIntegration || [])
                                );
                                const discordGuilds = {
                                    guildsInfo: res?.data?.guildInfo || [],
                                    memberGuilds: res?.data?.memberGuilds || {},
                                };
                                dispatch(changeDiscordData({ discord: discordGuilds }));
                                dispatch(changeJwt({ jwt: res?.data?.jwt || '' }));
                                localStorage.setItem('jwt', `${res?.data?.jwt}`);
                                sessionStorage.setItem(
                                    'memberInfo',
                                    JSON.stringify(res?.data?.member)
                                );
                                if (res?.data?.goTo?.step && res.data.goTo.step >= 2) {
                                    dispatch(changeGoTo({ goTo: res?.data?.goTo?.step }));
                                    navigate('/signup');
                                }
                            } else {
                                const isContributor = res?.data?.member_type === 'contributor';
                                dispatch(changeJwt({ jwt: res?.data?.jwt || '' }));
                                localStorage.setItem('jwt', `${res?.data?.jwt}`);
                                dispatch(
                                    changeUrl({
                                        url: !isContributor
                                            ? '/dashboard/1'
                                            : `/${getMemberId()}/profile`,
                                    })
                                );
                                navigate(
                                    !isContributor ? '/dashboard/1' : `/${getMemberId()}/profile`
                                );
                            }
                            mixpanel.time_event('signup');
                            mixpanel.time_event('connect_wallet');
                        })
                        .catch((err) => {
                            navigate(`/login`);
                            toast('Failure', 5000, err?.data?.message, '')();
                        });
                }
            }
        } catch (err) {
            console.error(err);
            navigate(`/login`);
        }
    };

    // useEffect(() => {
    //     if (isConnected && walletClient) {
    //         console.log(isError, isLoading, walletClient);
    //         const provider = walletClient && walletClientToSigner(walletClient);
    //         console.log(provider);
    //         provider && ConnectWalletHandler(provider!);
    //     }
    // }, [isConnected, walletClient]);

    useEffect(() => {
        if (loginState) {
            loginModal.open();
        } else {
            loginModal.close();
        }
    }, [loginState]);

    const closeModal = () => {
        dispatch(openLoginModal({ open: false }));
    };

    return (
        <div className={clsx(styles.root, styles.rootSidebar)}>
            {<Sidebar />}
            <div className={styles.content} id="app-content">
                {<Header />}
                <Suspense fallback={<Loader />}>
                    <Component />
                </Suspense>
            </div>
            <PopupBox active={loginModal.active} onClose={closeModal}>
                <LoginModal />
            </PopupBox>
        </div>
    );
};

export default PublicPage;
