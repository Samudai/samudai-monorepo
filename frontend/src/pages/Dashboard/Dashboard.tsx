import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { selectActiveViewId } from '../../store/features/dao/slice';
import { sendDaoAnalytics } from '../../utils/activity/sendDaoAnalytics';
import { getMemberId } from '../../utils/utils';
import DaoHead from './Dao_Components/DaoHead/DaoHead';
import { createLayout, replaceWidgets } from 'data/view/utils';
import {
    changeTokenGating,
    changeTokenVal,
    selectActiveDao,
    selectActiveDaoName,
    selectTokenGating,
    selectTokenVal,
} from 'store/features/common/slice';
import {
    addView,
    addViews,
    changeActiveView,
    selectDaoViewActive,
    updateLayoutView,
} from 'store/features/dao/slice';
import {
    useLazyGetDashboardIdQuery,
    useUpdateDashboardWidgetMutation,
} from 'store/services/Dashboard/dashboard';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import AdminWidget from 'components/@pages/dashboard/elements/AdminWidget';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import { verifyLitAccess } from 'utils/lit-protocol/litProtocol';
import { toast } from 'utils/toast';
import { IWidget } from 'utils/types/DAO';
import './Dashboard.scss';

const Dao = () => {
    const activeDao = useTypedSelector(selectActiveDao);
    const [getDashboard, { isFetching }] = useLazyGetDashboardIdQuery();
    const [dashboardId, setDashboardId] = useState<string>('');
    const activeDaoName = useTypedSelector(selectActiveDaoName);
    const [updateDashboard] = useUpdateDashboardWidgetMutation();
    const token_gating = useTypedSelector(selectTokenGating);
    const token_val = useTypedSelector(selectTokenVal);
    const [currentWidget, setCurrentWidget] = useState<IWidget | null>(null);
    const { widgets, dashboard_uuid } = useTypedSelector(selectDaoViewActive);
    const activeViewId = useTypedSelector(selectActiveViewId);
    const [fetchDashboard, setFetchDashboard] = useState<boolean>(false);
    const navigate = useNavigate();
    const { daoid } = useParams();
    const [tokenGating, setTokenGating] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);

    useEffect(() => {
        daoid &&
            getDashboard(daoid)
                .unwrap()
                .then((res) => {
                    if (res.data?.dashboards && res.data?.dashboards?.length === 0) return;
                    if (res.data?.dashboards && res.data?.dashboards?.length > 1) {
                        dispatch(addViews(res?.data?.dashboards || []));
                    } else {
                        dispatch(addView(res?.data?.dashboards[0] || []));
                    }
                    setDashboardId(res?.data?.dashboards[0]?.dashboard_id || '1');
                    setFetchDashboard(true);
                    // console.log('dbv', res.data?.dashboards);

                    // setDashboardId(res?.data?.dashboards[0]?.dashboard_id || '1');
                    dispatch(changeActiveView(res?.data?.dashboards?.[0]?.dashboard_id || ''));
                    dispatch(
                        updateLayoutView({
                            viewId: dashboardId,
                            widgets: res.data?.dashboards?.[0]?.widgets || widgets,
                        })
                    );
                    sendDaoAnalytics({
                        dao_id: daoid,
                        member_id: getMemberId() || '',
                    });
                })
                .catch((err) => {
                    setFetchDashboard(true);
                    console.log(err);
                });
    }, [daoid, activeDao]);

    useEffect(() => {
        setDashboardId(activeViewId);
        // dispatch(
        //   updateLayoutView({
        //     viewId: dashboardId,
        //     widgets: widgets,
        //   })
        // );
    }, [activeViewId]);

    useEffect(() => {
        // TODO: fix this (sends request every time a view is changed), needs to be only when widgets are changed
        fetchDashboard &&
            updateDashboard({ widgets: widgets, dashboardId: activeViewId })
                .unwrap()
                .catch((err) => {
                    console.log(err);
                });
    }, [widgets]);

    useEffect(() => {
        setTokenGating(token_gating);
    }, [token_gating]);

    const [isDraggable, setDraggable] = useState<boolean>(false);
    const dispatch = useTypedDispatch();

    const onReplaceWidgets = (w1: IWidget, w2: IWidget) => {
        const layout = replaceWidgets(widgets, w1, w2);
        dispatch(
            updateLayoutView({
                viewId: dashboardId,
                widgets: layout,
            })
        );
    };

    const handleVerify = async () => {
        try {
            const res = await verifyLitAccess(activeDao);
            if (res) {
                dispatch(changeTokenGating({ token_gating: true }));
                dispatch(changeTokenVal({ token_val: 'true' }));
                setTokenGating(true);
            } else {
                toast('Failure', 3000, 'No Access', '')();
            }
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    if (!widgets.length) return null;
    if (!fetchDashboard) return <Loader />;

    return !!token_gating && !token_val ? (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: '100vh',
            }}
            data-analytics-page="dao_dashboard"
        >
            <div style={{ color: 'white', marginBottom: '20px' }}>
                {activeDaoName} has been token gated, please verify
            </div>
            <Button color="green" style={{ fontSize: '1em' }} onClick={handleVerify}>
                Verify
            </Button>
        </div>
    ) : (!!token_gating && !!token_val) || !token_gating ? (
        <React.Fragment>
            {isFetching ? (
                <Loader />
            ) : (
                <div className="page-dao" data-analytics-page="dao_dashboard">
                    <DaoHead />
                    <div className="container page-dao__container">
                        <div className="page-dao__dashboard">
                            {createLayout(widgets).map((row, rowId) => (
                                <div className={`page-dao__row page-dao__row_${rowId}`} key={rowId}>
                                    {row.map((col, colId) => (
                                        <div className="page-dao__col" key={colId}>
                                            {col.map((widget) => (
                                                <AdminWidget
                                                    currentWidget={currentWidget}
                                                    setCurrentWidget={setCurrentWidget}
                                                    isDraggable={isDraggable}
                                                    setDraggable={setDraggable}
                                                    onDrop={onReplaceWidgets}
                                                    widget={widget}
                                                    key={widget.name}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    ) : (
        <div></div>
    );
};

export default Dao;
