import React from 'react';
import { IRoute } from './types';

const publicRouter: IRoute[] = [
    {
        path: '/:memberid/profile/public',
        component: React.lazy(() => import('pages/new-profile')),
        sidebar: false,
        access: [],
        meta: {
            name: 'Contributor Profile',
        },
    },
];

export { publicRouter };
