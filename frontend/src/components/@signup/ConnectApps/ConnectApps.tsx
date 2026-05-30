import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import Modal from '../Modal/Modal';
import { Gnosis } from '@samudai_xyz/web3-sdk';
import styles from 'root/components/@popups/ProjectCreate/ProjectCreate.module.scss';
import { selectStyles } from 'root/constants/selectStyles';
import {
    changeDiscordData,
    changeSlectedDiscord,
    selectDiscord,
    selectSelectedDiscord,
} from 'store/features/Onboarding/slice';
import {
    changeGcal,
    changeGnosis,
    changeSnapshot,
    selectProvider,
} from 'store/features/common/slice';
import {
    useConnectAppsSendMutation,
    useGnosisAuthMutation,
    useLazyGetLatestDaoForMemberQuery,
    useOnboardingUpdateAdminMutation,
    useOnboardingUpdateMutation,
    useSnapshotAuthMutation,
} from 'store/services/Login/login';
import { onboardingUpdateRequest } from 'store/services/Login/model';
import useInput from 'hooks/useInput';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import * as SocialIcons from 'ui/SVG/socials';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { discordBot, discordOAuth } from 'utils/urls';
import { getMemberId } from 'utils/utils';
import { ConnectList, ControlButton, ModalTitle } from '../elements';
import { ConnectAppsProps } from '../types';
import './ConnectApps.scss';

require('dotenv').config();

