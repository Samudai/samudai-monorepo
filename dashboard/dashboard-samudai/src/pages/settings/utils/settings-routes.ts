export const getSettingsRoutes = (daoid?: string, memberId?: string): SettingsRoute[] => [
    {
        name: 'DAO',
        baseUrl: '/' + daoid + '/settings/dao',
        initial: '',
        paths: {
            Profile: '',
            'Access Managment': '/access-managment',
            // 'Token Gating': '/token-gating',
            // Payments: () => '/payments',
            Integrations: '/integrations',
            Departments: '/departments',
            Billing: '/billing-stripe',
        },
    },
    {
        name: 'Contributor',
        baseUrl: '/' + memberId + '/settings/contributor',
        initial: '',
        paths: {
            Profile: '',
            'Connected Apps': '/apps',
        },
    },
];

export type PathType = string | (() => string);

export type SettingsRoute = {
    name: string;
    baseUrl: string;
    initial: string;
    paths: Record<string, string | PathType>;
};
