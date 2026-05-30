import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { changeDiscordData } from 'store/features/Onboarding/slice';
import {
    changeAccount,
    changeJwt,
    changeProvider,
    changeUrl,
    changeWeb3ModalProvider,
} from 'store/features/common/slice';
import { useLoginMutation } from 'store/services/Login/login';
import { useTypedDispatch } from 'hooks/useStore';
import { SignUpModals } from 'pages/sign-up/types';
import { ceramicInit } from 'utils/ceramic/ceramic';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { ConnectList, ModalTitle } from '../elements';
import { ConnectWalletProps } from '../types';
import './ConnectWallet.scss';

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onNextModal, onNextModalSkip }) => {
    const dispatch = useTypedDispatch();
    // const [domain, setDomain] = useState<string>(window.location.host);
    // const [cookies, setCookie] = useCookies(['walletSignature']);
    const [login] = useLoginMutation();
    const web3modal = new Web3Modal({ cacheProvider: true });
    const navigate = useNavigate();
    const search = useLocation().search;
    const inviteCode = localStorage.getItem('inviteCode');
    const daomember = localStorage.getItem('daomember');

    const ConnectWalletHandler = async () => {
        localStorage.removeItem('discord bot');
        try {
            const web3Provider = await web3modal.connect();
            dispatch(changeWeb3ModalProvider({ web3ModalProvider: web3Provider }));
            const provider = new ethers.providers.Web3Provider(web3Provider);
            const signer = provider.getSigner();
            const ceramic = await ceramicInit(signer);
            // web3Provider.on('accountsChanged', async (accounts: string[]) => {
            //   localStorage.clear();
            //   navigate('/signup');
            //   toast('Attention', 5000, 'Wallet changed, please login again', '');
            // });
            // web3Provider.on('disconnect', (error: { code: number; message: string }) => {
            //   localStorage.clear();
            //   navigate('/signup');
            // });
            //console.log(ceramic);
            if (ceramic !== null) {
                const did = ceramic?.did?.id;
                const accounts = await signer.getAddress();
                // const siwe = new Siwe(provider);
                // const result = await siwe.walletSignIn(domain);
                console.log('provider:', provider);
                if (ceramic.did?.id) {
                    dispatch(changeProvider({ provider: provider }));
                    dispatch(changeAccount({ account: accounts }));
                    localStorage.setItem('did', did!);
                    // let expiry = new Date();
                    // expiry.setTime(expiry.getTime() + 2 * 24 * 60 * 60 * 1000);
                    // setCookie('walletSignature', result.signature, { path: '/', expires: expiry });
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
                                localStorage.setItem('daoId', `${res?.data?.discord_bot}`);
                                console.log('member does not exist', res?.data?.member?.member_id);
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
                                if (res?.data?.goTo?.step) {
                                    if (res.data.goTo.step === 2) {
                                        localStorage.setItem(
                                            'signUp',
                                            JSON.stringify({
                                                walletAddress: accounts,
                                                member_id: res?.data?.member?.member_id || 'test',
                                            })
                                        );
                                        onNextModal?.();
                                    } else if (res.data.goTo.step > 2) {
                                        const step = res?.data?.goTo?.step;
                                        localStorage.setItem(
                                            'signUp',
                                            JSON.stringify({
                                                walletAddress: accounts,
                                                member_id: res?.data?.member?.member_id || 'test',
                                                account_type: res?.data?.member_type,
                                            })
                                        );
                                        localStorage.setItem(
                                            'account_type',
                                            res?.data?.member_type || 'contributor'
                                        );

                                        step === 3 && onNextModalSkip?.(SignUpModals.ConnectApps);
                                        step === 4 && onNextModalSkip?.(SignUpModals.ProfileSetup);
                                        step === 5 && onNextModalSkip?.(SignUpModals.ProfileSetup);
                                    }
                                }
                            } else {
                                localStorage.setItem(
                                    'signUp',
                                    JSON.stringify({
                                        walletAddress: accounts,
                                        member_id: res?.data?.member?.member_id || 'test',
                                    })
                                );
                                const isContributor = res?.data?.member_type === 'contributor';
                                dispatch(changeJwt({ jwt: res?.data?.jwt || '' }));
                                localStorage.setItem('jwt', `${res?.data?.jwt}`);
                                window.analytics.identify(`${res?.data?.member?.member_id}`, {
                                    email: res?.data.member?.email,
                                    id: res?.data.member?.member_id,
                                    name: res?.data.member?.name,
                                    username: res?.data.member?.username,
                                    wallet_address: res?.data.member?.default_wallet_address,
                                });
                                mixpanel.identify(`${res?.data?.member?.member_id}`);
                                mixpanel.people.set({
                                    $email: res?.data?.member?.email,
                                    $name: res?.data?.member?.name,
                                    id: res?.data?.member?.member_id,
                                    username: res?.data?.member?.username,
                                    wallet_address: res?.data?.member?.default_wallet_address,
                                });
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

                            // mixpanel.track('Login', {
                            //   'Wallet Address': accounts,
                            //   member_id: res?.data?.member?.member_id || 'test',
                            // })
                            console.log('triggering connect wallet event');
                            mixpanel.time_event('signup');
                            mixpanel.time_event('connect_wallet');
                            console.log('triggered connect wallet event');
                        })
                        .catch((err) => {
                            toast('Failure', 1000, 'Something went wrong', '');
                        });
                }
            }

            // console.log(res);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <Modal data-analytics-parent="connect_wallet_model_parent">
            <ModalTitle icon="/img/icons/wallet.png" title="Connect Wallet" />
            {/* <h4 className="connect-wallet__subtitle">Sign in with:</h4> */}
            <ConnectList className="connect-wallet__connects">
                <ConnectList.Wallet
                    className="connect-wallet__connects-item"
                    icon="/img/tokens/eth.svg"
                    title="Ethereum"
                    onClick={() => {
                        ConnectWalletHandler();
                    }}
                    data-analytics-click="connect_wallet_click_btn"
                />
                {/* <ConnectList.Item
          className="connect-wallet__connects-item"
          icon="/img/tokens/polygon.svg"
          title="Polygon"
          onClick={() => {}}
        />
        <ConnectList.Item
          className="connect-wallet__connects-item"
          icon="/img/tokens/solana.svg"
          title="Solana"
          onClick={() => {}}
        /> */}
            </ConnectList>
            {/* <div className="modal-controls connect-wallet__controls">
        <ControlButton title="Next" onClick={onNextModal} />
      </div> */}
        </Modal>
    );
};

export default ConnectWallet;
