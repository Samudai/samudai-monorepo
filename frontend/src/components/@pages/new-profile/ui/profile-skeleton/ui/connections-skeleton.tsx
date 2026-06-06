import { Skeleton } from 'components/new-skeleton';

export const ConnectionsSkeleton = () => {
    return (
        <div>
            <Skeleton
                styles={{
                    maxWidth: 248,
                    height: 44,
                    borderRadius: 8,
                }}
            />

            {[1, 2, 3, 4, 5].map((index) => (
                <Skeleton
                    styles={{
                        marginTop: 12,
                        height: 72,
                        borderRadius: 12,
                    }}
                    key={index}
                />
            ))}
        </div>
    );
};
