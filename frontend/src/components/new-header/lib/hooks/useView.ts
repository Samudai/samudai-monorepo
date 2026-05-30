import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types/';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import {
    appendView,
    changeActiveView,
    selectDaoViewActive,
    selectDaoViews,
    updateView,
} from 'store/features/dao/slice';
import {
    useCreateDashboardMutation,
    useUpdateDashboardNameMutation,
} from 'store/services/Dashboard/dashboard';
import { createDashboardRequest } from 'store/services/Dashboard/model';
import store from 'store/store';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';

export const useView = () => {
    const { daoid } = useParams();
    const { id, name } = useTypedSelector(selectDaoViewActive);
    const views = useTypedSelector(selectDaoViews);
    const activeDao = useTypedSelector(selectActiveDao);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const dispatch = useTypedDispatch();
    const [createDashboard] = useCreateDashboardMutation();
    const [updateDashboardName] = useUpdateDashboardNameMutation();

    // States
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [viewsLocal, setViewsLocal] = useState(views);

    const handleCreateView = async () => {
        try {
            toast('Attention', 5000, 'Please wait', 'Creating a New View for the dashboard')();
            setButtonDisabled(true);
            const viewLength = views.length;
            const payload: createDashboardRequest = {
                dashboard: {
                    dao_id: activeDao,
                    dashboard_name: `View ${viewLength + 1}`,
                    description: `DAO View ${viewLength + 1}`,
                    default: false,
                    visibility: 'public',
                },
            };
            const newDashboard = await createDashboard(payload).unwrap();
            console.log(newDashboard.data.dashboard);
            dispatch(appendView(newDashboard.data.dashboard));
            updateActivity({
                dao_id: activeDao!,
                member_id: getMemberId(),
                action_type: ActivityEnums.ActionType.VIEW_CREATED,
                visibility: ActivityEnums.Visibility.PUBLIC,
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
                    project_name: '',
                },
                task: {
                    task_name: '',
                },
                action: {
                    message: '',
                },
                metadata: {
                    view_name: payload.dashboard.dashboard_name,
                },
            });
            setButtonDisabled(false);
        } catch (err) {
            console.log(err);
            toast(
                'Failure',
                5000,
                'Error creating dashboard',
                'Failed to create a new dashboard'
            )();
            setButtonDisabled(false);
        }
    };

    const handleChangeView = (viewId: string) => {
        if (viewId !== id) {
            dispatch(changeActiveView(viewId));
        }
    };

    const handleSubmitViewValue = async (viewId: string, value: string) => {
        try {
            console.log(' TEST ', viewId, value);
            if (value) {
                const foundView = views.find((view) => view.id === viewId);
                if (foundView) {
                    const newView = viewsLocal.filter((view) => view.id === viewId);

                    const res = await updateDashboardName({
                        dashboard: { dashboard_id: viewId, dashboard_name: value },
                    }).unwrap();

                    dispatch(updateView(newView[0]));
                    updateActivity({
                        dao_id: activeDao!,
                        member_id: getMemberId(),
                        action_type: ActivityEnums.ActionType.VIEW_RENAMED,
                        visibility: ActivityEnums.Visibility.PUBLIC,
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
                            project_name: '',
                        },
                        task: {
                            task_name: '',
                        },
                        action: {
                            message: '',
                        },
                        metadata: {
                            old_view: foundView.name,
                            new_view: value,
                        },
                    });
                    if (res)
                        toast('Success', 5000, 'View Updated', 'Successfully Updated View Name')();
                }
            }
        } catch (err) {
            console.log(err);
            toast(
                'Failure',
                5000,
                'View Name Update Failed',
                'Something went wrong while updating view name.'
            )();
        }
        console.log(viewId, value);
    };

    useEffect(() => {
        setViewsLocal(views);
    }, [views]);

    return {
        handleSubmitViewValue,
        handleChangeView,
        handleCreateView,
        viewsLocal,
        access,
        buttonDisabled,
        daoActiveId: id,
    };
};
