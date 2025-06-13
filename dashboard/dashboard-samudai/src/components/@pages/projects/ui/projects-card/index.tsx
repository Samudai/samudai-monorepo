import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../lib';
import { ProjectsMember } from '../projects-member';
import { AccessEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectAccessList } from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import ProjectUpdate from 'components/@popups/ProjectCreate/ProjectUpdate';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import BookIcon from 'ui/SVG/BookIcon';
import PenIcon from 'ui/SVG/PenIcon';
import Members from 'ui/new-members';
import ProjectProgress from 'ui/project-progress';
import { getMemberId } from 'utils/utils';
import css from './projects-card.module.scss';

interface ProjectsCardProps {
    className?: string;
    isBoard?: boolean;
    data: ProjectResponse;
    variant?: 'block' | 'row';
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({
    data,
    className,
    isBoard = false,
    variant = 'block',
}) => {
    const { bookmark, onNavigate, onPinned } = useProject(data, isBoard);
    const updateModal = usePopup();
    const { daoid } = useParams();
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT) ||
            data.poc_member_id === getMemberId(),
        [daoid, data]
    );

    return (
        <>
            <div
                className={clsx(className, css.card, css[`card_` + variant])}
                onClick={onNavigate}
                data-analytics-parent={`project_item_${data.project_id}`}
                data-analytics-click="project_item"
            >
                {variant === 'block' && (
                    <>
                        <header className={css.card_header}>
                            <BookIcon className={css.card_header_bookIcon} />
                            <h3 className={css.card_header_title}>{data.title || 'Unknown'}</h3>
                            {access && (
                                <div className={css.card_header_controls}>
                                    <button
                                        className={css.card_header_controls_btn}
                                        onClick={updateModal.open}
                                        data-analytics-click={`edit_project_pencil`}
                                    >
                                        <PenIcon />
                                    </button>
                                    <button
                                        className={clsx(
                                            css.card_header_controls_btn,
                                            bookmark && css.card_header_controls_btnActive
                                        )}
                                        data-button="archive"
                                        onClick={onPinned}
                                        data-analytics-click={`bookmark_project_button`}
                                    >
                                        <ArchiveIcon />
                                    </button>
                                </div>
                            )}
                        </header>
                        <ul className={css.card_info}>
                            <li className={css.card_info_item}>
                                <h4 className={css.card_info_title}>Reviewer:</h4>
                                <div className={css.card_info_value}>
                                    <div className={css.card_members}>
                                        {(data.contributor_list || []).length > 0 && (
                                            <Members
                                                maxShow={4}
                                                members={data.contributor_list || []}
                                                size={30}
                                            />
                                        )}
                                        {(data.contributor_list || []).length === 0 && (
                                            <ProjectsMember values={[]} size={30} />
                                        )}
                                    </div>
                                </div>
                            </li>
                            <li className={css.card_info_item}>
                                <h4 className={css.card_info_title}>Jobs Posted</h4>
                                <div className={css.card_info_value}>
                                    <p className={css.card_jobs}>{data.total_jobs_posted}</p>
                                </div>
                            </li>
                            <li className={css.card_info_item}>
                                <h4 className={css.card_info_title}>Progress</h4>
                                <div className={css.card_info_value}>
                                    <ProjectProgress
                                        done={data.completed_task_count || 0}
                                        total={data.task_count || 0}
                                    />
                                </div>
                            </li>
                        </ul>
                    </>
                )}
                {variant === 'row' && (
                    <>
                        <BookIcon className={css.card_header_bookIcon} />
                        <h3 className={css.card_header_title}>{data.title}</h3>
                        <ul className={css.card_list}>
                            <li className={css.card_list_item} style={{ width: '30%' }}>
                                <h4 className={css.card_list_title} data-gray>
                                    Contributors:
                                </h4>
                                <Members
                                    className={css.card_list_members}
                                    maxShow={4}
                                    members={data.contributor_list || []}
                                    size={36}
                                />
                            </li>
                            <li className={css.card_list_item}>
                                <h4 className={css.card_list_title}>Jobs Posted</h4>
                                <p className={css.card_list_value}>
                                    <p className={css.card_jobs}>{data.total_jobs_posted}</p>
                                </p>
                            </li>
                            <li className={css.card_list_item}>
                                <h4 className={css.card_list_title}>Progress</h4>
                                <p className={css.card_list_value}>
                                    <ProjectProgress
                                        done={data.completed_task_count || 0}
                                        total={data.task_count || 0}
                                    />
                                </p>
                            </li>
                        </ul>
                        {access && (
                            <div className={css.card_header_controls}>
                                <button
                                    className={css.card_header_controls_btn}
                                    onClick={updateModal.open}
                                    data-analytics-click={`edit_project_pencil`}
                                >
                                    <PenIcon />
                                </button>
                                <button
                                    className={clsx(
                                        css.card_header_controls_btn,
                                        bookmark && css.card_header_controls_btnActive
                                    )}
                                    data-button="archive"
                                    onClick={onPinned}
                                    data-analytics-click={`bookmark_project_button`}
                                >
                                    <ArchiveIcon />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <PopupBox
                active={updateModal.active}
                onClose={updateModal.close}
                children={<ProjectUpdate values={data} onClose={updateModal.close} />}
            />
        </>
    );
};
