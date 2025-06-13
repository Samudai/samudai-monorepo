import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import BackButton from '../elements/BackButton/BackButton';
import SetupOpensea from './steps/SetupOpensea/SetupOpensea';
import { selectProfilePicture } from 'store/features/common/slice';
import {
    useLazyCheckUserNameQuery,
    useOnboardingUpdateAdminMutation,
    useOnboardingUpdateMutation,
} from 'store/services/Login/login';
import { onboardingUpdateRequest } from 'store/services/Login/model';
import { useCreateDepartmentBulkMutation } from 'store/services/Settings/settings';
import { useTypedDispatch } from 'hooks/useStore';
import { useTypedSelector } from 'hooks/useStore';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { ControlButton, ModalTitle } from '../elements';
import { ProfileSetupProps } from '../types';
import { SetupImgName, SetupSkills, SetupSocials } from './steps';
import './ProfileSetup.scss';

const step_titles1 = ['Profile Set-up', 'Add Portfolio Links'];
const step_titles2 = ['Your Departments', 'Your Departments'];

const ProfileSetup: React.FC<ProfileSetupProps> = ({
    state,
    noDepartment,
    setState,
    onNextModal,
    dbot,
}) => {
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [enableNext, setEnableNext] = useState<boolean>(false);
    const [openOpensea, setOpenOpensea] = useState<boolean>(false);
    const [onboardingUpdate] = useOnboardingUpdateMutation();
    const [adminOboarded] = useOnboardingUpdateAdminMutation();
    const [checkUserName] = useLazyCheckUserNameQuery();
    const [createDepartment] = useCreateDepartmentBulkMutation();

    const profile_picture = useTypedSelector(selectProfilePicture);
    console.log('ProfileSetup -> profile_picture', profile_picture);
    const localData = localStorage.getItem('signUp');
    const parsedData = JSON.parse(localData!);
    const account_type = localStorage.getItem('account_type');
    const [loading, setLoading] = useState(false);

    const onPrevStep = () => {
        setStep(Math.max(1, step - 1));
    };

    const onChangeStep = () => {
        if (step >= step_titles1.length) {
            const localData = localStorage.getItem('signUp');
            const parsedData = JSON.parse(localData!);
            const member_id = parsedData.member_id;
            const account_type = localStorage.getItem('account_type');
            const discord = parsedData.discord;
            const twitterSocial = state.twitter
                ? {
                      member_id: member_id,
                      type: 'twitter',
                      url: state.twitter,
                  }
                : null;
            const dribbleSocial = state.dribbble
                ? {
                      member_id: member_id,
                      type: 'dribbble',
                      url: state.dribbble,
                  }
                : null;
            const behanceSocial = state.behance
                ? {
                      member_id: member_id,
                      type: 'behance',
                      url: state.behance,
                  }
                : null;
            const mirrorSocial = state.mirror
                ? {
                      member_id: member_id,
                      type: 'mirror',
                      url: state.mirror,
                  }
                : null;
            const fiverrSocial = state.fiverr
                ? {
                      member_id: member_id,
                      type: 'fiverr',
                      url: state.fiverr,
                  }
                : null;

            const did = localStorage.getItem('did');
            const oldData: any = JSON.parse(sessionStorage.getItem('new')!);
            const randInt = Math.floor(1000 + Math.random() * 9000);
            const payload = {
                member: {
                    member_id: member_id,
                    username:
                        state.nickname.trim().toLowerCase() ||
                        discord?.username + '_' + randInt ||
                        oldData?.discord?.username + '_' + randInt ||
                        '',
                    did: did!,
                    open_for_opportunity: true,
                    captain: false,
                    profile_picture: profile_picture,
                    name: discord?.username || oldData?.discord?.username || '',
                    email: discord?.email || oldData?.email || '',
                    about: '',
                    skills: [],
                },
                socials: [
                    twitterSocial ? twitterSocial : null,
                    dribbleSocial ? dribbleSocial : null,
                    behanceSocial ? behanceSocial : null,
                    mirrorSocial ? mirrorSocial : null,
                    fiverrSocial ? fiverrSocial : null,
                ].filter((social) => !!social),
                onBoarding: {
                    member_id: member_id,
                    admin: account_type === 'admin',
                    contributor: account_type === 'contributor',
                    type_of_work: [],
                },
            } as unknown as onboardingUpdateRequest;
            if (account_type === 'admin' && noDepartment) {
                try {
                    adminOboarded({
                        daoId: localStorage.getItem('daoId') || '',
                        onboarding: true,
                        member_id: member_id,
                        updated_by: member_id,
                        memberOnboarded: true,
                    })
                        .unwrap()
                        .then(() => {
                            mixpanel.track('connected_apps_admin', {
                                member_id: member_id,
                                dao_id: localStorage.getItem('daoId') || '',
                                apps: sessionStorage.getItem('apps') || '',
                            });
                            mixpanel.track('signup', {
                                member_id: member_id,
                                dao_id: localStorage.getItem('daoId') || '',
                                account_type: account_type,
                            });
                            sessionStorage.removeItem('new');
                            sessionStorage.removeItem('apps');
                            navigate('/' + localStorage.getItem('daoId') + '/dashboard/1');
                            toast(
                                'Success',
                                10000,
                                'Initial onboarding successful. Please navigate to settings to complete your profile.',
                                ''
                            )();
                        });
                } catch (err) {
                    setLoading(false);
                    toast('Failure', 5000, 'Please Try Again', '')();
                    console.log(err);
                }
            } else if (account_type === 'admin' && !!state.department) {
                setLoading(true);
                createDepartment({
                    daoId: localStorage.getItem('daoId')!,
                    departments: state.department,
                })
                    .unwrap()
                    .then((res) => {
                        if (!dbot) {
                            console.log(res);
                            onboardingUpdate(payload)
                                .unwrap()
                                .then((res) => {
                                    mixpanel.track('create_departments_onboarding', {
                                        daoId: localStorage.getItem('daoId')!,
                                        departments: JSON.stringify(state.department),
                                    });
                                    try {
                                        adminOboarded({
                                            daoId: localStorage.getItem('daoId') || '',
                                            onboarding: true,
                                            member_id: member_id,
                                            updated_by: member_id,
                                            memberOnboarded: true,
                                        })
                                            .unwrap()
                                            .then(() => {
                                                mixpanel.track('connected_apps_admin', {
                                                    member_id: member_id,
                                                    dao_id: localStorage.getItem('daoId') || '',
                                                    apps: sessionStorage.getItem('apps') || '',
                                                });
                                                mixpanel.track('signup', {
                                                    member_id: member_id,
                                                    dao_id: localStorage.getItem('daoId') || '',
                                                    account_type: account_type,
                                                });
                                                sessionStorage.removeItem('new');
                                                sessionStorage.removeItem('apps');
                                                navigate('/dashboard/1');
                                                toast(
                                                    'Success',
                                                    10000,
                                                    'Initial onboarding successful. Please navigate to settings to complete your profile.',
                                                    ''
                                                )();
                                            });
                                    } catch (err) {
                                        setLoading(false);
                                        toast('Failure', 5000, 'Please Try Again', '')();
                                        console.log(err);
                                    }
                                })
                                .catch((err) => {
                                    setLoading(false);
                                    toast('Failure', 5000, 'Please Try Again', '')();
                                    console.log(err);
                                    return;
                                });
                        } else {
                            try {
                                adminOboarded({
                                    daoId: localStorage.getItem('daoId') || '',
                                    onboarding: true,
                                    member_id: member_id,
                                    updated_by: member_id,
                                    memberOnboarded: true,
                                })
                                    .unwrap()
                                    .then(() => {
                                        mixpanel.track('connected_apps_admin', {
                                            member_id: member_id,
                                            dao_id: localStorage.getItem('daoId') || '',
                                            apps: sessionStorage.getItem('apps') || '',
                                        });
                                        mixpanel.track('signup', {
                                            member_id: member_id,
                                            dao_id: localStorage.getItem('daoId') || '',
                                            account_type: account_type,
                                        });
                                        sessionStorage.removeItem('new');
                                        sessionStorage.removeItem('apps');
                                        navigate(
                                            '/' + localStorage.getItem('daoId') + '/dashboard/1'
                                        );
                                        toast(
                                            'Success',
                                            10000,
                                            'Initial onboarding successful. Please navigate to settings to complete your profile.',
                                            ''
                                        )();
                                    });
                            } catch (err) {
                                setLoading(false);
                                toast('Failure', 5000, 'Please Try Again', '')();
                                console.log(err);
                            }
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.log(err);
                        toast('Failure', 5000, 'Please Try Again', '')();
                        return;
                    });
            } else if (account_type !== 'admin') {
                setLoading(true);
                onboardingUpdate(payload)
                    .unwrap()
                    .then((res) => {
                        console.log(res);
                        mixpanel.track('profile_setup_contributor', {
                            member_id: member_id,
                            twitterSocial: twitterSocial ? twitterSocial : null,
                            dribbleSocial: dribbleSocial ? dribbleSocial : null,
                            behanceSocial: behanceSocial ? behanceSocial : null,
                            mirrorSocial: mirrorSocial ? mirrorSocial : null,
                            fiverrSocial: fiverrSocial ? fiverrSocial : null,
                        });
                        mixpanel.track('connected_apps_contributor', {
                            member_id: member_id,
                            apps: sessionStorage.getItem('apps'),
                        });
                        mixpanel.track('signup', {
                            member_id: member_id,
                            account_type: account_type,
                            timestamp: new Date().toUTCString(),
                        });

                        sessionStorage.removeItem('new');
                        sessionStorage.removeItem('apps');
                        navigate(`/${member_id}/profile`);
                        toast(
                            'Success',
                            10000,
                            'Initial onboarding successful. Please navigate to settings to complete your profile.',
                            ''
                        )();
                    })
                    .catch((err) => {
                        setLoading(false);
                        toast('Failure', 5000, 'Please Try Again', '')();
                        console.log(err);
                        return;
                    });
            }
        } else {
            if (account_type !== 'admin') {
                checkUserName(state.nickname.toLowerCase().trim())
                    .unwrap()
                    .then((res) => {
                        if (!res.data?.exist) setStep(step + 1);
                    })
                    .catch((err) => {
                        toast('Failure', 5000, 'Please Try Again', '')();
                        console.log(err);
                        return;
                    });
            } else {
                setStep(step + 1);
            }
        }
    };
    useEffect(() => {
        const localData = localStorage.getItem('account_type');
        if (localData === 'admin') onChangeStep();
    }, []);

    return (
        <Modal className="profile-setup" data-anlaytics-click="profile_setup_modal">
            <header className="profile-setup__header">
                {step !== 1 && account_type !== 'admin' && <BackButton onClick={onPrevStep} />}
            </header>
            <ModalTitle
                icon="/img/icons/setup.png"
                suptitle={`step ${step}/2`}
                title={account_type === 'admin' ? step_titles2[step - 1] : step_titles1[step - 1]}
            />
            {step === 1 && account_type !== 'admin' && (
                <SetupImgName
                    onOpenOpensea={() => setOpenOpensea(true)}
                    state={state}
                    setState={setState}
                    setEnableNext={setEnableNext}
                />
            )}
            {/* {step === 2 && <SetupBiography state={state} setState={setState} />} */}
            {step === 2 && account_type === 'admin' && (
                <SetupSkills state={state} setState={setState} setEnableNext={setEnableNext} />
            )}
            {step === 2 && account_type !== 'admin' && (
                <SetupSocials state={state} setState={setState} />
            )}
            <div className="modal-controls profile-setup__controls">
                {/* <ControlButton title="Skip" onClick={onChangeStep} variant="outline" /> */}
                <ControlButton
                    title={loading ? 'Loading' : 'Next'}
                    onClick={onChangeStep}
                    disabled={!enableNext || loading}
                />
            </div>
            <SetupOpensea
                active={openOpensea}
                onClose={() => setOpenOpensea(false)}
                state={state}
                setState={setState}
            />
        </Modal>
    );
};

export default ProfileSetup;