interface dropdown {
    value: string;
    label: string;
}
const ConnectApps: React.FC<ConnectAppsProps> = ({ onNextModal, dbot }) => {
    const dispatch = useTypedDispatch();
    const [id, setId] = useState<string>(localStorage.getItem('account_type')!);
    const providerEth = useTypedSelector(selectProvider);
    const discordData = useTypedSelector(selectDiscord);
    const selectedDiscordInfo = useTypedSelector(selectSelectedDiscord);
    const [discordId, setDiscordId] = useState<string>('');
    const [text, setText, trimText, cleartext] = useInput<HTMLTextAreaElement>('');
    const [gtext, setGText, trimGText, cleargtext] = useInput<HTMLTextAreaElement>('');
    const [skip, setSkip] = useState<boolean>(true);
    const [next, setNext] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');
    let timer: ReturnType<typeof setTimeout>;
    const [daoData] = useLazyGetLatestDaoForMemberQuery();
    const [connected, setConnected] = useState<boolean>(dbot ? true : false);
    const [botsConnected, setBotsConnected] = useState<boolean>(false);
    const [snapshot, setSnapshot] = useState<boolean>(false);
    const [gnosis, setGnosis] = useState<boolean>(false);
    const [daoId, setDaoId] = useState<string>('');
    const [snapshotAuth] = useSnapshotAuthMutation();
    const [gnosisAuth] = useGnosisAuthMutation();
    const [connectApps] = useConnectAppsSendMutation();
    const [onboardingUpdate] = useOnboardingUpdateMutation();
    const [discordSelected, setDiscordSelected] = useState<dropdown>({} as dropdown);
    const [adminOboarded] = useOnboardingUpdateAdminMutation();
    const memberId = getMemberId();

    const navigate = useNavigate();

    const handleBot = async () => {
        localStorage.setItem('daoId', 'fetching data...');
        daoData(discordSelected.value)
            .unwrap()
            .then(async (res) => {
                console.log('res:', res.data);
                if (res?.data?.dao?.dao_id) {
                    clearTimeout(timer);
                    setDaoId(res.data?.dao?.dao_id);
                    await connectApps({
                        linkId: getMemberId(),
                        stepId: 'INTEGRATIONS',
                        value: {
                            'discord bot': res.data,
                        },
                    }).unwrap();
                    setContent('Connected');
                    localStorage.setItem('daoId', res.data?.dao?.dao_id);
                    mixpanel.track('connect_discord_bot', {
                        step: 'connect_apps',
                        dao_id: res.data?.dao?.dao_id,
                        type_of_member: localStorage.account_type,
                        timestamp: new Date().toUTCString(),
                    });
                    setBotsConnected(true);
                    // onNextModal?.();
                } else {
                    timer = setTimeout(() => {
                        handleBot();
                    }, 2000);
                }
            });
    };

    const handleNextAdmin = async (val: string) => {
        if (val === 'snapshot' && snapshot && !!text.trim()) {
            try {
                await snapshotAuth({
                    daoId: selectedDiscordInfo.dao_id! || daoId,
                    snapshot: text.trim(),
                })
                    .unwrap()
                    .then((res) => {
                        console.log('res:', res);
                    })
                    .then(async () =>
                        connectApps({
                            linkId: selectedDiscordInfo.dao_id! || daoId,
                            stepId: 'INTEGRATIONS',
                            value: {
                                snapshot: text.trim(),
                            },
                        })
                            .unwrap()
                            .then(() => {
                                dispatch(changeSnapshot({ snapshot: true }));
                            })
                            .catch((err) => console.error(err))
                    );
                setSnapshot(false);
            } catch (err) {
                console.log(err);
            }
        } else if (gnosis && gtext.trim()) {
            try {
                const gnosis = new Gnosis(providerEth!, 1);
                const res = await gnosis.verifySafe(gtext.trim());
                if (res) {
                    await gnosisAuth({
                        provider: {
                            dao_id: selectedDiscordInfo.dao_id! || daoId,
                            name: 'Default Mainnet Provider',
                            provider_type: 'gnosis',
                            address: gtext.trim(),
                            is_default: true,
                            created_by: getMemberId(),
                            chain_id: 1,
                        },
                    }).unwrap();
                    await connectApps({
                        linkId: selectedDiscordInfo.dao_id! || daoId,
                        stepId: 'INTEGRATIONS',
                        value: {
                            gnosis: gtext.trim(),
                        },
                    }).unwrap();
                    dispatch(changeGnosis({ gnosis: true }));
                    setGnosis(false);
                } else {
                    toast('Failure', 5000, 'Failed to add', '')();
                }
            } catch (err: any) {
                toast('Failure', 5000, 'Failed to add', err?.message)();
            }
        }
    };

    const handleAdd = async () => {
        try {
            adminOboarded({
                daoId: localStorage.getItem('daoId') || '',
                onboarding: true,
                member_id: memberId,
                updated_by: memberId,
                memberOnboarded: true,
            })
                .unwrap()
                .then(() => {
                    mixpanel.track('connected_apps_admin', {
                        member_id: memberId,
                        dao_id: localStorage.getItem('daoId') || '',
                        apps: sessionStorage.getItem('apps') || '',
                    });
                    mixpanel.track('signup', {
                        member_id: memberId,
                        dao_id: localStorage.getItem('daoId') || '',
                        account_type: id,
                    });
                    sessionStorage.removeItem('new');
                    sessionStorage.removeItem('apps');
                    navigate('/' + localStorage.getItem('daoId') + '/dashboard/1');
                    // onNextModal?.();
                    toast(
                        'Success',
                        10000,
                        'Initial onboarding successful. Please navigate to settings to complete your profile.',
                        ''
                    )();
                });
        } catch (err) {
            toast('Failure', 5000, 'Please Try Again', '')();
            console.log(err);
        }
    };

    useEffect(() => {
        if (discordSelected.value) {
            sessionStorage.setItem(
                'apps',
                JSON.stringify(selectedDiscordInfo.onboardingIntegration)
            );
            localStorage.setItem('daoId', selectedDiscordInfo.dao_id! || daoId);
        }
    }, [discordSelected.value]);

    useEffect(() => {
        const val: any = sessionStorage.getItem('apps');
        const apps = JSON.parse(val);
        if (!!apps && apps?.length > 0) {
            const obj: any = {};
            apps?.forEach((i: any) => {
                const a = Object.keys(i).map((key) => {
                    return key;
                });
                const valu = i[a[0]];
                obj[a[0]] = valu;
            });
            if (obj?.['google calendar']) {
                dispatch(changeGcal({ gcal: true }));
            }
            if (obj?.snapshot) {
                dispatch(changeSnapshot({ snapshot: true }));
                setSnapshot(false);
            }
            if (obj?.gnosis) {
                dispatch(changeGnosis({ gnosis: true }));
                setGnosis(false);
            }
            if (localStorage.account_type === 'contributor') {
                if (obj?.discord) {
                    setConnected(true);
                    setNext(true);
                }
            } else {
                setConnected(true);
                // const discord = sessionStorage.getItem('guilds');
                // dispatch(changeDiscordData({ discord: JSON.parse(discord!) }));
                console.log(obj);
                if (obj?.['discord bot']) {
                    setBotsConnected(true);
                    setNext(true);
                }
            }
        }
    }, [discordSelected.value]);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('discord');
            if (localData) {
                setConnected(localData === 'true');
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('discordId');
            setDiscordId(localData || '');
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('discordGuilds');
            dispatch(changeDiscordData({ discord: JSON.parse(localData!) }));
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
            localStorage.removeItem('discordGuilds');
        };
    }, []);

    useEffect(() => {
        setId(localStorage.getItem('account_type')!);
        setDiscordId(localStorage.getItem('discordId') || '');
    }, []);

    const disabled = connected && ((botsConnected && id === 'admin') || id !== 'admin');

    return (
        <Modal data-analytics-page="add_daos_page">
            <ModalTitle icon="/img/icons/apps.png" title="Connect Discord Server" />
            <ConnectList className="connect-apps__list" data-analytics-parent="connect_list">
                {!dbot && (
                    <ConnectList.Discord
                        title="Discord"
                        icon={<SocialIcons.Discord />}
                        onClick={() => {
                            mixpanel.track('connect_discord', {
                                step: 'connect_apps',
                                member_id: getMemberId(),
                                type_of_member: localStorage.account_type,
                                timestamp: new Date().toUTCString(),
                            });
                            const host = encodeURIComponent(window.location.origin + '/discord');
                            window.open(discordOAuth(host));
                        }}
                        disabled={connected}
                        data-analytics-click="connect_discord"
                    />
                )}
                {connected && !content && (
                    <ConnectList.Children>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ color: 'white', padding: '10px' }}>
                                Select a Discord Server
                            </div>
                            <div>
                                <ReactSelect
                                    value={discordSelected}
                                    classNamePrefix="rs"
                                    isSearchable={false}
                                    options={discordData?.guildsInfo}
                                    onChange={(e: any) => {
                                        dispatch(
                                            changeSlectedDiscord({
                                                selectedDiscord: discordData.memberGuilds[e?.value],
                                            })
                                        );
                                        setDiscordSelected(e);
                                    }}
                                    styles={{
                                        ...selectStyles,
                                        valueContainer: (base, state) => ({
                                            ...base,
                                            ...selectStyles.valueContainer?.(base, state),
                                            marginRight: 'auto',
                                            paddingLeft: 8,
                                            minWidth: '350px',
                                        }),
                                    }}
                                    className={styles.githubSelect}
                                    formatOptionLabel={({ value, label }) => (
                                        <p
                                            style={{ color: 'white' }}
                                            className={styles.selectValue}
                                        >
                                            {label}
                                        </p>
                                    )}
                                    components={{
                                        Control: ({ children, ...props }) => (
                                            <components.Control {...props}>
                                                {children}
                                            </components.Control>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </ConnectList.Children>
                )}
                {!!discordSelected.value && (
                    <ConnectList.Bot
                        title="Discord Bot"
                        icon={<SocialIcons.Discord />}
                        content={content}
                        onClick={() => {
                            setContent('Fetching data...');
                            const host = encodeURIComponent(window.location.origin + '/bot');
                            window.open(discordBot(host, discordSelected.value), '_blank');
                            setSkip(false);
                            localStorage.setItem('daoId', 'fetching data...');
                            setTimeout(() => {
                                handleBot();
                            }, 10000);
                        }}
                        disabled={!connected}
                    />
                )}

                {/* {((!selectedDiscordInfo.isOnboarded && !!selectedDiscordInfo.name) ||
          (id !== 'admin' && !!discordId) ||
          (id !== 'admin' && connected)) && (
          <>
            <ConnectList.Gcal
              title="Google Calendar"
              icon="/img/icons/gcal.png"
              onClick={() => {
                mixpanel.track('connect_google_calendar', {
                  step: 'connect_apps',
                  member_id: getMemberId(),
                  type_of_member: localStorage.account_type,
                  timestamp: new Date().toUTCString(),
                });
                id !== 'admin'
                  ? window.open(gcaluser(), '_blank')
                  : window.open(gcaldao(), '_blank');
              }}
              disabled={!disabled}
            />
            <ConnectList.Item
              title="Github"
              icon={<Github />}
              onClick={() => {
                mixpanel.track('connect_github', {
                  step: 'connect_apps',
                  member_id: getMemberId(),
                  type_of_member: localStorage.account_type,
                });
                const host = encodeURIComponent(window.location.origin + '/githubuser');
                window.open(gitHubContributor(host));
              }}
              disabled={!disabled}
            />
            <ConnectList.Item
              title="Notion"
              icon={<Notion />}
              onClick={() => {
                mixpanel.track('connect_notion', {
                  step: 'connect_apps',
                  member_id: getMemberId(),
                  type_of_member: localStorage.account_type,
                  timestamp: new Date().toUTCString(),
                });
                const host = encodeURIComponent(window.location.origin + '/notion');
                window.open(notionAuth(host));
              }}
              disabled={!disabled}
              data-analytics-click="notion"
            />
            {id === 'admin' && (
              <>
                {!gnosis ? (
                  <ConnectList.Gcal
                    title="Safe"
                    icon={'/img/icons/gnosis.png'}
                    onClick={() => {
                      mixpanel.track('connect_gnosis', {
                        step: 'connect_apps',
                        member_id: getMemberId(),
                        type_of_member: localStorage.account_type,
                        timestamp: new Date().toUTCString(),
                      });
                      setGnosis(true);
                    }}
                    disabled={!disabled}
                  />
                ) : (
                  <ul className={styles.row}>
                    <div
                      style={{
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      <button
                        style={{
                          position: 'absolute',
                          top: '28px',
                          right: '3px',
                          color: 'wheat',
                          width: '60px',
                        }}
                        onClick={() => {
                          !!gtext ? handleNextAdmin('gnosis') : setGnosis(false);
                        }}
                      >
                        {!gtext.length ? 'Cancel' : 'Add'}
                      </button>
                      <TextArea
                        placeholder="Type Safe Address..."
                        className={styles.textarea}
                        value={gtext}
                        onChange={setGText}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            if (gtext.trim() === '') return;
                            !!gtext && handleNextAdmin('gnosis');
                          }
                        }}
                      />
                    </div>
                  </ul>
                )}
                {!snapshot ? (
                  <ConnectList.Item
                    title="SnapShot"
                    icon={'/img/icons/snapshot.png'}
                    onClick={() => {
                      mixpanel.track('connect_snapshot', {
                        step: 'connect_apps',
                        member_id: getMemberId(),
                        type_of_member: localStorage.account_type,
                        timestamp: new Date().toUTCString(),
                      });
                      setSnapshot(true);
                    }}
                    disabled={!disabled}
                  />
                ) : (
                  <ul className={styles.row}>
                    <div
                      style={{
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      <button
                        style={{
                          position: 'absolute',
                          top: '28px',
                          right: '3px',
                          color: 'wheat',
                          width: '60px',
                        }}
                        onClick={() => {
                          !!text ? handleNextAdmin('snapshot') : setSnapshot(false);
                        }}
                      >
                        {!text.length ? 'Cancel' : 'Add'}
                      </button>
                      <TextArea
                        placeholder="Enter ETH Mainnet address..."
                        className={styles.textarea}
                        value={text}
                        onChange={setText}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            if (text.trim() === '') return;
                            !!text && handleNextAdmin('snapshot');
                          }
                        }}
                      />
                    </div>
                  </ul>
                )}
              </>
            )}
          </>
        )} */}
            </ConnectList>
            {/* {((id !== 'admin' && !!discordId) || (id !== 'admin' && next)) && (
        <div className="modal-controls connect-apps__controls">
          <ControlButton
            title="Add"
            onClick={() => {
              mixpanel.track('start_as', {
                user_type: id,
              });
              mixpanel.time_event('connected_apps_contributor');
              handleAdd();
            }}
          />
        </div>
      )} */}
            {((!!discordId && !!daoId) ||
                (!selectedDiscordInfo.isOnboarded && !!selectedDiscordInfo.dao_id)) && (
                <div className="modal-controls connect-apps__controls">
                    <ControlButton
                        title="Add"
                        onClick={() => {
                            mixpanel.track('start_as', {
                                user_type: id,
                            });
                            mixpanel.time_event('connected_apps_admin');
                            handleAdd();
                        }}
                    />
                </div>
            )}
            {selectedDiscordInfo.isOnboarded && (
                <div className="modal-controls connect-apps__controls">
                    <ControlButton
                        title="Next"
                        onClick={() => {
                            if (dbot) {
                                navigate(`/${selectedDiscordInfo.dao_id}/dashboard/1`);
                            }
                            const storageVal = sessionStorage.getItem('memberInfo');
                            const localData = localStorage.getItem('signUp');
                            const parsedData = JSON.parse(localData!);
                            const member_id = parsedData.member_id;
                            const account_type = localStorage.getItem('account_type');
                            const discord = parsedData.discord;
                            const member = JSON.parse(storageVal!);
                            const randInt = Math.floor(1000 + Math.random() * 9000);
                            const payload = {
                                member: {
                                    member_id: getMemberId(),
                                    username:
                                        member?.discord?.username + '_' + randInt ||
                                        discord?.username + '_' + randInt ||
                                        randInt.toString(),
                                    did: member.did!,
                                    open_for_opportunity: true,
                                    captain: false,
                                    profile_picture: member?.profile_picture,
                                    name: member?.discord?.username || discord?.username || '',
                                    email: member?.discord?.email || discord?.email || '',
                                    about: '',
                                    skills: [],
                                },
                                socials: [],
                                onBoarding: {
                                    member_id: getMemberId(),
                                    admin: true,
                                    contributor: false,
                                    type_of_work: [],
                                },
                            } as unknown as onboardingUpdateRequest;
                            onboardingUpdate(payload)
                                .unwrap()
                                .then(() => {
                                    mixpanel.track('connected_apps_admin', {
                                        member_id: getMemberId(),
                                        dao_id: selectedDiscordInfo.dao_id || '',
                                        apps: sessionStorage.getItem('apps') || '',
                                    });
                                    mixpanel.track('signup', {
                                        member_id: getMemberId(),
                                        dao_id: selectedDiscordInfo.dao_id || '',
                                        account_type: 'admin',
                                    });
                                    sessionStorage.removeItem('new');
                                    sessionStorage.removeItem('apps');
                                    navigate(`/${selectedDiscordInfo.dao_id}/dashboard/1`);
                                    toast(
                                        'Success',
                                        10000,
                                        'Initial onboarding successful. Please navigate to settings to complete your profile.',
                                        ''
                                    )();
                                })
                                .catch((err) => {
                                    console.log(err);
                                    toast('Failure', 5000, 'Something went wrong', '');
                                });
                        }}
                    />
                </div>
            )}
        </Modal>
    );
};
export default ConnectApps;
