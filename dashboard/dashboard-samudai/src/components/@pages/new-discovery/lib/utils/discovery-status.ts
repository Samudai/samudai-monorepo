export const statusList = [
    {
        icon: '🚀',
        name: 'Featured',
        className: 'featured-gradient-color',
    },
    {
        icon: '⚡️',
        name: 'Most Active',
        className: 'most-active-color',
    },
    {
        icon: '👀',
        name: 'Most Viewed',
        className: 'most-viewed-color',
    },
];

export const getDiscoveryStatus = (status: string) => {
    return statusList.find((s) => s.name.toLowerCase().includes(status.toLowerCase()));
};
