import { Skeleton } from 'components/new-skeleton';
import css from './daos-skeleton.module.scss';

export const DaosSkeleton = () => {
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
                                width: 345,
                                height: 180,
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
