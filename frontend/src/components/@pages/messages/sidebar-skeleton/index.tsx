import { Skeleton } from 'components/new-skeleton';
import React from 'react';
import css from './sidebar-skeleton.module.scss';

export const SidebarSkeleton: React.FC = () => {
    return (
        <div className={css.empty}>
            <ul className={css.list}>
                {[1, 2, 3, 4].map((index) => (
                    <li className={css.list_item} key={index}>
                        <Skeleton
                            styles={{
                                height: 89,
                                borderRadius: 8,
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
