import SearchStatusIcon from 'ui/SVG/SearchStatusIcon';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import SidebarIcons from 'ui/SVG/sidebar';

export type HeaderNavItem = {
    name?: string;
    icon?: () => JSX.Element;
    onlyNav?: boolean;
    sublinks: HeaderNavSubLink[];
};

export type HeaderNavSubLink = {
    type: 'link' | 'dashboard-dash' | 'jobs-applicants';
    name: string;
    daoType?: 'Admin' | 'Contributor';
    subType?: string;
    exact?: boolean;
    getHref: (payload?: HeaderNavSubLinkPayload) => string;
};

export type HeaderNavSubLinkPayload = {
    daoId?: string;
    currentDaoId?: string;
    accountId?: string;
};

export const getProfileNav = (): HeaderNavItem => ({
    name: 'Account',
    icon: () => <SidebarIcons.Sms />,
    sublinks: [
        {
            type: 'link',
            name: 'Profile',
            getHref: (payload) => `/${payload?.accountId}/profile`,
            exact: true,
        },
        {
            type: 'link',
            name: 'Projects',
            getHref: (payload) => `/${payload?.accountId}/profile/projects`,
        },
        {
            type: 'link',
            name: 'Connections',
            getHref: (payload) => `/${payload?.accountId}/connections`,
        },
        // {
        //     type: 'link',
        //     name: 'Settings',
        //     getHref: (payload) => `/${payload?.accountId}/settings/contributor`,
        // },
    ],
});

export const getHeaderNav = (): HeaderNavItem[] => [
    {
        name: 'Workspace',
        icon: () => <SidebarIcons.Dashboard />,
        sublinks: [
            {
                type: 'dashboard-dash',
                name: 'Dashboard',
                getHref: (payload) => `/${payload?.daoId}/dashboard/1`,
            },
            {
                type: 'link',
                name: 'Projects',
                getHref: (payload) => `/${payload?.daoId}/projects`,
            },
            {
                daoType: 'Admin',
                type: 'link',
                name: 'Forms',
                getHref: (payload) => `/${payload?.daoId}/forms`,
            },
            {
                daoType: 'Admin',
                type: 'link',
                name: 'Team',
                getHref: (payload) => `/${payload?.daoId}/team`,
            },
            {
                subType: 'Payments',
                daoType: 'Admin',
                type: 'link',
                name: 'Payments',
                getHref: (payload) => `/${payload?.daoId}/payments`,
            },
            {
                type: 'link',
                name: 'Forum',
                getHref: (payload) => `/${payload?.daoId}/forum`,
            },
        ],
    },
    {
        name: 'Discovery',
        icon: () => <SearchStatusIcon />,
        sublinks: [
            { type: 'link', name: 'DAO', getHref: (payload) => `/discovery/dao` },
            {
                type: 'link',
                name: 'Contributor',
                getHref: (payload) => `/discovery/contributor`,
            },
        ],
    },
    {
        name: 'Jobs',
        icon: () => <SidebarIcons.Sms />,
        sublinks: [
            { type: 'link', name: 'Task', getHref: () => '/jobs/tasks' },
            { type: 'link', name: 'Bounty', getHref: () => '/jobs/bounty' },
            { type: 'link', name: 'Applicants', getHref: () => '/jobs/applicants' },
            { type: 'link', name: 'Applied Job', getHref: () => '/jobs/applied' },
        ],
    },
    {
        name: 'Settings',
        icon: () => <SettingsIcon />,
        onlyNav: true,
        sublinks: [
            {
                type: 'link',
                name: 'DAO',
                getHref: (payload) => `/${payload?.currentDaoId}/settings/dao`,
            },
            {
                type: 'link',
                name: 'Contributor',
                getHref: (payload) => `/${payload?.accountId}/settings/contributor`,
            },
        ],
    },
    // {
    //     name: 'Account',
    //     onlyNav: true,
    //     sublinks: [
    //         {
    //             type: 'link',
    //             name: 'Profile',
    //             getHref: (payload) => `/${payload?.accountId}/profile`,
    //             exact: true,
    //         },
    //         {
    //             type: 'link',
    //             name: 'Projects',
    //             getHref: (payload) => `/${payload?.accountId}/profile/projects`,
    //         },
    //         {
    //             type: 'link',
    //             name: 'Connections',
    //             getHref: (payload) => `/${payload?.accountId}/connections`,
    //         },
    //     ],
    // },
];
