import { DropResult } from 'react-beautiful-dnd';
import { ProjectResponse, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import { ITask, TaskStatus } from 'utils/types/Project';

type ColumnType = {
    id: number;
    name: TaskStatus;
    items: ITask[];
};

export type dynamicColumnType = {
    id: number;
    name: string;
    items: TaskResponse[];
};

export class KanbanHelper {
    static insertItem(list: dynamicColumnType[], { source, destination }: DropResult) {
        if (!destination) return null;
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return null;
        }
        const item = list
            .find((col) => col.name === source.droppableId)
            ?.items.splice(source.index, 1)[0];
        const column = list.find((column) => column.name === destination.droppableId);

        if (!item || !column) return null;

        column?.items.splice(destination.index, 0, item as TaskResponse);

        const prevItem = column.items[destination.index - 1];
        const nextItem = column.items[destination.index + 1];

        const status = destination.droppableId as TaskStatus;
        let position = item.position;

        if (prevItem && nextItem) {
            position = (prevItem.position + nextItem.position) / 2;
        } else if (prevItem) {
            position = prevItem.position + prevItem.position / 2;
        } else if (nextItem) {
            position = nextItem.position / 2;
        }

        return { ...item, status, position };
    }

    static createNewItem() {}

    static getListItems(project: ProjectResponse) {
        const columns = KanbanHelper.dynamicColumns(project);

        (project?.tasks || [])
            ?.slice()
            .sort((i1, i2) => i1.position - i2.position)
            .forEach((task) => {
                const column = columns.find((col) => col.id === task.col);
                column?.items.push(task);
            });

        return columns;
    }
    static dynamicColumns(project: ProjectResponse): dynamicColumnType[] {
        const output: dynamicColumnType[] = [];
        project?.columns?.forEach((element) => {
            output.push({
                id: element.column_id,
                name: element.name,
                items: [],
            });
        });
        return output;
    }

    static getListItemsForInvestment(tasks: TaskResponse[], project: ProjectResponse) {
        const columns = KanbanHelper.dynamicColumns(project);

        (tasks || [])
            ?.slice()
            .sort((i1, i2) => i1.position - i2.position)
            .forEach((task) => {
                const column = columns.find((col) => col.id === task.col);
                column?.items.push(task);
            });

        return columns;
    }

    static getColumns(): ColumnType[] {
        return [
            { id: 1, name: TaskStatus.NOT_STARTED, items: [] },
            { id: 2, name: TaskStatus.IN_WORK, items: [] },
            { id: 3, name: TaskStatus.REVIEW, items: [] },
            { id: 4, name: TaskStatus.DONE, items: [] },
        ];
    }
}
