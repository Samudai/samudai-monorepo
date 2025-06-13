import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { toggleSidebar } from 'store/features/app/slice';
import useLogin from 'hooks/useLogin';
import { useTypedDispatch } from 'hooks/useStore';
import { Complete, ConnectApps, ConnectWallet, StartAs } from 'components/@signup';
import 'styles/pages/sign-up.scss';
import { SignUpModals, SignUpState } from './types';

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

const SignUp: React.FC = () => {
    const [state, setState] = useState<SignUpState>(initialState);
    const [modal, setModal] = useState<SignUpModals>(SignUpModals.ConnectWallet);
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const { checkAuth } = useLogin();

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
        localStorage.removeItem('discord');
        localStorage.removeItem('notion');
        localStorage.removeItem('github');
        dispatch(toggleSidebar(false));
        return () => {
            dispatch(toggleSidebar(true));
        };
    }, []);

    return (
        <div className="sign-up" data-analytics-page="sign-up">
            <SwitchTransition mode="out-in">
                <CSSTransition key={modal} classNames="modal" timeout={500}>
                    <div className="sign-up__modal">
                        {getActiveModal(
                            SignUpModals.ConnectWallet,
                            <ConnectWallet
                                onNextModal={() => onNextModal(SignUpModals.StartAs)}
                                onNextModalSkip={onNextModal}
                            />
                        )}
                        {getActiveModal(
                            SignUpModals.StartAs,
                            <StartAs
                                state={state}
                                setState={setState}
                                onNextModal={() => onNextModal(SignUpModals.ConnectApps)}
                            />
                        )}
                        {getActiveModal(
                            SignUpModals.ConnectApps,
                            <ConnectApps onNextModal={() => onNextModal(SignUpModals.Complete)} />
                        )}
                        {/* {getActiveModal(
              SignUpModals.ProfileSetup,
              <ProfileSetup
                state={state}
                setState={setState}
                onNextModal={() => onNextModal(SignUpModals.Complete)}
              />
            )} */}
                        {getActiveModal(
                            SignUpModals.Complete,
                            <Complete state={state} setState={setState} />
                        )}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
};

export default SignUp;
