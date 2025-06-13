import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import Sprite from 'components/sprite';
import css from './new-progress-bar.module.scss';
import { useNavigate } from 'react-router-dom';
import { selectActiveDao, selectDaoProgress } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';
import { ClaimSubdomainModal } from 'components/@pages/new-onboarding';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';

const DaoProgress: React.FC = () => {
    const [showProgess, setShowProgress] = useState(false);

    const navigate = useNavigate();
    const subdomainModal = usePopup();
    const activeDao = useTypedSelector(selectActiveDao);
    const progress = useTypedSelector(selectDaoProgress);

    const total = Object.keys(ActivityEnums.NewDAOItems).length - 1;

    const currProgress = useMemo(() => {
        let level = 0;
        if (progress) {
            for (const key in ActivityEnums.NewDAOItems) {
                const value =
                    ActivityEnums.NewDAOItems[key as keyof typeof ActivityEnums.NewDAOItems];
                if (progress[value] && value !== ActivityEnums.NewDAOItems.CLAIM_SUBDOMAIN) {
                    level = level + 1;
                }
            }
        }
        if (level < total) {
            setShowProgress(true);
        } else {
            setShowProgress(false);
        }
        return level;
    }, [progress]);

    if (!showProgess) {
        return <></>;
    }

    return (
        <div className={css.progress}>
            <ul className={css.bar}>
                {Array.from({ length: total + 1 }).map((_, id) => (
                    <li
                        className={clsx(css.bar_item, id <= currProgress && css.bar_itemActive)}
                        key={id}
                    />
                ))}
            </ul>

            <div className={css.header_container}>
                <h3 className={css.title}>Complete your onboarding to unlock your subdomain</h3>
                <span>{total - currProgress} more steps to Claim DAO Subdomain</span>
            </div>

            <p className={css.text}>
                Your community needs to learn more about you to function better
            </p>

            <div className={css.controls_wrapper}>
                <div className={css.controls}>
                    {!progress?.setup_dao_profile && (
                        <button
                            className={css.controls_btn}
                            onClick={() => navigate(`/${activeDao}/settings/dao`)}
                        >
                            <Sprite url="/img/sprite.svg#add-item" />
                            <span>Set up DAO Profile</span>
                        </button>
                    )}
                    {!progress?.complete_integrations && (
                        <button
                            className={css.controls_btn}
                            onClick={() => navigate(`/${activeDao}/settings/dao/integrations`)}
                        >
                            <Sprite url="/img/sprite.svg#add-item" />
                            <span>Complete Integrations</span>
                        </button>
                    )}
                    {!progress?.create_a_project && (
                        <button
                            className={css.controls_btn}
                            onClick={() => navigate(`/${activeDao}/projects`)}
                        >
                            <Sprite url="/img/sprite.svg#add-item" />
                            <span>Create a Project</span>
                        </button>
                    )}
                    {!progress?.connect_safe && (
                        <button
                            className={css.controls_btn}
                            onClick={() => navigate(`/${activeDao}/settings/dao/integrations`)}
                        >
                            <Sprite url="/img/sprite.svg#add-item" />
                            <span>Connect Safe</span>
                        </button>
                    )}
                    {!progress?.connect_snapshot && (
                        <button
                            className={css.controls_btn}
                            onClick={() => navigate(`/${activeDao}/settings/dao/integrations`)}
                        >
                            <Sprite url="/img/sprite.svg#add-item" />
                            <span>Connect Snapshot</span>
                        </button>
                    )}
                    {!progress?.connect_discord && (
                        <button
                            className={css.controls_btn}
                            onClick={() => navigate(`/${activeDao}/settings/dao/integrations`)}
                        >
                            <Sprite url="/img/sprite.svg#add-item" />
                            <span>Connect Discord Server</span>
                        </button>
                    )}
                </div>
                <div>
                    <button
                        className={clsx(css.controls_btn, css.controls_call)}
                        onClick={() =>
                            window.open(
                                'https://calendly.com/kushagra_agarwal/talk-to-us',
                                '_blank'
                            )
                        }
                    >
                        <Sprite url="/img/sprite.svg#call" />
                        <span>Set up a Call</span>
                    </button>
                </div>
            </div>

            <PopupBox
                active={subdomainModal.active}
                onClose={subdomainModal.close}
                children={<ClaimSubdomainModal type="dao" onClose={subdomainModal.close} />}
            />
        </div>
    );
};

export default DaoProgress;
