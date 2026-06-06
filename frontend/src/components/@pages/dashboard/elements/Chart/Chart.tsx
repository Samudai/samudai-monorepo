import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Line from './extensions/Line';
import ChartSkeleton from './skeleton/ChartSkeleton';
import TabsSkeleton from './skeleton/ChartTabsSkeleton';
import { chartPeriod, chartTabs } from './utils/settings';
import { filterData } from './utils/utils';
import axios from 'axios';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import clsx from 'clsx';
import {
    useGetActiveForumsQuery,
    useGetActiveProjectTasksQuery,
    useGetJobApplicantsQuery,
    useGetPageVisitsQuery,
    useGetPendingProposalsQuery,
} from 'store/services/DaoAnalytics/daoAnalytics';
import useRequest from 'hooks/useRequest';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import ChartIcons from 'ui/SVG/chart';
import ChartTab from './ChartTab';
import ChartTooltip from './ChartTooltip';
import { ChartPeriodType, ChartTabType } from './types';
import './styles/Chart.scss';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const Chart: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<ChartTabType>(chartTabs[0]);
    const [activePeriod, setActivePeriod] = useState<ChartPeriodType>(chartPeriod[0]);
    const { daoid } = useParams();

    const { data: pageVisitData } = useGetPageVisitsQuery(daoid!, { skip: !daoid });
    const { data: jobApplicantData } = useGetJobApplicantsQuery(daoid!, { skip: !daoid });
    const { data: activeTaskData } = useGetActiveProjectTasksQuery(daoid!, { skip: !daoid });
    const { data: activeForumData } = useGetActiveForumsQuery(daoid!, { skip: !daoid });
    const { data: pendingProposalsData } = useGetPendingProposalsQuery(daoid!, { skip: !daoid });
    // const [pageVisitData, setPageVisitData] = useState<any[]>([]);
    const [fetchData, loading] = useRequest(async function (period: number) {
        const { data } = await axios.get<any[]>('/mockup/chart.json');
        setData(filterData(data).slice(0, period));
    });

    const onChangeTab = (tab: ChartTabType) => {
        setActiveTab(tab);
    };

    const currData = (type: string) => {
        switch (type) {
            case 'chart-users':
                return pageVisitData?.data.analytics;
            case 'chart-applicants':
                return jobApplicantData?.data.counts;
            case 'chart-proposals':
                return pendingProposalsData?.data.pending_proposal_count;
            case 'chart-project-tasks':
                return activeTaskData?.data.open_task_count;
            case 'chart-forums':
                return activeForumData?.data.active_forum_count;
            default:
                return null;
        }
    };

    // const AfterPageVisit = (data: any) => {
    //     console.log('analytics data', data.data.analytics);
    //     setPageVisitData(data.data.analytics);
    //     console.log('analytics period', activePeriod);
    // };

    // useEffect(() => {
    //     const fn = async () => {
    //         const data = await fetchPageVisits(daoid!).unwrap();
    //         setPageVisitData(data.data.analytics);
    //     };
    //     fn();
    // }, [daoid]);

    useEffect(() => {
        fetchData(activePeriod.value);
    }, [activeTab, activePeriod]);

    return (
        <Block className="chart">
            <Skeleton
                className="chart__tabs"
                component="ul"
                loading={loading}
                skeleton={<TabsSkeleton />}
            >
                {chartTabs.map((tab) => (
                    <ChartTab
                        tab={tab}
                        key={tab.type}
                        active={tab.type === activeTab.type}
                        onChangeTab={(tab) => onChangeTab(tab)}
                        values={currData(tab.type)}
                    />
                ))}
            </Skeleton>
            <Block className="chart__content">
                <Skeleton className="chart__box" loading={loading} skeleton={<ChartSkeleton />}>
                    <Block.Header className={clsx('chart__header', activeTab.type)}>
                        <div className="chart__header-status">
                            <ChartTooltip active={false} payload={[{ value: 15 }]} />
                        </div>
                        <div className="chart__controls">
                            <div className="chart__controls-period">
                                {chartPeriod.map((period) => (
                                    <button
                                        className={clsx('chart__controls-period-btn', {
                                            active: period.value === activePeriod.value,
                                        })}
                                        onClick={setActivePeriod.bind(null, period)}
                                        key={period.name}
                                    >
                                        <span>{period.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="chart__controls-type">
                                <button className="chart__controls-type-btn active">
                                    <ChartIcons.LineChart />
                                </button>
                                <button className="chart__controls-type-btn">
                                    {/* <ChartIcons.BarChart /> */}
                                </button>
                            </div>
                        </div>
                    </Block.Header>
                    <div className="chart__container">
                        <div className="chart__container_line">
                            <Line
                                values={currData(activeTab.type) || []}
                                period={activePeriod}
                                tab={activeTab}
                            />
                        </div>
                    </div>
                </Skeleton>
            </Block>
        </Block>
    );
};

export default Chart;
