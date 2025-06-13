import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Capabilities from 'components/@pages/onboarding/capabilities/capabilities';
import Complete from 'components/@pages/onboarding/complete/complete';
import ConnectApps from 'components/@pages/onboarding/connect-apps/connect-apps';
import ConnectWallet from 'components/@pages/onboarding/connect-wallet/connect-wallet';
import CreateDepartment from 'components/@pages/onboarding/create-department/create-department';
import DashbaordTutorial from 'components/@pages/onboarding/dashboard-tutorial/dashboard-tutorial';
import StartAs from 'components/@pages/onboarding/start-as/start-as';
import { OnboardingFormData, OnboardingScreens } from 'utils/types/onboarding';
import styles from 'styles/pages/onboarding.module.scss';

const getFormData = () =>
    ({
        startAs: null,
        department: [],
        capabilities: [],
        turnedWidget: false,
        movedWidget: false,
    }) as OnboardingFormData;

const Onboarding: React.FC = (props) => {
    const [formData, setFormData] = useState(getFormData());
    const [screen, setScreen] = useState(OnboardingScreens.CONNECT_WALLET);

    return (
        <div className={styles.onboarding} data-analytics-page="old_onboarding">
            <SwitchTransition mode="out-in">
                <CSSTransition key={screen} classNames={styles} timeout={500}>
                    <React.Fragment>
                        {screen === OnboardingScreens.CONNECT_WALLET && (
                            <ConnectWallet
                                onNext={setScreen.bind(null, OnboardingScreens.START_AS)}
                            />
                        )}
                        {screen === OnboardingScreens.START_AS && (
                            <StartAs
                                value={formData.startAs}
                                onChange={(val) => setFormData({ ...formData, startAs: val })}
                                onBack={setScreen.bind(null, OnboardingScreens.CONNECT_WALLET)}
                                onNext={setScreen.bind(null, OnboardingScreens.CONNECT_APPS)}
                            />
                        )}
                        {screen === OnboardingScreens.CONNECT_APPS && (
                            <ConnectApps
                                onBack={setScreen.bind(null, OnboardingScreens.START_AS)}
                                onNext={setScreen.bind(null, OnboardingScreens.CREATE_DEPARTMENT)}
                            />
                        )}
                        {screen === OnboardingScreens.CREATE_DEPARTMENT && (
                            <CreateDepartment
                                values={formData.department}
                                onChange={(values) =>
                                    setFormData({ ...formData, department: values })
                                }
                                onBack={setScreen.bind(null, OnboardingScreens.CONNECT_APPS)}
                                onNext={setScreen.bind(null, OnboardingScreens.CAPABILITIES)}
                            />
                        )}
                        {screen === OnboardingScreens.CAPABILITIES && (
                            <Capabilities
                                values={formData.capabilities}
                                onChange={(values) =>
                                    setFormData({ ...formData, capabilities: values })
                                }
                                onBack={setScreen.bind(null, OnboardingScreens.CREATE_DEPARTMENT)}
                                onNext={setScreen.bind(null, OnboardingScreens.DASHBOARD_TUTORIAL)}
                            />
                        )}
                        {screen === OnboardingScreens.DASHBOARD_TUTORIAL && (
                            <DashbaordTutorial
                                onBack={setScreen.bind(null, OnboardingScreens.CAPABILITIES)}
                                onNext={setScreen.bind(null, OnboardingScreens.COMPLETED)}
                            />
                        )}
                        {screen === OnboardingScreens.COMPLETED && <Complete />}
                    </React.Fragment>
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
};

export default Onboarding;
