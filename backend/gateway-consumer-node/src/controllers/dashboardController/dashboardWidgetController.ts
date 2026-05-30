import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { DashboardWidget } from '@samudai_xyz/gateway-consumer-types';

export class DashBoardWidgetController {
    // This function is not in use by frontend
    createWidgets = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const widgets: DashboardWidget = req.body.widgets;
            const result = await axios.post(`${process.env.SERVICE_DASHBOARD}/dashboardwidget/create`, {
                dashboard_widget: widgets,
            });
            new CreateSuccess(res, 'Widgets', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating widgets'));
        }
    };

    listWidgetsForDashboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(
                `${process.env.SERVICE_DASHBOARD}/dashboardwidget/list/${req.params.dashboardId}`
            );
            new FetchSuccess(res, 'Widgets List', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while listing widgets'));
        }
    };

    updateWidgets = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dashboardId: string = req.body.dashboardId;
            const widgets: DashboardWidget[] = req.body.widgets;
            const result = await axios.post(`${process.env.SERVICE_DASHBOARD}/dashboardwidget/update`, {
                dashboard_id: dashboardId,
                dashboard_widgets: widgets,
            });
            new UpdateSuccess(res, 'Widgets', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating widgets'));
        }
    };

    deleteWidgets = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.delete(
                `${process.env.SERVICE_DASHBOARD}/dashboardwidget/delete/${req.params.widgetId}`
            );
            new DeleteSuccess(res, 'Widgets', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting widgets'));
        }
    };

    updateWidgetActive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.post(`${process.env.SERVICE_DASHBOARD}/dashboardwidget/update/active`, {
                dashboard_widget_id: req.body.dashboard_widget_id,
                active: req.body.active,
            });
            new UpdateSuccess(res, 'Widgets active status', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating widget active status'));
        }
    };
}
