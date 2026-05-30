import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccessEnums, ActivityEnums } from '@samudai_xyz/gateway-consumer-types/';
import clsx from 'clsx';
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
import usePopup from 'hooks/usePopup';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import DeleteView from 'components/@popups/DeleteView/DeleteView';
import CloseButton from 'ui/@buttons/Close/Close';
import Radio from 'ui/@form/Radio/Radio';
import Select from 'ui/@form/Select/Select';
import TextInput from 'ui/@form/TextInput/TextInput';
import PlusIcon from 'ui/SVG/PlusIcon';
import { updateActivity } from 'utils/activity/updateActivity';
import { toast } from 'utils/toast';
import { IView } from 'utils/types/DAO';
import { getMemberId } from 'utils/utils';
import './DaoViewBtn.scss';

const DaoViewBtn: React.FC = () => {
    const deleteView = usePopup();
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [removeView, setRemoveView] = useState<IView | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);
    const [activeSelect, setActiveSelect] = useState<boolean>(false);
    const { id, name } = useTypedSelector(selectDaoViewActive);
    const [createDashboard] = useCreateDashboardMutation();
    const [updateDashboardName] = useUpdateDashboardNameMutation();
    const views = useTypedSelector(selectDaoViews);
    const [viewsLocal, setViewsLocal] = useState(views);
    const [editView, setEditView] = useState<(typeof views)[0] | null>(null);
    const dispatch = useTypedDispatch();
    const activeDao = useTypedSelector(selectActiveDao);
    const { daoid } = useParams();
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
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

    const handleRemoveView = (view: IView) => {
        setRemoveView(view);
        deleteView.open();
    };

    const handleToggleSelect = () => {
        setActiveSelect(!activeSelect);
    };

    const handleCloseOutside = (e: MouseEvent) => {
        if (deleteView.active) return;
        const selectEl = selectRef.current;
        if (selectEl && !e.composedPath().includes(selectEl)) {
            setActiveSelect(false);
        }
    };

    const handleChangeViewValue = (viewId: string, value: string) => {
        setViewsLocal(
            viewsLocal.map((view) => (view.id === viewId ? { ...view, name: value } : view))
        );
    };

    const handleClearViewValue = () => {
        if (editView) {
            const foundView = views.find((view) => view.id === editView.id);
            if (foundView) {
                setViewsLocal(
                    viewsLocal.map((view) =>
                        view.id === editView.id ? { ...view, name: foundView!.name } : view
                    )
                );
            }
            setEditView(null);
        }
    };

    const handleSubmitViewValue = async (viewId: string, value: string) => {
        try {
            if (editView) {
                const foundView = views.find((view) => view.id === editView.id);
                if (foundView) {
                    const newView = viewsLocal.filter((view) => view.id === editView.id);
                    console.log(newView, foundView);

                    if (newView[0].name === foundView.name) return;
                    const res = await updateDashboardName({
                        dashboard: { dashboard_id: editView.id, dashboard_name: value },
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

    // console.log(editView);

    useEffect(() => {
        setViewsLocal(views);
    }, [views]);

    return (
        <div className={clsx('page-dao-view__select', activeSelect && 'active')} ref={selectRef}>
            <Select.Button className="page-dao-view__select-btn" onClick={handleToggleSelect} arrow>
                <span>{name}</span>
            </Select.Button>
            <Select.List
                className="page-dao-view__select-list"
                active={activeSelect}
                onClickOutside={handleCloseOutside}
            >
                {viewsLocal.map((view: IView) => {
                    const active = view.id === id;

                    return (
                        <Select.Item
                            className={clsx('page-dao-view__select-item', { active })}
                            key={view.id}
                        >
                            <Radio
                                value={view.id}
                                checked={active}
                                onChange={() => handleChangeView(view.id)}
                            />

                            <TextInput
                                className="page-dao-view_select-item-content-input"
                                classNameAll="page-dao-view_select-item-content-name"
                                value={view.name}
                                onInputChange={(data) => handleChangeViewValue(view.id, data)}
                                onFocus={() => setEditView(view)}
                                onBlur={() =>
                                    setEditView(editView?.id === view.id ? null : editView)
                                }
                                onSubmit={(data) => handleSubmitViewValue(view.id, data)}
                                onClear={handleClearViewValue}
                                isActive={editView?.id === view.id}
                            />
                            {!active && editView?.id !== view.id && access && (
                                <CloseButton
                                    className="page-dao-view__select-remove"
                                    onClick={() => handleRemoveView(view)}
                                />
                            )}
                        </Select.Item>
                    );
                })}
                {access && (
                    <Select.After className="page-dao-view__after">
                        <button
                            className="page-dao-view__create-view"
                            disabled={buttonDisabled}
                            onClick={handleCreateView}
                        >
                            <PlusIcon />
                            <span>Create</span>
                        </button>
                    </Select.After>
                )}
            </Select.List>
            <DeleteView view={removeView} active={deleteView.active} onClose={deleteView.close} />
        </div>
    );
};

export default DaoViewBtn;
