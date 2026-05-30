import { useEffect, useState } from 'react';
import { LogConcepts, LogFiles, LogMerge, LogTask } from '../../logs';
import { PeriodList } from '../../logs/ui';
import { Activity } from '@samudai_xyz/gateway-consumer-types/';
import dayjs from 'dayjs';
import styles from './activity-logs.module.scss';

interface ActivityLogsProps {
    activity: Activity[];
}

export const ActivityLogs: React.FC<ActivityLogsProps> = (activity) => {
    console.log(activity);
    const [data, setData] = useState<any>([]);

    const getUniqueDays = (data: any) => {
        const days: any = {};
        data.forEach((item: any) => {
            const date = dayjs(item.timestamp_property).format('YYYY-MM-DD');
            days[date] = [];
        });
        data.forEach((item: any) => {
            const date = dayjs(item.timestamp_property).format('YYYY-MM-DD');
            days[date].push(item);
        });

        setData(days);
    };

    useEffect(() => {
        getUniqueDays(activity.activity);
    }, [activity]);

    // dayjs(timestamp).format('YYYY-MM-DD')
    return (
        <div className={styles.root}>
            {activity?.activity?.length > 0 ? (
                Object.keys(data)?.map((day) => {
                    return (
                        <PeriodList key={day} date={day}>
                            {data[day].map((item: any) => {
                                return <LogMerge key={item} data={item} />;
                            })}
                        </PeriodList>
                    );
                })
            ) : (
                <p>No Activity</p>
            )}
            <PeriodList date="2022-09-17">
                <LogTask />
                <LogFiles />
                {/* <LogMerge /> */}
                <LogConcepts />
            </PeriodList>
            <PeriodList date="2022-09-10">{/* <LogMerge /> */}</PeriodList>
        </div>
    );
};
