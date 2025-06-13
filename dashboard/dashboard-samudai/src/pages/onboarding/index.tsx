import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { selectGoTo } from 'store/features/Onboarding/slice';
import {
    useProfileDetailsMutation,
    useSetUpProfileMutation,
    useTypeOfMemberMutation,
} from 'store/services/Login/login';
import useLogin from 'hooks/useLogin';
import { useTypedSelector } from 'hooks/useStore';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './onboarding.module.scss';
import Sidebar from 'components/new-sidebar';
import Page1 from './pages/page1';
import Page5 from './pages/page5';
import clsx from 'clsx';
import Sprite from 'components/sprite';
import Page2 from './pages/page2';
import { profileImages } from 'components/@popups/MessageCreate/constants';
import { selectBillingTerm, selectBillingTier } from 'store/features/common/slice';
import { EventAnalyticsPayload, sendEventAnalytics } from 'utils/activity/sendTrackingAnalytics';

export interface dropdown {
    value: string;
    label: string;
}

const Onboarding = () => {
    const [tab, setTab] = useState<number>(2);
    const goto = useTypedSelector(selectGoTo);
    const { checkAuth } = useLogin();
    const member_type = localStorage.getItem('account_type');
    const [searchParams, setSearchParams] = useSearchParams();

    const billingTier = useTypedSelector(selectBillingTier);
    const billingTerm = useTypedSelector(selectBillingTerm);

    const [typeOfMember] = useTypeOfMemberMutation();
    const [setupProfile] = useSetUpProfileMutation();
    const [profileDetails] = useProfileDetailsMutation();

    const handleStartAs = async (type: 'contributor' | 'admin') => {
        try {
            await typeOfMember({
                linkId: getMemberId(),
                stepId: 'TYPE_OF_MEMBER',
                value: {
                    user: type,
                },
            });

            localStorage.setItem('account_type', type);

            mixpanel.track('connect_wallet', {
                member_id: getMemberId(),
                wallet_address: localStorage.getItem('account'),
            });
            mixpanel.time_event('start-as');

            setTab(2);
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleSetupProfile = async () => {
        try {
            await setupProfile({
                linkId: getMemberId(),
                stepId: 'SETUP_PROFILE',
            });

            setTab(3);
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const onboardingCompleteAnalytics = async () => {
        try {
            const analyticsPayload: EventAnalyticsPayload = {} as EventAnalyticsPayload;
            analyticsPayload.type = 'POST';
            analyticsPayload.endpoint = 'onboardingComplete';
            analyticsPayload.endpointName = 'onboardingComplete';
            analyticsPayload.args = '';
            analyticsPayload.fulfilled = true;
            analyticsPayload.data = '';
            sendEventAnalytics(analyticsPayload);
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleProfileDetails = async (
        name: string,
        email: string,
        daoName: string,
        tags: string[]
    ) => {
        try {
            await profileDetails({
                linkId: getMemberId(),
                stepId: 'PROFILE_DETAILS',
                value: {
                    name: name,
                    email: email,
                    profile_picture:
                        profileImages[Math.floor(Math.random() * profileImages.length)],
                    type_of_member: member_type === 'contributor' ? 'contributor' : 'admin',
                    dao_name: daoName,
                    tags: tags,
                },
            });
            onboardingCompleteAnalytics();
            if (member_type === 'admin') {
                localStorage.setItem('enablesType', 'dao');
                window.location.reload();
                window.location.href = `/loading`;
            } else {
                localStorage.setItem('enablesType', 'contributor');
                window.location.reload();
                window.location.href = `/loading`;
            }
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    useEffect(() => {
        const handleStartAsAdmin = async () => {
            try {
                await typeOfMember({
                    linkId: getMemberId(),
                    stepId: 'TYPE_OF_MEMBER',
                    value: {
                        user: 'admin',
                    },
                });

                mixpanel.track('connect_wallet', {
                    member_id: getMemberId(),
                    wallet_address: localStorage.getItem('account'),
                });
                mixpanel.time_event('start-as');

                handleSetupProfile();
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            }
        };
        if (billingTerm && billingTier) {
            localStorage.setItem('account_type', 'admin');
            setTab(3);
            handleStartAsAdmin();
        } else if (goto && goto === 2) {
            handleStartAs('contributor');
            setTab(2);
        } else if (goto && goto === 3) {
            setTab(2);
        } else if (goto && goto === 4) {
            setTab(3);
        }
    }, [goto, billingTerm, billingTier]);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        const source = searchParams.get('s');
        const semail = searchParams.get('e');
        source === 'email' && semail ? localStorage.setItem('semail', semail) : null;
    }, []);

    return (
        <div className={css.root} data-analytics-page="onboarding">
            <div className={css.wrapper}>
                <Sidebar hideDao />

                <div className={css.heading}>Welcome to Samudai!</div>

                {tab !== 1 && (
                    <button
                        className={css.back_button}
                        onClick={() => setTab((currTab) => currTab - 1)}
                    >
                        <Sprite
                            style={{ width: '24px', height: '24px' }}
                            url="/img/sprite.svg#square-left"
                        />{' '}
                        Go Back
                    </button>
                )}

                <div
                    className={clsx(css.content, 'orange-scrollbar')}
                    data-analytics-parent="introduction"
                >
                    {tab === 1 && <Page1 callback={handleStartAs} />}

                    {tab === 2 && (
                        <Page2
                            type={member_type === 'admin' ? 'admin' : 'contributor'}
                            callback={handleSetupProfile}
                        />
                    )}

                    {tab === 3 && (
                        <Page5
                            type={member_type === 'admin' ? 'admin' : 'contributor'}
                            callback={handleProfileDetails}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
