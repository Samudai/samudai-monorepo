import { Skeleton } from 'components/new-skeleton';
import css from './settings-profile-skeleton.module.scss';

export const SettingsProfileSkeleton = () => {
    return (
        <div className={css.root}>
            <div className={css.links}>
                {[1, 2, 3, 4].map((index) => (
                    <Skeleton
                        styles={{
                            marginTop: index === 1 ? 0 : 48,
                            height: 33,
                            borderRadius: 5,
                        }}
                        key={index}
                    />
                ))}
            </div>

            <div className={css.content}>
                <Skeleton
                    styles={{
                        maxWidth: 155,
                        height: 33,
                        borderRadius: 5,
                    }}
                />

                {[1, 2, 3].map((index) => (
                    <Skeleton
                        styles={{
                            marginTop: 32,
                            maxWidth: 302,
                            height: 53,
                            borderRadius: 15,
                        }}
                        key={index}
                    />
                ))}

                <Skeleton
                    styles={{
                        marginTop: 32,
                        maxWidth: 302,
                        height: 100,
                        borderRadius: 15,
                    }}
                />

                <Skeleton
                    styles={{
                        marginTop: 32,
                        maxWidth: 398,
                        height: 53,
                        borderRadius: 15,
                    }}
                />

                <Skeleton
                    styles={{
                        marginTop: 32,
                        maxWidth: 155,
                        height: 33,
                        borderRadius: 5,
                    }}
                />

                <ul className={css.linkList}>
                    {[1, 2, 3, 4].map((index) => (
                        <li className={css.linkList_item} key={index}>
                            <Skeleton
                                styles={{
                                    width: 39,
                                    height: 39,
                                    borderRadius: 100,
                                }}
                            />

                            <Skeleton
                                styles={{
                                    marginLeft: 16,
                                    height: 54,
                                    maxWidth: 361,
                                    borderRadius: 15,
                                }}
                            />
                        </li>
                    ))}
                </ul>

                {[1, 2].map((index) => (
                    <div key={index}>
                        <Skeleton
                            styles={{
                                marginTop: 32,
                                maxWidth: 155,
                                height: 33,
                                borderRadius: 5,
                            }}
                        />

                        <Skeleton
                            styles={{
                                marginTop: 16,
                                maxWidth: 464,
                                height: 53,
                                borderRadius: 15,
                            }}
                        />

                        <Skeleton
                            styles={{
                                marginTop: 32,
                                maxWidth: 155,
                                height: 33,
                                borderRadius: 5,
                            }}
                        />

                        <div className={css.margin}>
                            <ul className={css.skills}>
                                {[1, 2, 3, 4, 5, 6].map((idx) => (
                                    <li className={css.skills_item} key={idx}>
                                        <Skeleton
                                            styles={{
                                                borderRadius: 20,
                                                height: 30,
                                                width: 163,
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
