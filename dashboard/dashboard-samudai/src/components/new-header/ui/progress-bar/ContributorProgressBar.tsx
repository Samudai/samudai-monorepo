import React from 'react';
import { DaoProgressbar } from 'components/@pages/discovery-dao';
import { useTypedSelector } from 'hooks/useStore';
import daoCss from 'pages/discovery/dao/dao.module.scss';
import { useNavigate } from 'react-router-dom';
import { selectMember, selectMemberSubdomainClaimed } from 'store/features/common/slice';
import { getMemberId } from 'utils/utils';

interface ContributorProgressBarProps {
    contributorProgress: number;
    subdomainOnClick: () => void;
    nftOnClick: () => void;
}

export const ContributorProgressBar: React.FC<ContributorProgressBarProps> = ({
    contributorProgress,
    subdomainOnClick,
    nftOnClick,
}) => {
    const accountData = useTypedSelector(selectMember);
    const navigate = useNavigate();
    const memberSubdomainClaimed = useTypedSelector(selectMemberSubdomainClaimed);

    return (
        <div className={daoCss.dao_progress}>
            <DaoProgressbar
                progress={contributorProgress}
                steps={[
                    <div
                        key="discord-connect"
                        className={daoCss.progress_item}
                        data-active={(contributorProgress as any) === 0}
                    >
                        <div className={daoCss.progress_icon}>
                            {contributorProgress >= 1 && (
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
                        data-active={(contributorProgress as any) === 1}
                    >
                        <div className={daoCss.progress_icon}>
                            {contributorProgress >= 2 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => navigate(`/${getMemberId()}/settings/contributor`)}
                            disabled={(contributorProgress as any) !== 1}
                            style={(contributorProgress as any) !== 1 ? { cursor: 'default' } : {}}
                        >
                            COMPLETE PROFILE
                        </button>
                    </div>,

                    <div
                        key="invite-friend"
                        className={daoCss.progress_item}
                        data-active={(contributorProgress as any) === 2}
                    >
                        <div className={daoCss.progress_icon}>
                            <div className={daoCss.progress_circle}>
                                {contributorProgress >= 3 && (
                                    <img src="/img/icons/mark.png" alt="mark" />
                                )}
                                {contributorProgress < 3 && (
                                    <img src="/img/icons/lightning.png" alt="mark" />
                                )}
                            </div>
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => {}}
                            disabled={(contributorProgress as any) !== 2}
                            style={(contributorProgress as any) !== 2 ? { cursor: 'default' } : {}}
                        >
                            INVITE A FRIEND
                        </button>
                        <button
                            className={daoCss.progress_link}
                            onClick={memberSubdomainClaimed ? subdomainOnClick : () => {}}
                            disabled={(contributorProgress as any) < 3}
                            style={(contributorProgress as any) < 3 ? { cursor: 'default' } : {}}
                        >
                            Get your Subdomain
                        </button>
                    </div>,

                    <div
                        key="connect-contributor"
                        className={daoCss.progress_item}
                        data-active={(contributorProgress as any) === 3}
                    >
                        <div className={daoCss.progress_icon}>
                            {contributorProgress >= 4 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => navigate(`/discovery/contributor`)}
                            disabled={(contributorProgress as any) !== 3}
                            style={(contributorProgress as any) !== 3 ? { cursor: 'default' } : {}}
                        >
                            CONNECT WITH 2 CONTRIBUTORS
                        </button>
                    </div>,

                    <div
                        key="explore-jobs"
                        className={daoCss.progress_item}
                        data-active={(contributorProgress as any) === 4}
                    >
                        <div className={daoCss.progress_icon}>
                            {contributorProgress >= 5 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <button
                            className={daoCss.progress_text}
                            onClick={() => navigate(`/jobs/tasks`)}
                            disabled={(contributorProgress as any) !== 3}
                            style={(contributorProgress as any) !== 3 ? { cursor: 'default' } : {}}
                        >
                            EXPLORE JOBS
                        </button>
                    </div>,

                    <div
                        key="nft-claim"
                        className={daoCss.progress_item}
                        data-active={(contributorProgress as any) === 5}
                    >
                        <div className={daoCss.progress_icon}>
                            {contributorProgress < 6 && (
                                <button
                                    className={daoCss.progress_square}
                                    onClick={nftOnClick}
                                    disabled={!((contributorProgress as any) === 5)}
                                    style={
                                        (contributorProgress as any) < 5
                                            ? { cursor: 'default' }
                                            : {}
                                    }
                                >
                                    <img
                                        src="/img/icons/contributor-nft.png"
                                        alt="mark"
                                        style={{ maxWidth: '90px' }}
                                    />
                                </button>
                            )}
                            {contributorProgress >= 6 && (
                                <div className={daoCss.progress_circle}>
                                    <img src="/img/icons/mark.png" alt="mark" />
                                </div>
                            )}
                        </div>

                        <p className={daoCss.progress_collab} style={{ maxWidth: 55 }}>
                            EXCLUSIVE NFT
                        </p>
                    </div>,
                ]}
            />
        </div>
    );
};
