import { ProjectColumn } from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

export interface ProjectTasksWithColumn<T extends RequiredFields> {
    column: ProjectColumn;
    items: T[];
}

export interface RequiredFields {
    task_id?: string;
    subtask_id?: string;
    response_id?: string;
    created_by_member?: IMember;
    departments?: {
        value: string | number;
        label: string;
    }[];
    position: number;
    col?: number;
    assignees?: IMember[];
    tags?: string[];
}

// export interface RequiredFieldsMember extends RequiredFields {
//     created_by: IMember;
// }

// export interface RequiredFieldsDepartment extends RequiredFields {
//     departments: {
//         value: string;
//         label: string
//     }[];
// }

export interface SortByStatus<T extends RequiredFields> {
    column: ProjectColumn;
    items: T[];
}

export interface GroupByContributor<T extends RequiredFields> {
    contributor?: IMember;
    type: 'contributor';
    data: T[];
}

export interface GroupByDepartment<T extends RequiredFields> {
    department: string;
    type: 'department';
    data: T[];
}

export interface GroupByStatus<T extends RequiredFields> {
    type: 'status';
    data: T[];
}

export function countAllTasks<T extends RequiredFields>(data: ProjectTasksWithColumn<T>[]) {
    return data.reduce((acc, item) => acc + item.items.length, 0);
}

export function sortTasksByOrder<T extends RequiredFields>(arr: T[]) {
    return arr.sort((item1, item2) => item1.position - item2.position);
}

export function sortTasksByStatus<T extends RequiredFields>(columns: ProjectColumn[], arr: T[]) {
    const groups: ProjectTasksWithColumn<T>[] = columns.map((col) => ({
        column: col,
        items: [],
    }));

    for (const item of arr) {
        const group = groups.find((g) => g.column.column_id === item.col);
        if (group) {
            group.items.push(item);
        }
        // else {
        //     groups.push({
        //         column: item.col,
        //         items: [item],
        //     });
        // }
    }

    return groups
        .map((item) => ({ ...item, items: sortTasksByOrder(item.items) }))
        .sort((item1, item2) => item1.column.column_id - item2.column.column_id);
}

export function getDynamicColumns<T extends RequiredFields>(arr: T[]) {
    const columns: Omit<SortByStatus<T>, 'type'>[] = [];

    for (const item of arr) {
        const group = columns.find((g) => g.column.column_id === item.col);
        // if (!group) {
        //     columns.push({ column: item.status, items: [] });
        // }
    }

    return columns;
}

export function groupByStatus<T extends RequiredFields>(columns: ProjectColumn[], arr: T[]) {
    const data = sortTasksByStatus(columns, arr);
    return [{ data, type: 'status' as const }];
}

export function groupByContributor<T extends RequiredFields>(columns: ProjectColumn[], arr: T[]) {
    const groups: GroupByContributor<T>[] = [];

    const unassignedGroup: GroupByContributor<T> = {
        contributor: {
            member_id: '',
            username: '',
            name: 'Unassigned',
            profile_picture: '',
        },
        type: 'contributor',
        data: [],
    };

    for (const item of arr) {
        if (!item.assignees?.length) {
            unassignedGroup.data.push(item);
            continue;
        }
        item.assignees.forEach((assignee) => {
            const group = groups.find((g) => g.contributor?.member_id === assignee.member_id);
            if (group) {
                group.data.push(item);
            } else {
                groups.push({
                    contributor: assignee,
                    data: [item],
                    type: 'contributor',
                });
            }
        });
    }

    unassignedGroup.data.length && groups.push(unassignedGroup);

    return groups.map((item) => ({ ...item, data: sortTasksByStatus(columns, item.data) }));
}

export function groupByDepartment<T extends RequiredFields>(columns: ProjectColumn[], arr: T[]) {
    const groups: GroupByDepartment<T>[] = [];

    const unassignedGroup: GroupByDepartment<T> = {
        department: 'Unassigned',
        type: 'department',
        data: [],
    };

    for (const item of arr) {
        if (!item.tags?.length) unassignedGroup.data.push(item);
        for (const tag of item.tags || []) {
            const group = groups.find((g) => g.department === tag);
            if (group) {
                group.data.push(item);
            } else {
                groups.push({
                    department: tag,
                    type: 'department',
                    data: [item],
                });
            }
        }
    }

    unassignedGroup.data.length && groups.push(unassignedGroup);

    return groups.map((item) => ({ ...item, data: sortTasksByStatus(columns, item.data) }));
}
