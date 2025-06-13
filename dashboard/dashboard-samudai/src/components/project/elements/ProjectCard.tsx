import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import {
    addPinnedProject,
    changeProjectid,
    removePinnedProject,
} from 'store/features/common/slice';
import { useUpdatePinnedMutation } from 'store/services/projects/totalProjects';
import { useTypedDispatch } from 'hooks/useStore';
import ProgressLine from 'ui/Progress/Progress';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import BookIcon from 'ui/SVG/BookIcon';
import LockIcon from 'ui/SVG/LockIcon';
import PeopleIcon from 'ui/SVG/PeopleIcon';
import TextOverflow from 'ui/TextOverflow/TextOverflow';
import { cutText } from 'utils/format';
import { toast } from 'utils/toast';
import { ProjectVisibilty } from 'utils/types/Project';
import { getMemberId } from 'utils/utils';
import styles from '../styles/ProjectCard.module.scss';

interface ProjectCardProps {
    className?: string;
    component?: keyof JSX.IntrinsicElements;
    variant?: 'row' | 'block';
    department?: boolean;
    project: ProjectResponse;
    visibility?: ProjectEnums.Visibility;
    isPin?: boolean;
    pinned?: boolean;
    board?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    className,
    project,
    variant = 'block',
    component: Component = 'div',
    department,
    visibility = ProjectVisibilty.PUBLIC,
    isPin,
    pinned,
    board = false,
}) => {
    const [bookmark, setBookmark] = useState<boolean>(project?.pinned || false);
    const [updatePinned] = useUpdatePinnedMutation();
    const { daoid } = useParams();
    const progress =
        project?.task_count === 0
            ? 0
            : ((project?.completed_task_count || 0) * 100) / (project?.task_count || 0);

    const isPrivate = project?.visibility === 'private' && !board;
    const navigate = useNavigate();
    const dispatch = useTypedDispatch();

    const handlePinned = async (e: any) => {
        e.stopPropagation();
        setBookmark(!bookmark);
        const newB = !bookmark;
        try {
            const res = await updatePinned({
                projectId: project?.project_id || '',
                pinned: !bookmark,
                linkId: project.link_id,
                updatedBy: getMemberId(),
            }).unwrap();
            if (newB) {
                dispatch(addPinnedProject({ pinned: project.project_id! }));
            } else {
                dispatch(removePinnedProject({ pinned: project.project_id! }));
            }
        } catch (err: any) {
            setBookmark(bookmark);
            toast('Failure', 5000, 'error', err?.data?.message)();
        }
    };

    useEffect(() => {
        setBookmark(project?.pinned || false);
    }, [project]);

    return (
        <Component
            className={clsx(
                styles.root,
                variant === 'block' ? styles.rootBlock : styles.rootRow,
                className
            )}
            onClick={() => {
                console.log('project', project);
                if (isPrivate) {
                    toast('Attention', 5000, 'Unable to open project', 'This project is private');
                    return;
                } else if (
                    project.project_type === ProjectEnums.ProjectType.INTERNAL ||
                    project.project_type === ProjectEnums.ProjectType.DEFAULT
                ) {
                    dispatch(changeProjectid({ projectid: project.project_id! }));
                    setTimeout(() => {
                        navigate(`/${project?.link_id}/projects/${project.project_id}/board`);
                    }, 100);
                } else if (project.project_type === ProjectEnums.ProjectType.INVESTMENT) {
                    dispatch(changeProjectid({ projectid: project.project_id! }));
                    setTimeout(() => {
                        navigate(
                            `/${project?.link_id}/projects/${project.project_id}/investmentboard`
                        );
                    }, 100);
                }
            }}
        >
            <div className={styles.wrapper} data-role="wrapper">
                {variant === 'block' ? (
                    <React.Fragment>
                        {isPrivate && (
                            <div className={styles.header} data-role="header">
                                <h4
                                    className={clsx(styles.headerName, styles.headerNameNoMg)}
                                    data-role="title"
                                >
                                    {project?.title}
                                </h4>
                                <LockIcon className={styles.lock} />
                            </div>
                        )}
                        {!isPrivate && (
                            <div className={styles.header} data-role="header">
                                <div className={styles.headerLeft}>
                                    <BookIcon className={styles.headerIcon} />
                                    <TextOverflow className={styles.headerName}>
                                        {cutText(project.title, 20)}
                                    </TextOverflow>
                                </div>
                                {/* <div>Department: {project.department}</div> */}
                                <button className={clsx(bookmark ? styles.btn1 : styles.btn)}>
                                    {!isPin ? (
                                        // <PenIcon
                                        //   onClick={() => {
                                        //     dispatch(changeShowSettings({ showSettings: true }));
                                        //   }}
                                        // />
                                        <></>
                                    ) : (
                                        <ArchiveIcon onClick={(e) => handlePinned(e)} />
                                    )}
                                </button>
                            </div>
                        )}

                        <ul className={styles.info} data-role="info">
                            <li
                                className={
                                    clsx()
                                    // styles.infoItem,
                                    // styles.infoItemTasks,
                                    // styles.infoItemActive
                                }
                                data-role="info-task"
                            >
                                <h5 className={styles.infoName}>Task</h5>
                                <p className={styles.infoValue}>
                                    <span>{project?.task_count}</span>
                                </p>
                            </li>
                            {/* <li
                className={clsx(styles.infoItem, styles.infoItemHours)}
                data-role="info-hours"
              >
                <h5 className={styles.infoName}>Hours</h5>
                <p className={styles.infoValue}>
                  <span>{hours}</span>
                </p>
              </li> */}
                            {!isPrivate && (
                                <li
                                    className={clsx(styles.infoItem, styles.infoItemProgress)}
                                    data-role="info-progress"
                                >
                                    <h5 className={styles.infoName}>Project Progress</h5>
                                    <ProgressLine
                                        className={styles.progressLine}
                                        percent={+progress.toFixed(0)}
                                    />
                                </li>
                            )}
                        </ul>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className={styles.left} data-role="left">
                            <BookIcon className={styles.headerIcon} />
                            <TextOverflow className={styles.headerName}>
                                {project.title}
                            </TextOverflow>
                            {/* <p className={styles.infoValue} style={{ marginLeft: '10px' }}>
                <span>{project?.task_count}</span>
              </p> */}
                            <button className={clsx(bookmark ? styles.btn1 : styles.btn)}>
                                {!isPin ? (
                                    // <PenIcon
                                    //   onClick={() => {
                                    //     dispatch(changeShowSettings({ showSettings: true }));
                                    //   }}
                                    // />
                                    <></>
                                ) : (
                                    <ArchiveIcon onClick={(e) => handlePinned(e)} />
                                )}
                            </button>
                        </div>
                        <div className={styles.center} data-role="center">
                            <ul
                                className={clsx(
                                    styles.rowInfo,
                                    department && styles.rowInfoWithDepartment,
                                    isPrivate && styles.rowInfoPrivate
                                )}
                            >
                                {!isPrivate ? (
                                    <>
                                        <li
                                            className={clsx(
                                                styles.rowInfoItem,
                                                styles.rowInfoItemProgress
                                            )}
                                        >
                                            <p className={styles.rowInfoText}>Project Progress</p>
                                            <ProgressLine
                                                className={styles.rowInfoProgressLine}
                                                percent={progress}
                                            />
                                        </li>
                                        {department && (
                                            <li
                                                className={clsx(
                                                    styles.rowInfoItem,
                                                    styles.rowInfoItemDepartment
                                                )}
                                            >
                                                <p
                                                    className={clsx(
                                                        styles.rowInfoText,
                                                        styles.rowInfoTextName
                                                    )}
                                                >
                                                    Department
                                                </p>
                                                <p className={styles.rowInfoText}>
                                                    {project.department}
                                                </p>
                                            </li>
                                        )}
                                    </>
                                ) : (
                                    <li
                                        className={clsx(
                                            styles.rowInfoItem,
                                            styles.rowInfoItemDepartment
                                        )}
                                    >
                                        <LockIcon className={styles.lock} />
                                        <p className={styles.private}>Private</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className={styles.right} data-role="right">
                            <ul className={styles.rowStats}>
                                <li className={styles.rowStatsItem}>
                                    <PeopleIcon className={styles.rowStatsIcon} />
                                    <p className={styles.rowStatsValue}>
                                        {project?.contributor_list?.length}
                                    </p>
                                </li>
                                {/* <li className={styles.rowStatsItem}>
                  <CommentsIcon className={styles.rowStatsIcon} />
                  <p className={styles.rowStatsValue}>{comments.length}</p>
                </li>
                <li className={clsx(styles.rowStatsItem, styles.rowStatsItemActive)}>
                  <Notification className={styles.rowStatsIcon} />
                </li> */}
                            </ul>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </Component>
    );
};

export default ProjectCard;
