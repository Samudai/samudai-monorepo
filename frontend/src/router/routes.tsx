import React from 'react';
import { redirectRoutes } from './routes/redirects';
import { daoSettingRoutes, contributorSettingRoutes } from './routes/settings';
import { IRoute } from './types';

require('dotenv').config();

const router: IRoute[] = [
    {
        path: '/login',
        component: React.lazy(() => import('pages/onboarding/ConnectWallet')),
        sidebar: false,
        access: ['authorization'],
        meta: {
            name: 'Login',
        },
    },
    {
        path: '/dashboard/:id',
        component: React.lazy(() => import('components/Loader/Loader')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Dashboard Loader',
        },
    },
    {
        path: '/:daoid/dashboard/:id',
        component: React.lazy(() => import('pages/Dashboard/Dashboard')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Dashboard',
        },
    },
    {
        path: '/jobs/:role',
        component: React.lazy(() => import('pages/jobs')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Jobs',
        },
        children: [],
    },
    {
        path: '/jobs/tasks',
        component: React.lazy(() => import('pages/new-jobs')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Jobs - Tasks',
        },
        children: [],
    },
    {
        path: '/jobs/bounty',
        component: React.lazy(() => import('pages/new-jobs/bounty')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Jobs - Bounty',
        },
        children: [],
    },
    {
        path: '/jobs/:jobType/archive',
        component: React.lazy(() => import('pages/new-jobs/archive')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Archived Jobs',
        },
        children: [],
    },
    {
        path: '/jobs/applicants',
        component: React.lazy(() => import('pages/new-jobs/applicants')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Jobs Applicants',
        },
        children: [],
    },
    {
        path: '/jobs/applied',
        component: React.lazy(() => import('pages/new-jobs/applied')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Applied Jobs',
        },
        children: [],
    },
    {
        path: '/jobs/applicants/:jobId/:jobType',
        component: React.lazy(() => import('pages/new-jobs/applicants/[jobId]')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Job Id Applicants',
        },
        children: [],
    },
    {
        path: '/:memberid/profile',
        component: React.lazy(() => import('pages/new-profile')),
        sidebar: true,
        meta: {
            name: 'Contributor Profile',
        },
        access: [],
    },
    {
        path: '/:memberid/profile/projects',
        component: React.lazy(() => import('pages/new-profile/projects')),
        sidebar: true,
        meta: {
            name: 'Contributor Projects',
        },
        access: [],
    },
    {
        path: '/:memberid/old-profile',
        component: React.lazy(() => import('pages/profile')),
        sidebar: true,
        access: [],
    },
    {
        path: '/:memberid/old-profile/:type',
        component: React.lazy(() => import('pages/profile')),
        sidebar: true,
        access: [],
    },
    {
        path: '/:daoid/payments',
        component: React.lazy(() => import('pages/payments')),
        sidebar: true,
        meta: {
            name: 'Payments',
        },
        access: [],
    },
    {
        path: '/:daoid/projects',
        component: React.lazy(() => import('pages/new-projects')),
        sidebar: true,
        meta: {
            name: 'Projects Overview',
        },
        access: [],
    },
    {
        path: '/:daoid/projects/:projectId/board',
        component: React.lazy(() => import('pages/new-projects/[id]')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Project Board',
        },
    },
    {
        path: '/:daoid/forms',
        component: React.lazy(() => import('pages/new-projects/forms')),
        sidebar: true,
        meta: {
            name: 'Forms Overview',
        },
        access: [],
    },
    {
        path: '/:daoid/forms/:projectId/board',
        component: React.lazy(() => import('pages/new-projects/[id]/investmentBoard')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Investment Board',
        },
    },
    {
        path: '/signup',
        component: React.lazy(() => import('pages/onboarding')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Sign up',
        },
    },
    {
        path: '/adddao',
        component: React.lazy(() => import('pages/AddDao/AddDao')),
        sidebar: true,
        meta: {
            name: 'Add DAO',
        },
        access: [],
    },
    {
        path: '/:daoid/forum',
        component: React.lazy(() => import('pages/forum')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Forums',
        },
    },
    {
        path: '/:daoid/forum/:discussionId',
        component: React.lazy(() => import('pages/forum/buzzing')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Forum Details',
        },
    },
    {
        path: ':memberid/old-connections',
        component: React.lazy(() => import('pages/connections')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Member Connections',
        },
        children: [],
    },
    {
        path: ':memberid/connections',
        component: React.lazy(() => import('pages/new-connections')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Member Connections',
        },
        children: [],
    },
    {
        path: ':memberid/connections/requests',
        component: React.lazy(() => import('pages/new-connections/ConnectionRequests')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Member Connections Requests',
        },
        children: [],
    },
    {
        path: '/messages/*',
        component: React.lazy(() => import('pages/messages')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Messages',
        },
        children: [
            {
                path: '',
                component: React.lazy(() => import('components/@pages/messages/elements/SendBird')),
                meta: {
                    name: 'Personal Messages',
                },
            },
            {
                path: 'clans',
                component: React.lazy(() => import('components/@pages/messages/elements/Clans')),
                meta: {
                    name: 'Clan Messages',
                },
            },
            {
                path: 'collaboration',
                component: React.lazy(
                    () => import('components/@pages/messages/elements/Collaboration')
                ),
                meta: {
                    name: 'Collaboration Messages',
                },
            },
        ],
    },
    {
        path: '/discovery/:role',
        component: React.lazy(() => import('pages/new-discovery')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Discovery',
        },
        children: [],
    },

    {
        path: '/discovery/dao/:id',
        component: React.lazy(() => import('pages/discovery/dao')),
        sidebar: true,
        meta: {
            name: 'DAO Profile',
        },
        access: [],
    },
    {
        path: '/:daoid/notifications',
        component: React.lazy(() => import('pages/new-notifications')),
        sidebar: true,
        access: [],
        children: [],
    },
    // {
    //     path: '/:daoid/old-notifications/*',
    //     component: React.lazy(() => import('pages/notifications')),
    //     sidebar: true,
    //     access: [],
    //     children: [
    //         {
    //             path: '',
    //             component: React.lazy(
    //                 () => import('components/@pages/notification/subpages/Payments')
    //             ),
    //         },
    //         {
    //             path: 'general',
    //             component: React.lazy(
    //                 () => import('components/@pages/notification/subpages/Reviews')
    //             ),
    //         },
    //         {
    //             path: 'messages',
    //             component: React.lazy(
    //                 () => import('components/@pages/notification/subpages/Messages')
    //             ),
    //         },
    //         {
    //             path: '*',
    //             component: () => <Navigate to="" />,
    //         },
    //     ],
    // },
    {
        path: '/rewards',
        component: React.lazy(() => import('pages/rewards')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Rewards Page',
        },
    },
    {
        path: '/:daoid/team',
        component: React.lazy(() => import('pages/team')),
        sidebar: true,
        access: [],
        meta: {
            name: 'Team Page',
        },
    },
    // {
    //   path: '/:formid/form',
    //   component: React.lazy(() => import('pages/pipeline-form')),
    //   sidebar: false,
    //   access: [],
    // meta: {
    //     name: ''
    // },
    // },
    // {
    //     path: '/onboarding',
    //     component: React.lazy(() => import('pages/onboarding')),
    //     sidebar: false,
    //     access: [],
    //     children: [],
    // },
];
router.push({
    path: '/feed',
    component: React.lazy(() => import('pages/feed')),
    sidebar: true,
    access: [],
    meta: {
        name: 'Feed',
    },
});
router.push(...daoSettingRoutes, ...contributorSettingRoutes, ...redirectRoutes);

enum routes {
    login = '/login',
    projectsTotal = '/projects',
    project = '/projects/:id',
    projectsBoard = '/projects/:id/board',
    investmentBoard = '/projects/:iid/investmentboard',
    dashboard = '/dashboard/:id',
    profile = '/:memberid/profile',
    jobs = '/jobs',
    rewards = '/rewards',
    team = '/team',
    signUp = '/signup',
    addDao = '/adddao',
    payments = '/payments',
    dicussions = '/forum',
    connections = '/connections',
    messages = '/messages',
    notifications = '/notifications',
    discovery = '/discovery',
}

export { router };

export default routes;
