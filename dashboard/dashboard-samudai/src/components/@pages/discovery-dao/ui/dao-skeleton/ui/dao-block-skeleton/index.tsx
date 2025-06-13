import { Skeleton } from 'components/new-skeleton';
import css from './dao-block-skeleton.module.scss';

export const DaoBlockSkeleton = () => {
    return (
        <div className={css.root}>
            <Skeleton
                styles={{
                    height: 27,
                    borderRadius: 4,
                }}
            />

            <Skeleton
                styles={{
                    marginTop: 24,
                    height: 27,
                    borderRadius: 4,
                }}
            />

            <div style={{ display: 'flex', marginTop: 24 }}>
                <Skeleton
                    styles={{
                        maxWidth: 127,
                        height: 27,
                        borderRadius: 36,
                    }}
                />

                <Skeleton
                    styles={{
                        maxWidth: 127,
                        marginLeft: 24,
                        height: 27,
                        borderRadius: 36,
                    }}
                />
            </div>
        </div>
    );
};
