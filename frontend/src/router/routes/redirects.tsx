import { Navigate } from 'react-router-dom';
import { IRoute } from '../types';

export const redirectRoutes: IRoute[] = [
    {
        path: '/:daoid/settings/*',
        component: () => <Navigate replace to="/settings/access-managment" />,
        sidebar: true,
        access: [],
    },
    // {
    //   path: '*',
    //   component: () => <Navigate replace to="/profile/me" />,
    //   sidebar: true,
    //   access: [],
    // },
];
