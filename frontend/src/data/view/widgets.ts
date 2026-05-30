import {
    About,
    Activity,
    Balance,
    Blogs,
    Calendar,
    DealPipeline,
    Discussions,
    ExpectedEvents as Events,
    Profiles,
    Projects,
    Reviews,
    Tokens,
    Proposals,
    Transactions,
    Twitter,
} from 'components/@pages/dashboard';
import Chart from 'components/@pages/dashboard/elements/Chart/Chart';
import { WidgetList } from 'utils/types/DAO';

interface WidgetComponent {
    id: WidgetList;
    component: (() => JSX.Element) | React.FC;
}

export const widgets: WidgetComponent[] = [
    { id: WidgetList.Chart, component: Chart },
    { id: WidgetList.Calendar, component: Calendar },
    { id: WidgetList.Proposals, component: Proposals },
    { id: WidgetList.Blogs, component: Blogs },
    { id: WidgetList.Projects, component: Projects },
    { id: WidgetList.ContributorProfiles, component: Profiles },
    { id: WidgetList.AboutDao, component: About },
    { id: WidgetList.Reviews, component: Reviews },
    { id: WidgetList.ExpectedEvents, component: Events },
    { id: WidgetList.RecentActivity, component: Activity },
    { id: WidgetList.Twitter, component: Twitter },
    // { id: WidgetList.MonthlyPlan, component: MonthlyPlan },
    { id: WidgetList.TotalBalance, component: Balance },
    { id: WidgetList.Tokens, component: Tokens },
    { id: WidgetList.Transactions, component: Transactions },
    // { id: WidgetList.Portfolio, component: Portfolio },
    // { id: WidgetList.Notifications, component: NotificationsCenter },
    { id: WidgetList.Discussions, component: Discussions },
    { id: WidgetList.DealPipeline, component: DealPipeline },
    // { id: WidgetList.Links, component: Links },
];
