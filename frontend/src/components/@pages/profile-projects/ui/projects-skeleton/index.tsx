import { Skeleton } from 'components/new-skeleton';
import css from './projects-skeleton.module.scss';

export const ProjectsSkeleton = () => {
    return (
        <div>
            <ul className={css.stat}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <li className={css.stat_item} key={index}>
                        <Skeleton
                            styles={{
                                height: 113,
                            }}
                        />
                    </li>
                ))}
            </ul>

            <div className={css.tabs}>
                <Skeleton
                    styles={{
                        height: 33,
                        borderRadius: 5,
                        maxWidth: 155,
                    }}
                />

                <Skeleton
                    styles={{
                        marginLeft: 32,
                        height: 33,
                        borderRadius: 5,
                        maxWidth: 155,
                    }}
                />
            </div>

            <ul className={css.list}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <li className={css.list_item} key={index}>
                        <Skeleton
                            styles={{
                                height: 69,
                                borderRadius: 16,
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
