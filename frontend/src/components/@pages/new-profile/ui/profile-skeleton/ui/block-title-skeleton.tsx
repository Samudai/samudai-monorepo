import { Skeleton } from 'components/new-skeleton';
import React from 'react';

export const BlockTitleSkeleton: React.FC = () => {
    return (
        <div>
            <Skeleton
                styles={{
                    height: 44,
                    maxWidth: 248,
                    borderRadius: 8,
                }}
            />

            <Skeleton
                styles={{
                    marginTop: 24,
                    height: 139,
                    borderRadius: 20,
                }}
            />
        </div>
    );
};
