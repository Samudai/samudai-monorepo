export enum WidgetList {
    AboutDao,
    ExpectedEvents,
    Calendar,
    Reviews,
    Projects,
    Twitter,
    RecentActivity,
    ContributorProfiles,
    MonthlyPlan,
    TotalBalance,
    Portfolio,
    Notifications,
    Discussions,
    Transactions,
    Chart,
    Proposals,
    Blogs,
    Tokens,
    DealPipeline,
    Links,
}

export interface IWidget {
    id: WidgetList;
    name: string;
    draggable: boolean;
    active: boolean;
    row_id: number;
    col_id: number;
    order: number;
    popup_id: number;
    dashboard_widget_id?: number;
    dashboard_id?: number;
}

export interface IView {
    id: string;
    name: string;
    is_private: boolean;
    widgets: IWidget[];
    dashboard_uuid?: string;
}
