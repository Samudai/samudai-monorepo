import { PayloadAction } from '@reduxjs/toolkit';
import { IView } from 'utils/types/DAO';
import { DaoSliceState } from './state';
import { ToggleActiveWidgetType, UpdateLayoutViewType } from './types';

const reducers = {
    // To add a new view to an empty array of views
    addView: (state: DaoSliceState, { payload }: PayloadAction<any>) => {
        const maxViewId = 1;
        state.views = [
            {
                id: payload.dashboard_id,
                is_private: false,
                name: payload.dashboard_name,
                widgets: payload.widgets,
                dashboard_uuid: payload.dashboard_id,
            },
        ];
    },

    // To add to an existing array of views
    appendView: (state: DaoSliceState, { payload }: PayloadAction<any>) => {
        const maxViewId = state.views.length;
        state.views.push({
            id: payload.dashboard_id,
            is_private: false,
            name: payload.dashboard_name,
            widgets: payload.widgets,
            dashboard_uuid: payload.dashboard_id,
        });
    },

    // To add an array of views
    addViews: (state: DaoSliceState, { payload }: PayloadAction<any[]>) => {
        state.views = payload.map((view, idx): IView => {
            return {
                id: view.dashboard_id,
                is_private: false,
                name: view.dashboard_name,
                widgets: view.widgets,
                dashboard_uuid: view.dashboard_id,
            };
        });
    },

    updateView: (state: DaoSliceState, { payload }: PayloadAction<any>) => {
        state.views = state.views.map((view) => {
            if (view.id === payload.id) {
                view = payload;
            }
            return view;
        });
    },
    removeView: (state: DaoSliceState, { payload }: PayloadAction<string>) => {
        state.views = state.views.filter((view) => view.id !== payload);
    },
    changeActiveView: (state: DaoSliceState, { payload }: PayloadAction<string>) => {
        state.activeViewId = payload;
    },
    // New
    toggleActiveView: (state: DaoSliceState, { payload }: PayloadAction<string>) => {
        state.activeViewId = payload;
    },
    togglePrivateView: (state: DaoSliceState, { payload }: PayloadAction<string>) => {
        state.views = state.views.map((view) => {
            if (view.id === payload) {
                view.is_private = !view.is_private;
            }
            return view;
        });
    },
    toggleActiveWidget: (
        state: DaoSliceState,
        { payload }: PayloadAction<ToggleActiveWidgetType>
    ) => {
        const view = state.views.find((view) => view.id === payload.viewId);
        if (view) {
            view.widgets = view.widgets.map((widget) => {
                if (widget.id === payload.widgetId) {
                    widget.active = !widget.active;
                }
                return widget;
            });
        }
    },
    updateLayoutView: (state: DaoSliceState, { payload }: PayloadAction<UpdateLayoutViewType>) => {
        state.views = state.views.map((view) => ({
            ...view,
            widgets: view.id === payload.viewId ? payload.widgets : view.widgets,
        }));
    },
};

export default reducers;
