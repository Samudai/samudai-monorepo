import { useEffect, useState } from 'react';
import { trackCustomWallet } from '@intract/attribution';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers, providers } from 'ethers';
import { useAccount, useConnect } from 'wagmi';
import { type WalletClient } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import css from './onboarding.module.scss';
import { usePrivy, useWallets, useLogin } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { samudaiLogin } from 'utils/login/samudaiLogin';
import { generateMessageForEntropy } from 'utils/ceramic/ceramic';

export function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    trackCustomWallet(account.address);
    return provider;
}

export const PrivyLogin = () => {
    const { user, ready, authenticated, signMessage } = usePrivy();
    const { ready: walletReady, wallets } = useWallets();
    const { loginUtil } = samudaiLogin();
    const [privyLoggedIn, setPrivyLoggedIn] = useState(false);
    const [privyModal, setPrivyModal] = useState(false);
    const navigate = useNavigate();

    const signMessageUtil = async (
        message: string,
        signer: ethers.providers.JsonRpcSigner
    ): Promise<string> => {
        const res = await signMessage(message);
        return res;
    };

    const getUserDetails = () => {
        const privyUserDetails = {
            userEmailAddress: user?.email?.address,
            userId: user?.id,
            google: user?.google,
            github: user?.github,
        };
        return privyUserDetails;
    };

    const { login } = useLogin({
        onComplete: async () => {
            console.log('User logged in successfullyyyy!');
            setPrivyModal(true);
        },
        onError: (error) => {
            console.log('Error: ', error);
        },
    });

    const ConnectPrivyWalletHandler = async () => {
        try {
            const wallet = wallets[0];
            const isPrivy = wallet.walletClientType === 'privy';
            const provider = await wallet?.getEthersProvider();
            const signer = await provider?.getSigner();
            const accounts = await signer?.getAddress();
            const semail = localStorage.getItem('semail') as string | undefined;
            if (user?.wallet) {
                setPrivyLoggedIn(true);
                if (isPrivy) {
                    const privyUserDetails = getUserDetails();
                    let signedTextRes = '';
                    if (authenticated) {
                        const userAddr = await signer?.getAddress();
                        const message = generateMessageForEntropy(userAddr!);
                        signedTextRes = await signMessageUtil(message, signer!);
                    }
                    await loginUtil(
                        accounts!,
                        10,
                        provider!,
                        signer!,
                        true,
                        signedTextRes,
                        privyUserDetails,
                        semail
                    );
                } else {
                    await loginUtil(
                        accounts!,
                        10,
                        provider!,
                        signer!,
                        undefined,
                        undefined,
                        undefined,
                        semail
                    );
                }
            }
        } catch (err) {
            console.error(err);
            navigate(`/login`);
        }
    };

    useEffect(() => {
        if ((ready && !authenticated) || !walletReady) return;
        if (privyModal && wallets.length) {
            (async () => {
                await ConnectPrivyWalletHandler();
            })().finally(() => setPrivyModal(false));
        }
    }, [wallets, privyModal, walletReady]);

    return (
        <div>
            <button
                className={css.connect_privy}
                onClick={ready && !authenticated ? login : ConnectPrivyWalletHandler}
                disabled={!ready}
            >
                Connect
            </button>
        </div>
    );
};

export const LoginComp = () => {
    const { connector: activeConnector, isConnected } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
        chainId: mainnet.id,
    });

    // useEffect(() => {
    //     console.log('activeConnector', activeConnector);
    //     console.log('isConnected', isConnected);
    //     console.log('connectors', connectors);
    //     console.log('error', error);
    //     console.log('isLoading', isLoading);
    //     console.log('pendingConnector', pendingConnector);
    // }, [isConnected]);

    return (
        <>
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus || authenticationStatus === 'authenticated');

                    return (
                        <div
                            {...(!ready && {
                                'aria-hidden': true,
                                style: {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                        >
                            {(() => {
                                if (!connected) {
                                    return (
                                        <button
                                            className={css.connect_btn}
                                            onClick={openConnectModal}
                                            data-analytics-click="connect_web3_button"
                                        >
                                            <img
                                                className={css.connect_btn_img}
                                                src="/img/onboarding/wallet-connect.png"
                                                alt="icon"
                                            />
                                        </button>
                                    );
                                }

                                if (chain.unsupported) {
                                    return (
                                        <button
                                            className={css.connect_btn}
                                            onClick={openChainModal}
                                        >
                                            <img src="/img/onboarding/metamask.png" alt="icon" />
                                            <span className={css.connect_text}>Wrong Network</span>
                                        </button>
                                    );
                                }

                                return (
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button
                                            className={css.connect_btn}
                                            onClick={openAccountModal}
                                            data-analytics-click="connected_web3_button"
                                        >
                                            <img src="/img/onboarding/metamask.png" alt="icon" />
                                            <span className={css.connect_text}>
                                                Connected to {account.displayName}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </>
    );
};
