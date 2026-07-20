import React from 'react';
import { Skeleton } from 'components/new-skeleton';
import css from './payments-item-skeleton.module.scss';

export const PaymentsItemSkeleton: React.FC = () => {
    return (
        <div className={css.root}>
            <div className={css.col_grow}>
                <Skeleton
                    styles={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                    }}
                />

                <Skeleton
                    styles={{
                        marginLeft: 6,
                        height: 22,
                        maxWidth: 64,
                        borderRadius: 5,
                    }}
                />
            </div>
            <div className={css.col_200}>
                <Skeleton
                    styles={{
                        height: 15,
                        maxWidth: 85,
                        borderRadius: 5,
                    }}
                />
                <Skeleton
                    styles={{
                        marginTop: 6,
                        height: 15,
                        maxWidth: 45,
                        borderRadius: 5,
                    }}
                />
            </div>
            <div className={css.col_200}>
                <Skeleton
                    styles={{
                        height: 15,
                        maxWidth: 45,
                        borderRadius: 5,
                    }}
                />
            </div>
            <div className={css.col_214}>
                <Skeleton
                    styles={{
                        height: 15,
                        maxWidth: 45,
                        borderRadius: 5,
                    }}
                />
            </div>
            <div className={css.col_200}>
                <Skeleton
                    styles={{
                        height: 15,
                        maxWidth: 85,
                        borderRadius: 5,
                    }}
                />
                <Skeleton
                    styles={{
                        marginTop: 6,
                        height: 15,
                        maxWidth: 45,
                        borderRadius: 5,
                    }}
                />
            </div>
            <div className={css.col_btn}>
                <Skeleton
                    styles={{
                        height: 30,
                        minWidth: 84,
                        width: 84,
                        borderRadius: 20,
                    }}
                />
            </div>
            <div className={css.col_dots}>
                <Skeleton
                    styles={{
                        height: 4,
                        width: 4,
                        borderRadius: 50,
                    }}
                />

                <Skeleton
                    styles={{
                        marginTop: 1.75,
                        height: 4,
                        width: 4,
                        borderRadius: 50,
                    }}
                />

                <Skeleton
                    styles={{
                        marginTop: 1.75,
                        height: 4,
                        width: 4,
                        borderRadius: 50,
                    }}
                />
            </div>
        </div>
    );
};
