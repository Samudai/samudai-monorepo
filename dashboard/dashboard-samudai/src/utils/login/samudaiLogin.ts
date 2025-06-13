import { useTypedDispatch } from 'hooks/useStore';
import { changeDiscordData, changeGoTo } from 'store/features/Onboarding/slice';
import { changeJwt, changeUrl } from 'store/features/common/slice';
import { useLoginMutation } from 'store/services/Login/login';
import { useAddMemberToDaoMutation } from 'store/services/Dao/dao';
import { useNavigate } from 'react-router-dom';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { getMemberId } from 'utils/utils';
import { toast } from 'utils/toast';
import { ceramicInit } from 'utils/ceramic/ceramic';
import { changeAccount, changeProvider } from 'store/features/common/slice';
import { ethers } from 'ethers';

export const samudaiLogin = () => {
    const inviteCode = localStorage.getItem('inviteCode');
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const [login] = useLoginMutation();
    const [createMember] = useAddMemberToDaoMutation();

    const samudaiXCaster = localStorage.getItem('samudaiXCaster');

    const loginUtil = async (
        accounts: string,
        chainId: number,
        provider: ethers.providers.Web3Provider,
        signer: ethers.providers.JsonRpcSigner,
        isPrivy?: boolean,
        signedTextRes?: string,
        privyUserDetails?: any,
        semail?: string
    ) => {
        if (!accounts || !signer || !provider) return;

        try {
            const ceramic = await ceramicInit(signer, isPrivy, signedTextRes);
            if (ceramic) {
                const did = ceramic?.did?.id;
                if (did) {
                    dispatch(changeProvider({ provider: provider }));
                    dispatch(changeAccount({ account: accounts }));
                    login({
                        walletAddress: accounts,
                        chainId: chainId,
                        member: {
                            did: did!,
                            email: semail,
                        },
                        inviteCode: inviteCode ? inviteCode : undefined,
                        isPrivy: isPrivy!,
                        isXcaster: samudaiXCaster === 'true' ? true : false,
                        privyUserDetails: privyUserDetails,
                    })
                        .unwrap()
                        .then((res) => {
                            if (samudaiXCaster === 'true' && res?.data?.member?.member_id) {
                                window.open(
                                    `https://aiipihanfbemhegopmlekpccbeojgfgk.chromiumapp.org?memberId=${res.data.member.member_id}`,
                                    '_self'
                                );
                                localStorage.removeItem('samudaiXCaster');
                            }
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
                            localStorage.setItem(
                                'discord_connected',
                                !res?.data?.member?.discord?.discord_user_id ? 'false' : 'true'
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
                            const daoInviteCode = localStorage.getItem('daoInviteCode');
                            if (daoInviteCode) {
                                createMember({
                                    invite_code: daoInviteCode,
                                    member_id: res?.data?.member?.member_id as string,
                                }).unwrap();
                                localStorage.removeItem('daoInviteCode');
                            }
                        })
                        .catch((err) => {
                            navigate(`/login`);
                            toast('Failure', 5000, err?.data?.message, '')();
                        });
                } else {
                    console.log('NO_DID');
                }
            } else {
                console.log('NO_CERAMIC');
            }
        } catch (err) {
            console.error(err);
            navigate(`/login`);
        }
    };

    return {
        loginUtil,
    };
};
