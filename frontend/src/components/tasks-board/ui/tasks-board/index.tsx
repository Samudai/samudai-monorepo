import { useEffect, useMemo, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { SubtasksBoard } from '../subtasks-board';
import { TaskAccordeon } from '../task-accordeon';
import {
    AccessEnums,
    Task as ITask,
    ProjectColumn,
    ProjectResponse,
    TaskResponse,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectAccessList } from 'store/features/common/slice';
import { createTaskRequest } from 'store/services/projects/model';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';
import { useScrollbar } from 'hooks/useScrollbar';
import { useTypedSelector } from 'hooks/useStore';
import { ProjectsPayout, ProjectsPostJob } from 'components/@pages/projects';
import {
    countAllTasks,
    groupByContributor,
    groupByDepartment,
    groupByStatus,
} from 'components/@pages/projects/lib';
import { BoardGroupByEnum, ProjectOption } from 'components/@pages/projects/types';
import { ProjectsTaskDetails } from 'components/@pages/projects/ui/projects-task-cr';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { useCreateTask } from 'components/tasks-board/lib/hooks';
import { WithSubtasks, useSubtaskState } from 'components/tasks-board/providers/withSubtasks';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { Assignees } from '../assignees';
import { Board } from '../board';
import { Creator } from '../creator';
import { Head } from '../head';
import { Task } from '../task';
import css from './tasks-board.module.scss';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import { useBounty, useJobs } from 'components/@pages/new-jobs';

interface TasksBoardProps {
    className?: string;
    groupBy?: BoardGroupByEnum;
    items: TaskResponse[];
    columns: ProjectColumn[];
    project: ProjectResponse;
    option: ProjectOption;
    onChangeOption: (option: ProjectOption) => void;
    onUpdate: (task: ITask, dropResult: DropResult) => void;
    onDelete: (task_id: string) => void;
}

function TasksBoardWrapper({
    className,
    groupBy,
    items,
    columns,
    project,
    onUpdate,
    option,
    onChangeOption,
    onDelete,
}: TasksBoardProps) {
    const [taskData, setTaskData] = useState(items);

    const { subtaskState, detailState, assigneesState, payoutState, postJobState } =
        useSubtaskState();
    const { targetRef } = useHorizontalScroll<HTMLDivElement>({
        ignoreElements: '[data-card]',
    });
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();
    const { onSubmit } = useCreateTask();
    const { daoid } = useParams();
    const memberId = getMemberId();
    const daoAccess = useTypedSelector(selectAccessList)?.[daoid!];

    const { allOpportunities } = useJobs();
    const { allBounties } = useBounty();

    const adminAccess = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT) ||
            project.poc_member_id === memberId,
        [daoid, project]
    );

    const taskAccess = useMemo(() => project.poc_member_id === memberId, [daoid, project]);

    const contributorAccess = project.contributors?.includes(memberId);

    const renderItems = useMemo(() => {
        if (groupBy === BoardGroupByEnum.CONTRIBUTOR) {
            return groupByContributor(columns, taskData);
        }

        if (groupBy === BoardGroupByEnum.DEPARTMENT) {
            return groupByDepartment(columns, taskData);
        }

        return groupByStatus(columns, taskData);
    }, [taskData, groupBy, columns]);

    const handleChange = (groupIndex: number, dropResult: DropResult) => {
        const { source, destination } = dropResult;
        if (!destination) return null;
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return null;
        }
        if (!(adminAccess || taskAccess || contributorAccess)) {
            return toast('Failure', 3000, `You don't have access for this action`, '')();
        }
        const lastColumnId = [...columns].sort((a, b) => b.column_id - a.column_id)[0].column_id;
        if (
            (+destination.droppableId === lastColumnId || +source.droppableId === lastColumnId) &&
            !adminAccess
        ) {
            return toast('Failure', 3000, `You don't have access for this action`, '')();
        }

        let sourceItem: TaskResponse | undefined;
        let destinationCol: TaskResponse[] = [];

        for (let i = 0; i < renderItems.length; i++) {
            const { data } = renderItems[i];

            if (i !== groupIndex) continue;

            for (const col of data) {
                if (col.column.column_id.toString() === destination.droppableId) {
                    destinationCol = col.items;
                }
                if (col.column.column_id.toString() === source.droppableId) {
                    sourceItem = col.items.find((_, id) => id === source.index);
                }
            }
        }

        if (!sourceItem || !destinationCol) return;

        if (+destination.droppableId === lastColumnId && !!sourceItem.subtasks?.length) {
            if (sourceItem.completed_subtask_count !== sourceItem.subtasks.length) {
                return toast('Failure', 3000, `Please complete all subtasks for this task`, '')();
            }
        }

        const prevItem = destinationCol[destination.index - 1];
        const nextItem = destinationCol[destination.index];

        let position = sourceItem.position;

        if (prevItem && nextItem) {
            position = (prevItem.position + nextItem.position) / 2;
        } else if (prevItem) {
            position = prevItem.position + 65536;
        } else if (nextItem) {
            position = nextItem.position / 2;
        }

        onUpdate(
            {
                ...sourceItem,
                position,
                col: +destination.droppableId,
            },
            dropResult
        );
    };

    const handleCreateTask = (
        title: string,
        columnId: number,
        department?: string,
        contributor?: IMember
    ) => {
        const currTasks = taskData
            .filter((task) => task.col === columnId)
            .sort((task1, task2) => task1.position - task2.position);

        const oldTasks = [...taskData];

        const newTask: createTaskRequest = {
            task: {
                project_id: project.project_id!,
                title: title,
                created_by: memberId as string,
                poc_member_id: memberId as string,
                col: columnId,
                tags: department ? [department] : undefined,
                assignee_member: contributor ? [contributor.member_id] : undefined,
                assignees: contributor ? [contributor] : undefined,
                position: currTasks.length
                    ? currTasks[currTasks.length - 1].position + 65536
                    : 65536,
            },
        };

        setTaskData([...taskData, newTask.task as TaskResponse]);

        return onSubmit(newTask, project).catch(() => setTaskData(oldTasks));
    };

    useEffect(() => {
        items.length && setTaskData(items);
    }, [items]);

    return (
        <>
            <div className={clsx(css.board, className)}>
                <div
                    ref={targetRef}
                    className={clsx(
                        'orange-scrollbar',
                        css.board_wrapper,
                        isScrollbar && css.board_wrapperScrollbar
                    )}
                >
                    <Head
                        data={
                            renderItems[0]?.data || columns.map((column) => ({ column, items: [] }))
                        }
                        menu={adminAccess}
                        data-analytics-parent="task_board_header"
                    />
                    <div ref={ref} className={`orange-scrollbar ${css.board_container}`}>
                        {renderItems.map((item, index) =>
                            item.data.length > 0 ? (
                                <div
                                    className={css.board_box}
                                    key={item.type + index}
                                    data-analytics-click={item.type}
                                >
                                    <TaskAccordeon
                                        disabled={item.type === 'status'}
                                        button={
                                            <>
                                                {['contributor', 'department'].includes(
                                                    item.type
                                                ) && (
                                                    <div className={css.board_heading}>
                                                        {item.type === 'department' && (
                                                            <p className={css.board_department}>
                                                                {item.department}
                                                            </p>
                                                        )}
                                                        {item.type === 'contributor' &&
                                                            item.contributor && (
                                                                <div
                                                                    className={
                                                                        css.board_contributor
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            css.board_contributor_img
                                                                        }
                                                                    >
                                                                        <img
                                                                            src={
                                                                                item.contributor
                                                                                    .profile_picture ||
                                                                                '/img/icons/user-4.png'
                                                                            }
                                                                            className="img-cover"
                                                                            alt="contributor"
                                                                        />
                                                                    </div>
                                                                    <p
                                                                        className={
                                                                            css.board_contributor_name
                                                                        }
                                                                    >
                                                                        {item.contributor.name ||
                                                                            'Unknown'}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        <p className={css.board_count}>
                                                            {countAllTasks(item.data)}
                                                        </p>
                                                        {/* <SettingsDropdown
                                                            className={css.board_settings}
                                                        >
                                                            <SettingsDropdown.Item>
                                                                Option 1
                                                            </SettingsDropdown.Item>
                                                            <SettingsDropdown.Item>
                                                                Option 2
                                                            </SettingsDropdown.Item>
                                                            <SettingsDropdown.Item>
                                                                Option 3
                                                            </SettingsDropdown.Item>
                                                        </SettingsDropdown> */}
                                                    </div>
                                                )}
                                            </>
                                        }
                                        children={
                                            <Board
                                                data={item.data}
                                                className={css.board_board}
                                                onChange={handleChange.bind(null, index)}
                                                renderElement={(data, shaking) => (
                                                    <Task
                                                        data={data}
                                                        shaking={option}
                                                        cancelShaking={() => onChangeOption(null)}
                                                        fields={
                                                            groupBy === BoardGroupByEnum.DEPARTMENT
                                                                ? ['person']
                                                                : groupBy ===
                                                                  BoardGroupByEnum.CONTRIBUTOR
                                                                ? ['department']
                                                                : ['department', 'person']
                                                        }
                                                        deleteTask={
                                                            adminAccess ? onDelete : undefined
                                                        }
                                                    />
                                                )}
                                                renderCreator={
                                                    adminAccess || taskAccess
                                                        ? (columnId) => (
                                                              <Creator
                                                                  columnId={columnId}
                                                                  onSubmit={async (
                                                                      title,
                                                                      column_id
                                                                  ) => {
                                                                      if (
                                                                          item.type === 'department'
                                                                      ) {
                                                                          handleCreateTask(
                                                                              title,
                                                                              column_id,
                                                                              item.department
                                                                          );
                                                                      } else if (
                                                                          item.type ===
                                                                          'contributor'
                                                                      ) {
                                                                          handleCreateTask(
                                                                              title,
                                                                              column_id,
                                                                              undefined,
                                                                              item.contributor
                                                                          );
                                                                      } else {
                                                                          handleCreateTask(
                                                                              title,
                                                                              column_id
                                                                          );
                                                                      }
                                                                  }}
                                                                  dataClickIds={{
                                                                      createButton:
                                                                          'task_card_create_button',
                                                                      titleInput:
                                                                          'task_card_title_input',
                                                                      submitButton:
                                                                          'task_card_create_submit',
                                                                  }}
                                                              />
                                                          )
                                                        : undefined
                                                }
                                            />
                                        }
                                    />
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
            <PopupBox
                active={subtaskState.active}
                onClose={subtaskState.close}
                effect="bottom"
                children={<SubtasksBoard columns={columns} taskData={subtaskState.payload} />}
            />
            <PopupBox
                active={detailState.active}
                onClose={detailState.close}
                effect="side"
                children={
                    <ProjectsTaskDetails
                        project={project}
                        data={detailState.payload!}
                        columns={columns}
                        onClose={detailState.close}
                        access={adminAccess || taskAccess}
                    />
                }
            />
            <PopupBox
                active={assigneesState.active}
                onClose={assigneesState.close}
                effect="side"
                children={
                    <Assignees taskData={assigneesState.payload} onClose={assigneesState.close} />
                }
            />
            <PopupBox
                active={payoutState.active}
                onClose={payoutState.close}
                effect="side"
                children={
                    <ProjectsPayout
                        onClose={payoutState.close}
                        link={{
                            type: 'task',
                            id: payoutState.payload!,
                        }}
                        taskData={items.find((i) => i.task_id === payoutState.payload)!}
                    />
                }
            />
            <PopupBox
                active={postJobState.active}
                onClose={postJobState.close}
                effect="side"
                children={
                    <ProjectsPostJob
                        data={postJobState.payload!}
                        onClose={postJobState.close}
                        opportunity={allOpportunities.find(
                            (item) => item.task_id === postJobState.payload?.task_id
                        )}
                        bounty={allBounties.find(
                            (item) => item.task_id === postJobState.payload?.task_id
                        )}
                    />
                }
            />
        </>
    );
}

export function TasksBoard(props: TasksBoardProps) {
    return (
        <WithSubtasks>
            <TasksBoardWrapper {...props} />
        </WithSubtasks>
    );
}
