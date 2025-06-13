import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectColumn } from '@samudai_xyz/gateway-consumer-types/dist/types';
import {
    useBulkTaskPositionUpdateMutation,
    useGetSubTasksByProjectIdQuery,
    useUpdateColumnHeadsMutation,
} from 'store/services/projects/totalProjects';
import { ProjectTasksWithColumn } from 'components/@pages/projects/lib';
import Input from 'ui/@form/Input/Input';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './head.module.scss';

interface HeadProps {
    data: ProjectTasksWithColumn<any>[];
    menu?: boolean;
    project_id?: string;
}

interface EditColumn {
    state: boolean;
    col?: number;
    name?: string;
}

export const Head: React.FC<HeadProps> = ({ data, menu, project_id }) => {
    const [isEdit, setIsEdit] = useState<EditColumn>({
        state: false,
    });

    const { projectId } = useParams();
    const { data: subTasksData } = useGetSubTasksByProjectIdQuery((project_id || projectId)!, {
        skip: !(project_id || projectId),
    });
    const selectRef = useRef<HTMLDivElement>(null);
    const [updateColumn] = useUpdateColumnHeadsMutation();
    const [bulkTaskPositionUpdate] = useBulkTaskPositionUpdateMutation();
    const member_id = getMemberId();

    const onClickOutsideSelect = (e: MouseEvent) => {
        const selectEl = selectRef.current;
        if (selectEl && !e.composedPath().includes(selectEl)) {
            setIsEdit({ state: false });
        }
    };

    const renameColumn = () => {
        const newColumns = data.map((i) => {
            if (i.column.column_id === isEdit.col) {
                return {
                    column_id: isEdit.col!,
                    name: isEdit.name!,
                };
            }
            return i.column;
        });
        updateColumn({
            projectId: (project_id || projectId)!,
            columns: newColumns,
            updatedBy: member_id as string,
            totalCol: newColumns.length,
        })
            .unwrap()
            .then((res) => {
                toast('Success', 3000, 'Column renamed successfully', '')();
                setIsEdit({ state: false });
            })
            .catch((err) => {
                toast('Failure', 3000, err?.data?.message, '')();
            });
    };

    const deleteColumn = async (column: ProjectTasksWithColumn<any>) => {
        if (column.items.length) {
            toast('Attention', 3000, 'This column contains active tasks', '')();
            return;
        }

        if (
            subTasksData?.data?.subtasks.filter(
                (subtask) => subtask.col === column.column.column_id
            ).length
        ) {
            toast('Attention', 3000, 'This column contains active subtasks', '')();
            return;
        }

        const newColumns: ProjectColumn[] = [];
        let updatedTasks: any = [];
        const columnId = column.column.column_id;

        data.forEach((i) => {
            if (i.column.column_id < columnId) {
                newColumns.push({
                    name: i.column.name,
                    column_id: i.column.column_id,
                });
            } else if (i.column.column_id > columnId) {
                newColumns.push({
                    name: i.column.name,
                    column_id: i.column.column_id - 1,
                });
            }
        });

        const allTasks = data.map((i) => i.items).flat();

        updatedTasks = allTasks.map((i) => {
            return {
                col: i.col < columnId ? i.col : i.col - 1,
                task_id: i.task_id,
                updated_by: member_id,
            };
        });

        updateColumn({
            projectId: (project_id || projectId)!,
            columns: newColumns,
            updatedBy: member_id as string,
            totalCol: newColumns.length,
        })
            .unwrap()
            .then((res) => {
                toast('Success', 3000, 'Column removed successfully', '')();
            })
            .catch((err) => {
                toast('Failure', 3000, 'Failed to remove column', err?.data?.message)();
            });

        bulkTaskPositionUpdate({
            tasks: updatedTasks,
        })
            .unwrap()
            .catch((err: any) => {
                toast('Success', 5000, 'Failed to update tasks', err?.data?.message)();
            });
    };

    useEffect(() => {
        if (selectRef.current) {
            document.addEventListener('click', onClickOutsideSelect, true);
            return () => document.removeEventListener('click', onClickOutsideSelect, true);
        }
    });

    return (
        <header className={css.header}>
            <ul className={css.header_list}>
                {data.map((column) => (
                    <li className={css.header_item} key={column.column.column_id}>
                        <h3 className={css.header_title}>
                            {!(isEdit.state && isEdit.col === column.column.column_id) ? (
                                <span className={css.header_title_text}>{column.column.name}</span>
                            ) : (
                                <span className={css.header_title_text}>
                                    <Input
                                        className={css.header_title_input}
                                        ref={selectRef}
                                        value={isEdit.name}
                                        onChange={(e) =>
                                            setIsEdit((data) => {
                                                return { ...data, name: e.target.value };
                                            })
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                renameColumn();
                                            }
                                        }}
                                        data-analytics-click={'edit_column_name'}
                                    />
                                </span>
                            )}
                            <span className={css.header_title_count}>{column.items.length}</span>
                        </h3>
                        {menu && (
                            <SettingsDropdown className={css.header_settings}>
                                <SettingsDropdown.Item
                                    className={css.header_settings_item}
                                    onClick={() =>
                                        setIsEdit({
                                            state: true,
                                            col: column.column.column_id,
                                            name: column.column.name,
                                        })
                                    }
                                    data-analytics-click="rename_column"
                                >
                                    Rename Column
                                </SettingsDropdown.Item>
                                <SettingsDropdown.Item
                                    className={css.header_settings_item}
                                    onClick={() => deleteColumn(column)}
                                    data-analytics-click="delete_column"
                                >
                                    Delete Column
                                </SettingsDropdown.Item>
                            </SettingsDropdown>
                        )}
                    </li>
                ))}
            </ul>
        </header>
    );
};
