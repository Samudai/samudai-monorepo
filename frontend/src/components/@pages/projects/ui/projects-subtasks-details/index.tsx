import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchProject } from '../../lib/hooks/use-fetch-project';
import { ProjectsMember } from '../projects-member';
import { ActivityEnums, SubTask } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useLazyGetSubTaskDetailsQuery } from 'store/services/projects/tasks';
import { useUpdateSubTaskMutation } from 'store/services/projects/totalProjects';
import store from 'store/store';
import { useObjectState } from 'hooks/use-object-state';
import Popup from 'components/@popups/components/Popup/Popup';
import { useSubtaskState } from 'components/tasks-board/providers/withSubtasks';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import DatePicker from 'ui/@form/date-picker/date-picker';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import PenIcon from 'ui/SVG/PenIcon';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { IMember } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import css from './projects-subtasks-details.module.scss';
import { useTypedSelector } from 'hooks/useStore';
import { selectProjectid } from 'store/features/common/slice';

interface ProjectsSubtasksDetailsProps {
    data: SubTask;
    access?: boolean;
    personal?: boolean;
}

type TaskTabs = 'payouts';

export const ProjectsSubtasksDetails: React.FC<ProjectsSubtasksDetailsProps> = ({
    data,
    access,
    personal,
}) => {
    const [editMode, setEditMode] = useState(false);
    const [subTaskData, setSubTaskData] = useObjectState<SubTask>(data);
    const [reviewer, setReviewer] = useState<IMember | null>();
    const [contributors, setContributors] = useState<IMember[]>();
    const [activeTab, setActiveTab] = useState<TaskTabs>('payouts');
    const [btnLoading, setBtnLoading] = useState(false);
    const { projectData } = useFetchProject();

    const { subtaskDetailState } = useSubtaskState();
    const { daoid } = useParams();
    const [getDetails] = useLazyGetSubTaskDetailsQuery();
    const [updateSubTask] = useUpdateSubTaskMutation();
    const memberId = getMemberId();
    const projectID = useTypedSelector(selectProjectid);

    const tabs: TaskTabs[] = ['payouts'];

    const fetchDetails = async () => {
        if (data?.subtask_id) {
            getDetails(data.subtask_id)
                .unwrap()
                .then((res) => {
                    setSubTaskData(res.data!);
                    setReviewer(res.data?.poc_member);
                    setContributors(res.data?.assignees);
                });
        }
    };

    const onSave = () => {
        const payload = {
            subtask: {
                subtask_id: subTaskData.subtask_id,
                description: subTaskData.description,
                project_id: subTaskData.project_id,
                task_id: subTaskData.task_id,
                title: subTaskData.title,
                deadline: subTaskData.deadline,
                created_by: subTaskData.created_by,
                position: subTaskData.position,
                updated_by: getMemberId(),
                poc_member_id: reviewer?.member_id || '',
                assignee_member: contributors?.map((i) => i.member_id),
            },
        };

        setBtnLoading(true);

        updateSubTask(payload)
            .unwrap()
            .then((res) => {
                updateActivity({
                    dao_id: daoid!,
                    member_id: getMemberId(),
                    project_id: subTaskData.project_id,
                    task_id: subTaskData.task_id,
                    subtask_id: subTaskData.subtask_id!,
                    action_type: ActivityEnums.ActionType.SUBTASK_UPDATED,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                    visibility: projectData?.project?.visibility!,
                    member: {
                        username: store.getState().commonReducer?.member?.data.username || '',
                        profile_picture:
                            store.getState().commonReducer?.member?.data.profile_picture || '',
                    },
                    dao: {
                        dao_name: store.getState().commonReducer?.activeDaoName || '',
                        profile_picture: store.getState().commonReducer?.profilePicture || '',
                    },
                    project: {
                        project_name: projectData?.project.title || '',
                    },
                    subtask: {
                        subtask_name: subTaskData.title,
                    },
                    action: {
                        message: '',
                    },
                    metadata: {
                        id: subTaskData.subtask_id!,
                        title: subTaskData.title,
                    },
                });
                setEditMode(false);
                fetchDetails();
                toast('Success', 5000, 'Subtask updated successfully', '')();
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to update subtask', '')();
            })
            .finally(() => {
                setBtnLoading(false);
            });
    };

    useEffect(() => {
        if (data?.subtask_id) fetchDetails();
    }, [data?.subtask_id]);

    return (
        <Popup className={css.subtask} dataParentId="subtask_details_sidebar">
            <div className={css.subtask_header}>
                <button
                    className={css.subtask_header_closeBtn}
                    onClick={subtaskDetailState.close}
                    data-analytics-click="back_button"
                >
                    <ArrowLeftIcon />
                    <span>Back</span>
                </button>

                <h4 className={css.subtask_header_title}>Subtask</h4>

                <div className={css.subtask_header_controls}>
                    {!editMode && access && (
                        <button
                            className={css.subtask_header_editBtn}
                            onClick={setEditMode.bind(null, true)}
                            data-analytics-click="edit_subtask_pencil_button"
                        >
                            <PenIcon />
                        </button>
                    )}
                    <CloseButton
                        className={css.subtask_header_crossBtn}
                        onClick={subtaskDetailState.close}
                    />
                </div>
            </div>
            <div className={css.subtask_body}>
                {editMode && (
                    <Input
                        className={css.subtask_header_input}
                        value={subTaskData.title}
                        onChange={(ev) => setSubTaskData({ title: ev.target.value })}
                        placeholder="Type title..."
                        data-analytics-click="edit_subtask_title_input"
                    />
                )}
                {!editMode && <h3 className={css.subtask_header_title}>{subTaskData.title}</h3>}
                <p className={css.subtask_lastupdate}>
                    <span>Last Updated</span>
                    <span data-white>{dayjs(subTaskData.updated_at).fromNow()}</span>
                </p>
                <div className={css.subtask_deadline}>
                    <h3 className={css.subtask_deadline_title}>
                        <CalendarIcon />
                        <span>Deadline</span>
                    </h3>
                    {editMode && (
                        <DatePicker
                            className={css.subtask_deadline_picker}
                            value={subTaskData.deadline ? dayjs(subTaskData.deadline) : null}
                            onChange={(deadline) =>
                                deadline && setSubTaskData({ deadline: deadline.toISOString() })
                            }
                            dataClickId="edit_subtask_deadline_input"
                        />
                    )}
                    {!editMode && (
                        <p className={css.subtask_deadline_date}>
                            {subTaskData.deadline ? (
                                dayjs(subTaskData.deadline).format('ddd, DD MMM,YYYY')
                            ) : (
                                <div className={css.emptyText}>No deadline</div>
                            )}
                        </p>
                    )}
                </div>
                {!personal && (
                    <div className={css.subtask_members}>
                        <div className={css.subtask_members_col}>
                            <ProjectsMember
                                title="Reviewer"
                                values={reviewer ? [reviewer] : []}
                                onChange={([reviewer]) => setReviewer(reviewer)}
                                single
                                closeOnClick
                                disabled={!editMode}
                            />
                        </div>
                        <div className={css.subtask_members_col}>
                            <ProjectsMember
                                values={contributors || []}
                                onChange={(contributors) => setContributors(contributors)}
                                disabled={!editMode}
                                title="Contributors"
                            />
                        </div>
                    </div>
                )}
                {/* {personal && (
                    <div className={css.subtask_members}>
                        <div className={css.subtask_members_col}>
                            <ProjectsMember
                                title="Owner"
                                values={reviewer ? [reviewer] : []}
                                onChange={([reviewer]) => setReviewer(reviewer)}
                                single
                                closeOnClick
                                disabled
                            />
                        </div>
                    </div>
                )} */}
                <div className={css.subtask_description}>
                    <h4 className={css.subtask_description_title}>Description</h4>
                    {editMode && (
                        <TextArea
                            value={subTaskData.description}
                            onChange={(e) => setSubTaskData({ description: e.target.value })}
                            placeholder="Enter description"
                            data-analytics-click="edit_subtask_description"
                            className={css.subtask_description_input}
                        />
                    )}
                    {!editMode && !subTaskData.description && (
                        <div className={clsx(css.subtask_description_editor, css.emptyText)}>
                            No Description Added
                        </div>
                    )}
                    {!editMode && (
                        <p className={css.subtask_description_editor}>{subTaskData.description}</p>
                    )}
                </div>

                {editMode && (
                    <div className={css.creator_controls}>
                        <Button
                            className={css.creator_submitBtn}
                            color="green"
                            onClick={onSave}
                            isLoading={btnLoading}
                            data-analytics-click="save_subtask_edits"
                        >
                            <span>Save</span>
                        </Button>
                    </div>
                )}
            </div>
        </Popup>
    );
};
