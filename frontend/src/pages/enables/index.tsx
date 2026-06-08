import logoAsset from 'images/logo.png';
import { Marquee } from 'components/marquee-highlight';
import React, { useEffect } from 'react';
import { OnboardingLayout } from 'root/layouts/onboarding-layout';
import css from './enables.module.scss';
import { getEnablesWordList } from './utils';
import { getMemberId } from 'utils/utils';
import { useNavigate } from 'react-router-dom';
import { useLazyGetTrialDaoQuery } from 'store/services/Dao/dao';

const Enables: React.FC = () => {
    const type = localStorage.getItem('enablesType');
    const navigate = useNavigate();
    const [getTrialDao] = useLazyGetTrialDaoQuery();

    useEffect(() => {
        const redirect = async () => {
            if (type === 'trial') {
                try {
                    const response = await getTrialDao().unwrap();
                    const trialDaoId = response.data?.dao?.dao_id;
                    if (trialDaoId) {
                        navigate(`/${trialDaoId}/dashboard/1`);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (type === 'dao') {
                window.location.href = `/dashboard/1`;
            } else if (type === 'contributor') {
                window.location.href = `/${getMemberId()}/profile`;
                localStorage.setItem('showTutorial', 'true');
            }
            localStorage.removeItem('enablesType');
        };
        setTimeout(redirect, 6000);
    }, [type]);

    if (!type) {
        window.location.reload();
        window.location.href = `/login`;
        return <></>;
    } else {
        return (
            <OnboardingLayout progress={5}>
                <div className={css.content}>
                    <div className={css.left}>
                        <img className={css.logo} src={logoAsset} alt="" />

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
