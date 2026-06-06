import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { changeProjectid, selectAccessList } from 'store/features/common/slice';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import ProjectSettings from 'components/project/ProjectSettings';
import { useInvestment } from 'components/tasks-board/lib/hooks/use-investment';
import { TasksBoardInvestment } from 'components/tasks-board/ui/tasks-board-investment';
import SettingsIcon from 'ui/SVG/Settings';
import Head from 'ui/head';
import css from './projects-board.module.scss';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { getMemberId } from 'utils/utils';
import TaskAddColumn from 'components/@popups/TaskAdd/TaskAddColumn';
import { groupByStatus } from 'components/@pages/projects/lib';

const InvestmentBoard: React.FC = () => {
    const { projectData, taskData: tasks, isLoading, updateTask } = useInvestment();
    const settingsPopup = usePopup();
    const columnModal = usePopup();
    const { daoid } = useParams();
    const dispatch = useTypedDispatch();

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
    }, [projectData]);

    console.log(projectData);

    if (isLoading || !projectData) return <Loader />;

    return (
        <div className={css.board} data-analytics-page="dao_investment_board">
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
            >
                <div className={css.board_head}>
                    <div className={css.board_head_up}>
                        <Head.Title title={projectData.project.title} />

                        <div className={css.board_head_panel}>
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
                                    <button
                                        className={css.board_iconBtn}
                                        onClick={settingsPopup.open}
                                    >
                                        <SettingsIcon />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={css.board_group}>
                        <button className={clsx(css.board_group_btn, css.board_group_btnActive)}>
                            <span>By Status</span>
                        </button>
                    </div>
                </div>
            </Head>
            <div className={css.board_tasks}>
                <div className="container">
                    {projectData?.project && (
                        <TasksBoardInvestment
                            items={tasks}
                            columns={projectData.project.columns || []}
                            project={projectData.project}
                            onUpdate={updateTask}
                        />
                    )}
                </div>
            </div>
            {projectData?.project && (
                <>
                    <PopupBox
                        active={settingsPopup.active}
                        onClose={settingsPopup.close}
                        children={
                            <ProjectSettings
                                onClose={settingsPopup.close}
                                project={projectData.project}
                                members={projectData.project.contributor_list || []}
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
                                groupByStatus(projectData.project.columns || [], [])[0]?.data || []
                            }
                            projectData={projectData.project}
                        />
                    </PopupBox>
                </>
            )}
        </div>
    );
};

export default InvestmentBoard;
