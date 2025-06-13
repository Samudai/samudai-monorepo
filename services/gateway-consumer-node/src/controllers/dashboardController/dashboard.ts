import axios from 'axios';
import { Request, Response } from 'express';
import { Dashboard, DashboardName, DashboardResponse } from '@samudai_xyz/gateway-consumer-types';

export class DashBoardController {
    createDashboard = async (req: Request, res: Response) => {
        try {
            const dashboard: Dashboard = req.body.dashboard;
            dashboard.created_at = new Date().toISOString();

            const result = await axios.post(`${process.env.SERVICE_DASHBOARD}/dashboard/create`, {
                dashboard: dashboard,
            });
            let dashboardResponse: DashboardResponse = {
                ...dashboard,
                widgets: [],
                dashboard_id: result.data.dashboard_id,
            };
            dashboardResponse.dashboard_id = result.data.dashboard_id;
            if (result.status === 200) {
                const widgetResult = await axios.get(
                    `${process.env.SERVICE_DASHBOARD}/dashboardwidget/list/${dashboardResponse.dashboard_id}`
                );
                if (widgetResult.data.dashboard_widgets.length > 0) {
                    dashboardResponse.widgets = widgetResult.data.dashboard_widgets;
                } else {
                    dashboardResponse.widgets = [];
                }
            }
            res.status(201).send({ message: 'Dashboard created successfully', data: { dashboard: dashboardResponse } });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while creating a dashboard', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    listDashboardForDAO = async (req: Request, res: Response) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_DASHBOARD}/dashboard/list/${req.params.daoId}`);
            if (res.locals.default) {
                return res.status(200).send({ message: 'Dashboard list successfully', data: result.data });
            } else {
                const dashboardList = result.data.dashboards.filter((dashboard: any) => {
                    return dashboard.default === true && dashboard.visibility === 'public';
                });
                return res
                    .status(200)
                    .send({ message: 'Dashboard list successfully', data: { dashboards: dashboardList } });
            }
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while listing dashboards', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateDashboard = async (req: Request, res: Response) => {
        try {
            const dashboard: Dashboard = req.body.dashboard;
            const result = await axios.put(`${process.env.SERVICE_DASHBOARD}/dashboard/update`, {
                dashboard: dashboard,
            });
            res.status(200).send({ message: 'Dashboard updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating a dashboard', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateDashboardName = async (req: Request, res: Response) => {
        try {
            const dashboard: DashboardName = req.body.dashboard;
            const result = await axios.post(`${process.env.SERVICE_DASHBOARD}/dashboard/update/name`, {
                dashboard_id: dashboard.dashboard_id,
                dashboard_name: dashboard.dashboard_name,
            });
            res.status(200).send({ message: 'Dashboard Name updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating a dashboard', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    deleteDashboard = async (req: Request, res: Response) => {
        try {
            const result = await axios.delete(
                `${process.env.SERVICE_DASHBOARD}/dashboard/delete/${req.params.dashboardId}`
            );
            res.status(200).send({ message: 'Dashboard deleted successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while deleting a dashboard', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateDashboardVisibility = async (req: Request, res: Response) => {
        try {
            const dashboard_id = req.params.dashboardId;
            const visibility = req.body.visibility;
            const result = await axios.post(`${process.env.SERVICE_DASHBOARD}/dashboard/update/visibility`, {
                dashboard_id: dashboard_id,
                visibility: visibility,
            });
            res.status(200).send({ message: 'Dashboard visibility updated successfully', data: result.data });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while updating dashboard visibility',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
}
