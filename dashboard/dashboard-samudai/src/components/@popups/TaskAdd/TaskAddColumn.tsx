import { useMemo, useState } from 'react';
import Select from 'react-select';
import {
    addColumnRequest,
    bulkSubTaskPositionUpdateRequest,
    bulkTaskPositionUpdateRequest,
} from '../../../store/services/projects/model';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import {
    ActivityEnums,
    ProjectColumn,
    ProjectResponse,
    SubTask,
    Task,
} from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao } from 'store/features/common/slice';
import {
    useAddColumnMutation,
    useBulkSubTaskPositionUpdateMutation,
    useBulkTaskPositionUpdateMutation,
} from 'store/services/projects/totalProjects';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import { paymentsSelectStyles } from 'components/@pages/payments/utils/selectStyles';
import { ProjectTasksWithColumn } from 'components/@pages/projects/lib';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './TaskAdd.module.scss';

interface ColumnAddProps {
    close?: () => void;
    status: ProjectTasksWithColumn<Task>[];
    subtaskStatus: ProjectTasksWithColumn<SubTask>[];
    columns: ProjectColumn[];
    projectData: ProjectResponse;
    setNewColumn?: any;
}

interface SelectOption {
    value: number;
    label: string;
}

const TaskAddColumn: React.FC<ColumnAddProps> = ({
    close: onClose,
    status,
    subtaskStatus,
    projectData,
    columns,
    setNewColumn,
}) => {
    const [dropDown, setDropDown] = useState<SelectOption>({
        value: 0,
        label: 'Please Select',
    });
    const [name, setName] = useInput('');
    const [type, setType] = useState<string>('before');

    const member_id = getMemberId();
    const [addColumn, { isLoading }] = useAddColumnMutation();
    const [bulkTaskPositionUpdate] = useBulkTaskPositionUpdateMutation();
    const [bulkSubTaskPositionUpdate] = useBulkSubTaskPositionUpdateMutation();
    const activeDAO = useTypedSelector(selectActiveDao);

    const dropdownOptions = useMemo(() => {
        return columns.map((item) => ({
            value: item.column_id,
            label: item.name,
        }));
    }, [columns]);

    const handleSubmit = () => {
        if (name === '') {
            return toast('Attention', 5000, 'Please enter a valid column name', '')();
        }
        if (dropDown.value === 0) {
            return toast('Attention', 5000, 'Please select a column', '')();
        }

        const output = [];
        let updatedTasks: any = [];
        let updatedSubTasks: any = [];

        if (type === 'before') {
            output.push({
                name: name,
                column_id: dropDown.value,
            });
            status?.forEach((i) => {
                if (i.column.column_id < dropDown.value) {
                    output.push({
                        name: i.column.name,
                        column_id: i.column.column_id,
                    });
                } else {
                    output.push({
                        name: i.column.name,
                        column_id: i.column.column_id + 1,
                    });
                }
            });

            const allTasks = status.map((i) => i.items).flat();
            const allSubTasks = subtaskStatus.map((i) => i.items).flat();

            updatedTasks = allTasks.map((i) => {
                return {
                    col: i.col < dropDown.value ? i.col : i.col + 1,
                    task_id: i.task_id,
                    updated_by: member_id,
                };
            });
            updatedSubTasks = allSubTasks.map((i) => {
                return {
                    col: i.col! < dropDown.value ? i.col : i.col! + 1,
                    subtask_id: i.subtask_id,
                    updated_by: member_id,
                };
            });
        } else {
            output.push({
                name: name,
                column_id: dropDown.value + 1,
            });
            status?.forEach((i) => {
                if (i.column.column_id <= dropDown.value) {
                    output.push({
                        name: i.column.name,
                        column_id: i.column.column_id,
                    });
                } else {
                    output.push({
                        name: i.column.name,
                        column_id: i.column.column_id + 1,
                    });
                }
            });

            const allTasks = status.map((i) => i.items).flat();
            const allSubTasks = subtaskStatus.map((i) => i.items).flat();

            updatedTasks = allTasks.map((i) => {
                return {
                    col: i.col <= dropDown.value ? i.col : i.col + 1,
                    task_id: i.task_id,
                    updated_by: member_id,
                };
            });
            updatedSubTasks = allSubTasks.map((i) => {
                return {
                    col: i.col! <= dropDown.value ? i.col : i.col! + 1,
                    subtask_id: i.subtask_id,
                    updated_by: member_id,
                };
            });
        }

        const payloadColumns: addColumnRequest = {
            projectId: projectData.project_id!,
            columns: output,
            updatedBy: member_id,
            totalCol: output.length,
        };

        const payloadTasks: bulkTaskPositionUpdateRequest = {
            tasks: updatedTasks,
        };

        const payloadSubTasks: bulkSubTaskPositionUpdateRequest = {
            subtasks: updatedSubTasks,
        };

        addColumn(payloadColumns)
            .unwrap()
            .then((res: any) => {
                toast('Success', 5000, 'New column added successfully', '')();
                updateActivity({
                    dao_id: activeDAO,
                    member_id: getMemberId(),
                    project_id: projectData.project_id!,
                    action_type: ActivityEnums.ActionType.PROJECT_UPDATED,
                    visibility: projectData.visibility!,
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
                        project_name: projectData.title,
                    },
                    action: {
                        message: '',
                    },
                    metadata: {
                        title: projectData.title,
                        id: projectData.project_id!,
                    },
                });
                onClose?.();
            })
            .catch((err: any) => {
                toast('Failure', 5000, 'Failed to add new column', '')();
            });

        bulkTaskPositionUpdate(payloadTasks!)
            .unwrap()
            .then((res: any) => {
                if (setNewColumn) setNewColumn(true);
                onClose?.();
            })
            .catch((err: any) => {
                toast('Failure', 5000, 'Failed to update tasks', '')();
            });

        bulkSubTaskPositionUpdate(payloadSubTasks!)
            .unwrap()
            .then((res: any) => {
                onClose?.();
            })
            .catch((err: any) => {
                toast('Failure', 5000, 'Failed to update subtasks', '')();
            });
    };

    const handleDropDown = (item: SelectOption) => {
        setDropDown(item);
    };

    const handleRadio = (value: string) => {
        setType(value);
    };

    return (
        <Popup className={styles.root} dataParentId="task_add_column_modal" onClose={onClose}>
            <PopupTitle
                icon="/img/icons/file.png"
                title={
                    <>
                        <strong>Add </strong>Column
                    </>
                }
            />

            <Input
                className={styles.firstInput}
                value={name}
                placeholder="Name of the Column"
                onChange={setName}
                data-analytics-click="column_name_input"
            />
            <div style={{ marginBottom: '10px' }}>
                <PopupSubtitle text="Select Position" className={styles.subtitle} />
            </div>
            <div style={{ display: 'flex', color: 'white' }}>
                <div style={{ marginRight: '10px' }} data-analytics-click="before_radio_button">
                    <Radio
                        value="before"
                        checked={type === 'before' ? true : false}
                        onChange={() => handleRadio('before')}
                    />
                </div>
                <div style={{ marginRight: '10px' }}>Before</div>
                <div style={{ marginRight: '10px' }} data-analytics-click="after_radio_button">
                    <Radio
                        value="before"
                        checked={type === 'after' ? true : false}
                        onChange={() => handleRadio('after')}
                    />
                </div>
                <div>After</div>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <PopupSubtitle text="Select Column" className={styles.subtitle} />
            </div>
            <Select
                value={dropDown}
                options={dropdownOptions.sort((a, b) => a.value - b.value)}
                styles={paymentsSelectStyles}
                onChange={(e) => handleDropDown(e!)}
                formatOptionLabel={(data: any) => (
                    <>
                        <div
                            className={styles.payments_select__content}
                            style={{ color: 'white' }}
                            data-analytics-click={'select_' + data.label}
                        >
                            <p className={styles.payments_select__text}>{data.label}</p>
                        </div>
                    </>
                )}
            />
            <Button
                color="orange"
                className={styles.submit}
                onClick={handleSubmit}
                isLoading={isLoading}
                data-analytics-click="add_column_button"
            >
                <span>Add</span>
            </Button>
        </Popup>
    );
};

export default TaskAddColumn;
