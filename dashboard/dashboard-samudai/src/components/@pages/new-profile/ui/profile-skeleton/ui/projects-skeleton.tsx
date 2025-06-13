import { Skeleton } from 'components/new-skeleton';

export const ProjectsSkeleton = () => {
    return (
        <div>
            <Skeleton
                styles={{
                    height: 170,
                    marginTop: 48,
                }}
            />
            <Skeleton
                styles={{
                    height: 170,
                    marginTop: 32,
                }}
            />
        </div>
    );
};
