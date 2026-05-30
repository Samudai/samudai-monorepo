import React from 'react';
import { DaoProgressbar } from 'components/@pages/discovery-dao';
import { useTypedSelector } from 'hooks/useStore';
import daoCss from 'pages/discovery/dao/dao.module.scss';
import { useNavigate } from 'react-router-dom';
import { selectActiveDao, selectDaoSubdomainClaimed } from 'store/features/common/slice';

interface DaoProgressBarProps {
    daoProgress: number;
    subdomainOnClick: () => void;
    collaborationOnClick: () => void;
}

export const DaoProgressBar: React.FC<DaoProgressBarProps> = ({
    daoProgress,
    subdomainOnClick,
    collaborationOnClick,
}) => {
    const activeDao = useTypedSelector(selectActiveDao);
    const daoSubdomainClaimed = useTypedSelector(selectDaoSubdomainClaimed);
    const navigate = useNavigate();

    return (
        <div className={daoCss.dao_progress}>
            <DaoProgressbar
                progress={daoProgress}
                steps={[
                    <div
                        key="discord-connect"
                        className={daoCss.progress_item}
                        data-active={(daoProgress as any) === 0}
                    >
                        <div className={daoCss.progress_icon}>
                            {daoProgress >= 1 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <p className={daoCss.progress_text}>DISCORD CONNECT</p>
                    </div>,

                    <div
                        key="complete-profile"
                        className={daoCss.progress_item}
                        data-active={(daoProgress as any) === 1}
                    >
                        <div className={daoCss.progress_icon}>
                            {daoProgress >= 2 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => navigate(`/${activeDao}/settings/dao`)}
                            disabled={(daoProgress as any) !== 1}
                            style={(daoProgress as any) !== 1 ? { cursor: 'default' } : {}}
                            data-analytics-click="complete_profile_button"
                        >
                            COMPLETE PROFILE
                        </button>
                    </div>,

                    <div
                        key="explore-dashboard"
                        className={daoCss.progress_item}
                        data-active={(daoProgress as any) === 2}
                    >
                        <div className={daoCss.progress_icon}>
                            {daoProgress >= 3 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => navigate(`/${activeDao}/dashboard/1`)}
                            disabled={(daoProgress as any) !== 2}
                            style={(daoProgress as any) !== 2 ? { cursor: 'default' } : {}}
                            data-analytics-click="explore_workspace_button"
                        >
                            EXPLORE WORKSPACE
                        </button>
                    </div>,

                    <div
                        key="invite-member"
                        className={daoCss.progress_item}
                        data-active={(daoProgress as any) === 3}
                    >
                        <div className={daoCss.progress_icon}>
                            <div className={daoCss.progress_circle}>
                                {daoProgress >= 4 && <img src="/img/icons/mark.png" alt="mark" />}
                                {daoProgress < 4 && (
                                    <img src="/img/icons/lightning.png" alt="mark" />
                                )}
                            </div>
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => {}}
                            disabled={(daoProgress as any) !== 3}
                            style={(daoProgress as any) !== 3 ? { cursor: 'default' } : {}}
                        >
                            INVITE A FRIEND
                        </button>
                        <button
                            className={daoCss.progress_link}
                            onClick={daoSubdomainClaimed ? subdomainOnClick : () => {}}
                            disabled={(daoProgress as any) < 3}
                            style={(daoProgress as any) < 3 ? { cursor: 'pointer' } : {}}
                        >
                            Get your Subdomain
                        </button>
                    </div>,

                    <div
                        key="create-project"
                        className={daoCss.progress_item}
                        data-active={(daoProgress as any) === 4}
                    >
                        <div className={daoCss.progress_icon}>
                            {daoProgress >= 5 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => navigate(`/${activeDao}/projects`)}
                            disabled={(daoProgress as any) !== 4}
                            style={(daoProgress as any) !== 4 ? { cursor: 'default' } : {}}
                        >
                            LET'S CREATE A PROJECT
                        </button>
                    </div>,

                    <div
                        key="explore-jobs"
                        className={daoCss.progress_item}
                        data-active={(daoProgress as any) === 5}
                    >
                        <div className={daoCss.progress_icon}>
                            {daoProgress >= 6 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => navigate(`/jobs/tasks`)}
                            disabled={(daoProgress as any) !== 5}
                            style={(daoProgress as any) !== 5 ? { cursor: 'default' } : {}}
                        >
                            EXPLORE JOBS
                        </button>
                    </div>,

                    <div
                        key="claim-collaboration"
                        className={daoCss.progress_item}
                        data-active={(daoProgress as any) === 6}
                    >
                        <div className={daoCss.progress_icon}>
                            {daoProgress < 7 && (
                                <button
                                    className={daoCss.progress_square}
                                    onClick={collaborationOnClick}
                                    disabled={!((daoProgress as any) === 6)}
                                    style={(daoProgress as any) < 6 ? { cursor: 'default' } : {}}
                                >
                                    <img src="/img/onboarding/collaboration-pass.png" alt="mark" />
                                </button>
                            )}
                            {daoProgress >= 7 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <p className={daoCss.progress_collab} style={{ maxWidth: 55 }}>
                            Collaboration Pass
                        </p>
                    </div>,
                ]}
            />
        </div>
    );
};
