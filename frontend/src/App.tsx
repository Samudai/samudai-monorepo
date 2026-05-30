import { useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    selectAccount,
    selectMemberData,
    selectPushSDKSocket,
} from './store/features/common/slice';
import connectSocket, { connectPushSDKSocket } from './utils/notification/connectSocket';
import IntractAttribution from '@intract/attribution';
import '@lottiefiles/lottie-player';
import {
    DisclaimerComponent,
    RainbowKitProvider,
    darkTheme,
    getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Routing from 'root/router/routing';
import store from 'store/store';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Prompt from 'pages/onboarding/Prompts';
import FastNotifications from 'components/FastNotifications';
import Menu from 'components/menu/menu';
import { onClick as onClickAnalyticsHook } from 'utils/analytics';
import listenNotification, { listenPushNotification } from 'utils/notification/listenNotification';
import { getMemberId } from 'utils/utils';
import '@rainbow-me/rainbowkit/styles.css';
import SendbirdChat from '@sendbird/chat';
import { GroupChannelHandler, GroupChannelModule } from '@sendbird/chat/groupChannel';
import { selectSendbird, setSendBird } from 'store/features/messages/slice';
import { v4 as uuid } from 'uuid';
import { toast } from 'utils/toast';
import { CustomType } from 'components/@pages/messages/elements/SendBird';

const socket = store.getState().commonReducer.socket;

const App = () => {
    const navigate = useNavigate();
    const account = useTypedSelector(selectAccount);
    const pushSDKSocket = useTypedSelector(selectPushSDKSocket);
    const memberData = useTypedSelector(selectMemberData);
    const sendbird = useTypedSelector(selectSendbird);
    const dispatch = useTypedDispatch();

    const isOnboarded = localStorage.getItem('isOnboarded');

    const { chains, publicClient } = configureChains(
        [mainnet],
        [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ETHEREUM! }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({
        appName: 'Samudai App',
        projectId: '8b60825811388c0a7b52f78296af99f3',
        chains,
    });

    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors,
        publicClient,
    });

    const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
        <Text>
            By connecting your wallet, you agree to the{' '}
            <Link href="https://samudai.xyz/terms">Terms of Service</Link> and acknowledge you have
            read and understand the{' '}
            <Link href="https://samudai.xyz/privacy-policy">privacy policy</Link>
        </Text>
    );

    (window as any).navigate = navigate;

    // Analytics hook and session management
    useEffect(() => {
        window.addEventListener('click', onClickAnalyticsHook);

        return () => window.removeEventListener('click', onClickAnalyticsHook);
    }, []);

    useEffect(() => {
        const memberId = getMemberId();
        const fn = async () => {
            const sb = SendbirdChat.init({
                appId: `${process.env.REACT_APP_SEND_BIRD_APP_ID}`,
                modules: [new GroupChannelModule()],
                localCacheEnabled: true,
            });

            await sb.connect(memberId);
            await sb.setChannelInvitationPreference(true);

            await sb.updateCurrentUserInfo({
                nickname: memberData?.name,
                profileUrl: memberData?.profile_picture,
            });

            const channelHandler = new GroupChannelHandler();
            channelHandler.onMessageReceived = (channel, message: any) => {
                console.log('check');
                const username = message?.sender?.nickname;
                const channelname = channel.name;
                if (channel.customType === CustomType.Personal) {
                    toast('Success', 5000, `${username} sent you a message.`, '')();
                } else if (channel.customType === CustomType.Group) {
                    toast('Success', 5000, `${username} sent a message in ${channelname}.`, '')();
                }
            };
            await sb.groupChannel.addGroupChannelHandler(uuid(), channelHandler);

            dispatch(setSendBird(sb));
        };
        if (isOnboarded === 'true') {
            fn();
        }
    }, [isOnboarded]);

    useEffect(() => {
        const fn = async () => {
            await sendbird.updateCurrentUserInfo({
                nickname: memberData?.name,
                profileUrl: memberData?.profile_picture,
            });
        };
        if (sendbird) fn();
    }, [memberData]);

    useEffect(() => {
        const member_id = getMemberId();
        if (member_id) connectSocket(member_id);

        listenNotification();
    }, [socket]);

    useEffect(() => {
        if (account && !pushSDKSocket) connectPushSDKSocket(account);

        listenPushNotification();
    }, [account, pushSDKSocket]);

    // Session management - remove session on tab close and send analytics
    // useEffect(() => {
    //     const handleTabClose = (event: any) => {
    //         event.preventDefault();

    //         console.log('beforeunload event triggered');
    //         sendTrackingAnalytics({ action: 'Close', data: {} });

    //         localStorage.removeItem('session');

    //         return (event.returnValue = 'Are you sure you want to exit?');
    //     };

    //     window.addEventListener('beforeunload', handleTabClose);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleTabClose);
    //     };
    // }, []);

    useEffect(() => {
        IntractAttribution(process.env.REACT_APP_INTRACT_PROJECT_ID!, {
            configAllowCookie: true,
        });
    }, []);

    return (
        <React.Fragment>
            <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider
                    appInfo={{
                        appName: 'Samudai App',
                        learnMoreUrl: 'https://samudai.xyz',
                        disclaimer: Disclaimer,
                    }}
                    chains={chains}
                    theme={darkTheme({ overlayBlur: 'small' })}
                >
                    <Menu />
                    <FastNotifications />
                    <Routing />
                    <Prompt />
                </RainbowKitProvider>
            </WagmiConfig>
        </React.Fragment>
    );
};

export default App;
