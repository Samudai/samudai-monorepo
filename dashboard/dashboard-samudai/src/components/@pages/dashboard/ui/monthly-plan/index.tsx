import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyGetMonthlyProgressByDaoIdQuery } from 'store/services/projects/totalProjects';
import Block from 'components/Block/Block';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import Skeleton from 'components/Skeleton/Skeleton';
import { toast } from 'utils/toast';
import { MonthlyPlanSkeleton } from './components';
import { doneData, targetData } from './lib';
import './monthly-plan.scss';

export const MonthlyPlan: React.FC = () => {
    const [getProgress] = useLazyGetMonthlyProgressByDaoIdQuery();
    const { daoid } = useParams();
    const [total, setTotal] = useState<number>(0);
    const [complete, setComplete] = useState<number>(0);

    useEffect(() => {
        const fn = async () => {
            try {
                const res = await getProgress(daoid!).unwrap();

                let count = 0;
                let completed = 0;
                res.data.projects.map((item: any) => {
                    count += item.task_count;
                    completed += item.completed_task_count;
                });
                setTotal(count);
                targetData.value = count;
                targetData.duration = count;
                setComplete(completed);
                doneData.value = completed;
                doneData.duration = count;
            } catch (err) {
                toast('Failure', 5000, 'Work Plan fetching failed', '');
            }
        };
        fn();
    }, []);

    return (
        <Block className="mountly-plan" data-analytics-parent="monthly-work-plan-widget-parent">
            <Block.Header>
                <Block.Title>Work Plan</Block.Title>
            </Block.Header>
            <Block.Scrollable>
                <Skeleton
                    className="mountly-plan__content"
                    loading={false}
                    skeleton={<MonthlyPlanSkeleton />}
                >
                    <div className="mountly-plan__info">
                        <p className="mountly-plan__status">Tasks finished</p>
                        <ul className="mountly-plan__values">
                            <li className="mountly-plan__value orange">
                                <span>Total</span> <strong>{total}</strong>
                            </li>
                            <li className="mountly-plan__value green">
                                <span>Done</span> <strong>{complete}</strong>
                            </li>
                        </ul>
                    </div>
                    <div className="mountly-plan__progress">
                        <div className="mountly-plan__progress-box">
                            <ProgressBar
                                className="mountly-plan__chart"
                                data={targetData}
                                width={152}
                                height={152}
                            />
                            <ProgressBar
                                className="mountly-plan__chart mountly-plan__chart_small"
                                data={doneData}
                                width={110}
                                height={110}
                            />
                        </div>
                    </div>
                </Skeleton>
            </Block.Scrollable>
        </Block>
    );
};
