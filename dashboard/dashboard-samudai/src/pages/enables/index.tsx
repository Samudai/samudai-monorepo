import { Marquee } from 'components/marquee-highlight';
import React, { useEffect } from 'react';
import { OnboardingLayout } from 'root/layouts/onboarding-layout';
import css from './enables.module.scss';
import { getEnablesWordList } from './utils';
import { getMemberId } from 'utils/utils';
import { useNavigate } from 'react-router-dom';

const Enables: React.FC = () => {
    const type = localStorage.getItem('enablesType');
    const trialDao = process.env.REACT_APP_TRIAL_DAO_ID!;
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            if (type === 'trial') {
                navigate(`/${trialDao}/dashboard/1`);
            } else if (type === 'dao') {
                window.location.href = `/dashboard/1`;
            } else if (type === 'contributor') {
                window.location.href = `/${getMemberId()}/profile`;
                localStorage.setItem('showTutorial', 'true');
            }
            localStorage.removeItem('enablesType');
        }, 6000);
    }, [type, trialDao]);

    if (!type) {
        window.location.reload();
        window.location.href = `/login`;
        return <></>;
    } else {
        return (
            <OnboardingLayout progress={5}>
                <div className={css.content}>
                    <div className={css.left}>
                        <img className={css.logo} src={require('assets/images/logo.png')} alt="" />

                        {type === 'trial' ? (
                            <h2 className={css.title}>
                                Loading <strong>Dashboard</strong> to explore
                            </h2>
                        ) : (
                            <h2 className={css.title}>
                                <strong>Samudai</strong> enables you to
                            </h2>
                        )}
                    </div>

                    <div className={css.right}>
                        <Marquee duration={1} words={getEnablesWordList(type)} />
                    </div>
                </div>
            </OnboardingLayout>
        );
    }
};

export default Enables;
