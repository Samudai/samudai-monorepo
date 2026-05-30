import { Skeleton } from 'components/new-skeleton';
import Sprite from 'components/sprite';
import React from 'react';
import Button from 'ui/@buttons/Button/Button';
import { DaoJobsItem } from '../dao-jobs-item';
import { DaoBlockSkeleton } from '../dao-skeleton';
import css from './dao-jobs.module.scss';
import useFetchDao from 'components/@pages/new-discovery/lib/hooks/use-fetch-dao';
import { useNavigate } from 'react-router-dom';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import usePopup from 'hooks/usePopup';
import clsx from 'clsx';

interface DaoJobsProps {}

export const DaoJobs: React.FC<DaoJobsProps> = (props) => {
    const { daoData, jobsList, jobsLoading, isMember } = useFetchDao();
    const navigate = useNavigate();
    const jobsModal = usePopup();

    if (jobsLoading) {
        return (
            <>
                <Skeleton
                    styles={{
                        maxWidth: 155,
                        height: 33,
                        borderRadius: 5,
                        marginBottom: 16,
                    }}
                />

                <ul className={css.list}>
                    <li className={css.list_item}>
                        <DaoBlockSkeleton />
                    </li>

                    <li className={css.list_item}>
                        <DaoBlockSkeleton />
                    </li>
                </ul>
            </>
        );
    }

    return (
        <div className={css.root}>
            <div className={css.head}>
                <h3 className={css.head_title}>Recent Jobs</h3>
                <button
                    className={css.head_link}
                    onClick={() => jobsList.length && jobsModal.open()}
                >
                    <Sprite url="/img/sprite.svg#arrow-send" />
                </button>
            </div>

            <div className={css.content}>
                {!jobsList.length && (
                    <div className={css.empty}>
                        <img
                            className={css.empty_img}
                            src="/img/icons/briefcase-account.svg"
                            alt="icon"
                        />
                        <p className={css.empty_text}>
                            {daoData?.name} has no active jobs/bounties.
                        </p>
                        {isMember && (
                            <Button
                                className={css.empty_btn}
                                color="orange-outlined"
                                onClick={() => navigate('/jobs/tasks')}
                            >
                                <span>Create a Job/Bounty</span>
                            </Button>
                        )}
                    </div>
                )}

                {!!jobsList.length && (
                    <ul className={css.list}>
                        {jobsList.slice(0, 2).map((item) => (
                            <li className={css.list_item} key={item.id}>
                                <DaoJobsItem data={item} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <PopupBox active={jobsModal.active} onClose={jobsModal.toggle}>
                <Popup className={css.popup_root}>
                    <PopupTitle
                        className={css.popup_title}
                        title="Recent Jobs"
                        icon="/img/icons/magnifier.png"
                    />
                    <ul className={clsx(css.list, css.popup_list)}>
                        {jobsList.map((item) => (
                            <li className={css.list_item} key={item.id}>
                                <DaoJobsItem data={item} />
                            </li>
                        ))}
                    </ul>
                </Popup>
            </PopupBox>
        </div>
    );
};
