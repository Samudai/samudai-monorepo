import { useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { SignUpModals, SignUpState } from '../sign-up/types';
import axios from 'axios';
import { changeDiscordData, changeSlectedDiscord } from 'store/features/Onboarding/slice';
import { toggleSidebar } from 'store/features/app/slice';
import { changeGcal, changeSnapshot } from 'store/features/common/slice';
import useLogin from 'hooks/useLogin';
import { useTypedDispatch } from 'hooks/useStore';
import { Complete, ConnectApps, ProfileSetup } from 'components/@signup';
import Loader from 'components/Loader/Loader';
import { getMemberId } from 'utils/utils';
import 'styles/pages/sign-up.scss';

require('dotenv').config();

const initialState: SignUpState = {
    img: null,
    account_type: null,
    nickname: '',
    biography: '',
    skills: [],
    twitter: '',
    fiverr: '',
    behance: '',
    dribbble: '',
    mirror: '',
    department: [],
};

const AddDao: React.FC = () => {
    const [state, setState] = useState<SignUpState>(initialState);
    const [modal, setModal] = useState<SignUpModals>(SignUpModals.ConnectApps);
    const dispatch = useTypedDispatch();
    const { checkAuth } = useLogin();
    const [load, setLoad] = useState(false);

    const getActiveModal = (current: SignUpModals, element: JSX.Element) => {
        if (current === modal) {
            return element;
        }
    };
    const onNextModal = (modal: SignUpModals) => {
        setModal(modal);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const fun = async () => {
            try {
                setLoad(true);
                localStorage.removeItem('discord');
                localStorage.removeItem('notion');
                localStorage.removeItem('github');
                // localStorage.setItem('account_type', 'admin');
                dispatch(changeGcal({ gcal: false }));
                dispatch(changeSnapshot({ snapshot: false }));
                dispatch(
                    changeSlectedDiscord({
                        selectedDiscord: {
                            id: '',
                            name: '',
                            isOnboarded: false,
                        },
                    })
                );
                axios
                    .get(`${process.env.REACT_APP_GATEWAY}api/discord/get/guilds/${getMemberId()}`)
                    .then((res) => {
                        console.log(res?.data?.data);
                        localStorage.setItem('discordGuilds', JSON.stringify(res?.data?.data));
                        dispatch(changeDiscordData({ discord: res?.data?.data }));
                    })
                    .catch((err) => {
                        setLoad(false);
                        console.log(err);
                    });
                dispatch(toggleSidebar(true));
                setLoad(false);
            } catch (err) {
                setLoad(false);
                console.log(err);
            }
        };
        fun();
        return () => {
            dispatch(toggleSidebar(true));
        };
    }, []);

    return !load ? (
        <>
            <div
                className="sign-up"
                style={{ minHeight: '80vh' }}
                data-analytics-page="add_new_dao"
            >
                <SwitchTransition mode="out-in">
                    <CSSTransition key={modal} classNames="modal" timeout={500}>
                        <div className="sign-up__modal">
                            {getActiveModal(
                                SignUpModals.ConnectApps,
                                <ConnectApps
                                    dbot
                                    onNextModal={() => onNextModal(SignUpModals.ProfileSetup)}
                                />
                            )}
                            {getActiveModal(
                                SignUpModals.ProfileSetup,
                                <ProfileSetup
                                    state={state}
                                    setState={setState}
                                    onNextModal={() => onNextModal(SignUpModals.Complete)}
                                    dbot
                                />
                            )}
                            {getActiveModal(
                                SignUpModals.Complete,
                                <Complete state={state} setState={setState} />
                            )}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </>
    ) : (
        <Loader />
    );
};

export default AddDao;
