import { useEffect } from 'react';
import Modal from '../Modal/Modal';
import clsx from 'clsx';
import { useTypeOfMemberMutation } from 'store/services/Login/login';
import { SignUpState } from 'pages/sign-up/types';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { ControlButton, ModalTitle } from '../elements';
import { StartAsProps } from '../types';
import './StartAs.scss';

type AccountType = SignUpState['account_type'];

const StartAs: React.FC<StartAsProps> = ({ state, setState, onNextModal }) => {
    const [typeOfMember] = useTypeOfMemberMutation();

    const onChangeAccountType = (type: AccountType) => {
        const localData = localStorage.getItem('signUp');
        console.log(localData, !!localData);
        const storedData =
            localData !== null
                ? { ...JSON.parse(localData), account_type: type }
                : { account_type: type };
        localStorage.setItem('signUp', JSON.stringify(storedData));
        localStorage.setItem('account_type', type!);
        setState((prev) => ({ ...prev, account_type: type }));
    };

    const getActiveBtn = (type: AccountType) => {
        return state.account_type === type ? '--active' : null;
    };

    const handleNext = async () => {
        try {
            const res = await typeOfMember({
                linkId: getMemberId(),
                stepId: 'TYPE_OF_MEMBER',
                value: {
                    user: state.account_type!,
                },
            });
            console.log(res);

            mixpanel.track('connect_wallet', {
                member_id: getMemberId(),
                wallet_address: localStorage.getItem('account'),
            });
            mixpanel.time_event('start-as');
            onNextModal?.();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    useEffect(() => {
        const localData = localStorage.getItem('signup');
        console.log(localData, !!localData);
    }, []);

    return (
        <Modal>
            <ModalTitle icon="/img/icons/user-laptop.png" title="Start as..." />
            <div className="startas__sign">
                <button
                    className={clsx('startas__btn', getActiveBtn('contributor'))}
                    onClick={onChangeAccountType.bind(null, 'contributor')}
                >
                    <span>Contributor</span>
                </button>
                <button
                    className={clsx('startas__btn', getActiveBtn('admin'))}
                    onClick={onChangeAccountType.bind(null, 'admin')}
                >
                    <span>DAO</span>
                </button>
            </div>
            {state.account_type === 'admin' ? (
                <h6 className="startas__helper setup-img__title">
                    Starting as a DAO will require you to add Samudai bot to your DAO's discord
                    server. Please proceed only if you have the required access in your community.
                </h6>
            ) : (
                <></>
            )}
            <div className="modal-controls startas__controls">
                {!!state.account_type && (
                    <ControlButton className="startasbtn" title="Next" onClick={handleNext} />
                )}
            </div>
        </Modal>
    );
};

export default StartAs;
