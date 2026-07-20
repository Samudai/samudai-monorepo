import React from 'react';
import { Skeleton } from 'components/new-skeleton';
import Head from 'ui/head';
import css from './discovery-load-state.module.scss';

interface DiscoveryLoadStateProps {
    role: string;
}

export const DiscoveryLoadState: React.FC<DiscoveryLoadStateProps> = ({ role }) => {
    return (
        <div className={css.load}>
            <Head
                breadcrumbs={[
                    { name: 'Discovery' },
                    { name: role === 'dao' ? 'DAO' : 'Contributor' },
                ]}
            >
                <div className={css.row}>
                    <Skeleton
                        styles={{
                            width: 248,
                            height: 44,
                            borderRadius: 8,
                        }}
                    />

                    <Skeleton
                        styles={{
                            width: '100%',
                            marginLeft: 20,
                            maxWidth: 332,
                            height: 42,
                            borderRadius: 25,
                        }}
                    />
                </div>
            </Head>

            <div className="container">
                <ul className={css.list}>
                    {Array.from({ length: 6 }).map((_, id) => (
                        <li className={css.list_item} key={id}>
                            <Skeleton
                                styles={{
                                    height: 360,
                                    borderRadius: 25,
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
