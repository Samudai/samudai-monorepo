import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { changeProjectid, selectAccessList } from 'store/features/common/slice';
import {
    useGetSubTasksByProjectIdQuery,
    useUpdateProjectMutation,
} from 'store/services/projects/totalProjects';
import { useClickOutside } from 'hooks/useClickOutside';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { groupByStatus } from 'components/@pages/projects/lib';
import { BoardGroupByEnum, ProjectOption } from 'components/@pages/projects/types';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import TaskAddColumn from 'components/@popups/TaskAdd/TaskAddColumn';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import ProjectAttachments from 'components/project/ProjectAttachments';
import ProjectSettings from 'components/project/ProjectSettings';
import { TasksBoard } from 'components/tasks-board';
import { useTasks } from 'components/tasks-board/lib/hooks';
import Button from 'ui/@buttons/Button/Button';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import SettingsIcon from 'ui/SVG/Settings';
import Head from 'ui/head';
import { toast } from 'utils/toast';
import { IMember } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import css from './projects-board.module.scss';
import dayjs from 'dayjs';

const ProjectsBoard: React.FC = () => {
    const [groupBy, setGroupBy] = useState(BoardGroupByEnum.STATUS);
    const [optionActive, setOptionActive] = useState<ProjectOption>(null);
    const [reviewer, setReviewer] = useState<IMember>();
    const [check, setCheck] = useState(false);

    const { daoid, projectId } = useParams();
    const { projectData, tasks, isLoading, updateTask, contributors, deleteTask } = useTasks();
    const { data: subTasksData } = useGetSubTasksByProjectIdQuery(projectId!);
    const attachmentsPopup = usePopup();
    const settingsPopup = usePopup();
    const columnModal = usePopup();
    const dispatch = useTypedDispatch();
    const [updateProject] = useUpdateProjectMutation();
    const ref = useClickOutside<HTMLDivElement>(() => {
        handleUpdateReviewer();
        setCheck(false);
    });
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT) ||
            projectData?.project.poc_member_id === getMemberId(),
        [daoid, projectData]
    );

    useEffect(() => {
        if (projectData?.project.project_id) {
            dispatch(changeProjectid({ projectid: projectData?.project.project_id }));
        }
        if (projectData?.project?.poc_member) {
            setReviewer(projectData?.project?.poc_member);
        }
    }, [projectData]);

    if (isLoading || !projectData) return <Loader />;

    const handleOption = (option: ProjectOption) => {
        if (option === optionActive) setOptionActive(null);
        else setOptionActive(option);
    };

    const handleUpdateReviewer = () => {
        if (!check) return;

        const payload = {
            project: {
                ...projectData.project,
                poc_member_id: reviewer?.member_id,
                updated_by: getMemberId(),
            },
        };

        updateProject(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Reviewers updated successfully', '')();
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to update reviewers', '')();
            });
    };

    return (
        <div className={css.board} data-analytics-page="dao_project_board">
            <Head
                classNameRoot={css.board_headComponent}
                breadcrumbs={[
                    { name: 'Workspace' },
                    { name: 'Projects', href: `/${daoid}/projects` },
                    {
                        name: projectData.project.title,
                        href: `/${daoid}/projects/${projectData.project.project_id}`,
                        disabled: true,
                    },
                ]}
                breadcrumbsComp={
                    <p className={css.lastUpdated}>
                        Last Updated{' '}
                        <span>{dayjs(projectData?.project?.updated_at).fromNow()}</span>
                    </p>
                }
            >
                <div className={css.board_head} data-analytics-parent="project_board_header">
                    <div className={css.board_head_up}>
                        <Head.Title title={projectData.project.title} />

                        <div className={css.board_head_panel}>
                            <h3 className={css.board_head_title}>Reviewer</h3>
                            <div ref={ref}>
                                <ProjectsMember
                                    single
                                    className={css.board_head_reviewer}
                                    values={reviewer ? [reviewer] : []}
                                    size={36}
                                    onChange={([member]) => {
                                        setReviewer(member);
                                        setCheck(true);
                                    }}
                                    disabled={!access}
                                />
                            </div>

                            {access && (
                                <>
                                    <Button
                                        className={css.board_addColumnBtn}
                                        onClick={columnModal.open}
                                        color="transparent"
                                        data-analytics-click="project_board_add_column"
                                    >
                                        <PlusIcon />
                                        <span>New Column</span>
                                    </Button>

                                    <Button
                                        className={clsx(
                                            css.board_addNewJob,
                                            optionActive === 'create-job' &&
                                                css.board_addNewJobActive
                                        )}
                                        onClick={handleOption.bind(null, 'create-job')}
                                        isLoading={!tasks.length}
                                        data-analytics-click="project_board_post_as_job"
                                        color="green"
                                    >
                                        <span>Post as Job</span>
                                    </Button>

                                    <Button
                                        className={clsx(
                                            css.board_payoutBtn,
                                            optionActive === 'payout' && css.board_payoutBtnActive
                                        )}
                                        onClick={handleOption.bind(null, 'payout')}
                                        isLoading={!tasks.length}
                                        data-analytics-click="project_board_payout"
                                        color="orange"
                                    >
                                        <span>Payout</span>
                                    </Button>

                                    <button
                                        className={css.board_iconBtn}
                                        onClick={attachmentsPopup.open}
                                        data-analytics-click="project_board_attachments"
                                    >
                                        <AttachmentIcon />
                                    </button>

                                    <button
                                        className={css.board_iconBtn}
                                        onClick={settingsPopup.open}
                                        data-analytics-click="project_board_settings"
                                    >
                                        <SettingsIcon />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={css.board_group}>
                        {Object.values(BoardGroupByEnum).map((group) => (
                            <button
                                className={clsx(
                                    css.board_group_btn,
                                    group === groupBy && css.board_group_btnActive
                                )}
                                onClick={() => setGroupBy(group)}
                                data-analytics-click={`project_board_layout_${group}`}
                                key={group}
                            >
                                <span>{group}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Head>
            <div className={css.board_tasks} data-analytics-parent="dao_projects_task_board">
                <div className="container">
                    {projectData?.project && (
                        <TasksBoard
                            groupBy={groupBy}
                            items={tasks}
                            columns={projectData.project.columns || []}
                            project={projectData.project}
                            option={optionActive}
                            onChangeOption={handleOption}
                            onUpdate={updateTask}
                            onDelete={deleteTask}
                        />
                    )}
                </div>
            </div>
            {projectData?.project && (
                <>
                    <PopupBox
                        active={attachmentsPopup.active}
                        onClose={attachmentsPopup.close}
                        children={
                            <ProjectAttachments
                                onClose={attachmentsPopup.close}
                                project={projectData.project}
                            />
                        }
                    />
                    <PopupBox
                        active={settingsPopup.active}
                        onClose={settingsPopup.close}
                        children={
                            <ProjectSettings
                                onClose={settingsPopup.close}
                                project={projectData.project}
                                members={contributors || []}
                            />
                        }
                    />
                    <PopupBox active={columnModal.active} onClose={columnModal.close}>
                        <TaskAddColumn
                            close={columnModal.close}
                            columns={projectData.project.columns || []}
                            status={
                                groupByStatus(projectData.project.columns || [], tasks)[0]?.data ||
                                []
                            }
                            subtaskStatus={
                                groupByStatus(
                                    projectData.project.columns || [],
                                    subTasksData?.data?.subtasks || []
                                )[0]?.data || []
                            }
                            projectData={projectData.project}
                        />
                    </PopupBox>
                </>
            )}

            {/* <PopupBox 
                active
                onClose={() => {}}
                children={<TaskCompletedModal />}
            /> */}
        </div>
    );
};

export default ProjectsBoard;
