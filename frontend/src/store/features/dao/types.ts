import { IWidget } from 'utils/types/DAO';

export type ChangeLayoutViewType = {
    id: number;
    widgets: IWidget[];
};

export type ToggleActiveWidgetType = {
    viewId: string;
    widgetId: number;
};

export type UpdateLayoutViewType = {
    viewId: string;
    widgets: IWidget[];
};
