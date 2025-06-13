import React from 'react';
import { Skeleton } from 'components/new-skeleton';
import css from './events-skeleton.module.scss';

interface EventsSkeletonProps {}

export const EventsSkeleton: React.FC<EventsSkeletonProps> = (props) => {
    return (
        <div className={css.root}>
            <Skeleton
                styles={{
                    maxWidth: 248,
                    height: 44,
                    borderRadius: 8,
                }}
            />
            <ul className={css.list}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <li className={css.list_item} key={index}>
                        <Skeleton
                            styles={{
                                width: 160,
                                height: 130,
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
