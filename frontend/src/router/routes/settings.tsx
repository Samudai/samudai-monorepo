import React from 'react';
import { Navigate } from 'react-router-dom';
import SettingsPage from 'pages/settings';
import { IRoute } from '../types';

export const daoSettingRoutes: IRoute[] = [
    {
        path: '/:daoid/settings/dao/access-managment',
        sidebar: true,
        component: React.lazy(() => import('pages/settings/dao/access-managment')),
        meta: {
            name: 'Access Management',
        },
        access: [],
    },
    {
        path: '/:daoid/settings/dao',
        sidebar: true,
        component: React.lazy(() => import('pages/settings/dao/profile')),
        access: [],
    },
    {
        path: '/:daoid/settings/dao/token-gating',
        sidebar: true,
        component: React.lazy(() => import('pages/settings/dao/token-gating')),
        access: [],
        meta: {
            name: 'Token Gating',
        },
    },
    {
        path: '/:daoid/settings/dao/integrations',
        sidebar: true,
        component: React.lazy(() => import('pages/settings/dao/integrations')),
        access: [],
        meta: {
            name: 'DAO Integrations',
        },
    },
    {
        path: '/:daoid/settings/dao/departments',
        sidebar: true,
        component: React.lazy(() => import('pages/settings/dao/departments')),
        access: [],
        meta: {
            name: 'DAO Departments',
        },
    },
    {
        path: '/:daoid/settings/dao/billing-stripe',
        sidebar: true,
        component: React.lazy(() => import('pages/settings/dao/billing')),
        access: [],
        meta: {
            name: 'DAO Billing',
        },
    },
    // {
    //     path: '/:daoid/settings/*',
    //     access: [],
    //     sidebar: true,
    //     component: () => <SettingsPage />,
    //     meta: {
    //         name: 'DaoSettings',
    //     },
    //     children: [
    //         {
    //             path: 'dao/profile',
    //             component: React.lazy(() => import('pages/settings/dao/profile')),
    //         },
    //         {
    //             path: 'dao/access-managment',
    //             component: React.lazy(() => import('pages/settings/dao/access-managment')),
    //             meta: {
    //                 name: 'Access Management',
    //             },
    //         },
    //         {
    //             path: 'dao/token-gating',
    //             component: React.lazy(() => import('pages/settings/dao/token-gating')),
    //             meta: {
    //                 name: 'Token Gating',
    //             },
    //         },
    //         {
    //             path: 'dao/integrations',
    //             component: React.lazy(() => import('pages/settings/dao/integrations')),
    //             meta: {
    //                 name: 'DAO Integrations',
    //             },
    //         },
    //         {
    //             path: 'dao/departments',
    //             component: React.lazy(() => import('pages/settings/dao/departments')),
    //             meta: {
    //                 name: 'DAO Departments',
    //             },
    //         },
    //         {
    //             path: '*',
    //             component: () => <Navigate to="dao/profile" />,
    //             meta: {
    //                 name: '',
    //             },
    //         },
    //     ],
    // },
];

export const contributorSettingRoutes: IRoute[] = [
    {
        path: '/:memberid/settings/*',
        access: [],
        sidebar: true,
        component: () => <SettingsPage />,
        meta: {
            name: 'ContributorSettings',
        },
        children: [
            {
                path: 'contributor',
                component: React.lazy(() => import('pages/settings/contributor/profile')),
                meta: {
                    name: 'Contribuitor Profile',
                },
            },
            {
                path: 'contributor/apps',
                component: React.lazy(() => import('pages/settings/contributor/connected-apps')),
                meta: {
                    name: 'Contributor Connected Apps',
                },
            },
            {
                path: '*',
                component: () => <Navigate to="contributor" />,
                meta: {
                    name: '',
                },
            },
        ],
    },
];
