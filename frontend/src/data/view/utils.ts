import { IWidget, WidgetList } from 'utils/types/DAO';
import { widgets } from './widgets';

export type ColsMap = Map<number, IWidget[]>;

export const getWidgetComponent = (id: WidgetList) => {
    return widgets.find((widget) => widget.id === id)?.component;
};

export const sortWidgetByOrder = (widgets: IWidget[]) => {
    return widgets.slice().sort((a, b) => a.order - b.order);
};

export const sortByFirstIdx = ([a]: [number, ...any], [b]: [number, ...any]) => a - b;

export const createLayout = (widgets: IWidget[]) => {
    const rows = new Map<number, ColsMap>();

    for (const widget of sortWidgetByOrder(widgets)) {
        if (rows.has(widget.row_id)) {
            const row = rows.get(widget.row_id);
            if (row?.has(widget.col_id)) {
                row.get(widget.col_id)?.push(widget);
            } else {
                row?.set(widget.col_id, [widget]);
            }
        } else {
            const cols: ColsMap = new Map();
            cols.set(widget.col_id, [widget]);
            rows.set(widget.row_id, cols);
        }
    }

    /* 
    Getting all rows and columns, 
    sorting and extracting values.
    Perfomance ~ 0.0002-0.0005ms.
    -----
    Data: 
    [
      [ - Row
        [WidgetData,...], - Col
        [WidgetData,...]  - Col
      ],
      ...
    ]
    -----
  */
    return Array.from(rows.entries())
        .sort(sortByFirstIdx)
        .map(([, cols]) => {
            return Array.from(cols.entries())
                .sort(sortByFirstIdx)
                .map(([, col]) => col);
        });
};

export const getPopupLayoutWidgets = (widgets: IWidget[]) => {
    const widget = widgets
        .filter((widget) => widget.popup_id !== -1)
        .sort((a, b) => a.popup_id - b.popup_id);
    return widget;
};

export const replaceWidgets = (widgets: IWidget[], w1: IWidget, w2: IWidget) => {
    const selected = Object.assign({}, w1);
    const dropped = Object.assign({}, w2);
    return widgets.slice().map((widget) => {
        if (widget.id === selected.id) {
            return {
                ...widget,
                col_id: dropped.col_id,
                row_id: dropped.row_id,
                order: dropped.order,
            };
        } else if (widget.id === dropped.id) {
            return {
                ...widget,
                col_id: selected.col_id,
                row_id: selected.row_id,
                order: selected.order,
            };
        }
        return widget;
    });
};
