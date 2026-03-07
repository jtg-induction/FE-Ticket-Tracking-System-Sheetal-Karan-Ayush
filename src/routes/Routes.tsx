import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { Login, PageNotFound, Register } from '@pages';
import { DashboardLayout } from '@containers';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <DashboardLayout />,

        children: [
            {
                path: '*',
                element: <PageNotFound />,
            },
        ],
    },

    {
        path: '/register',
        element: <Register />,
    },

    {
        path: '/login',
        element: <Login />,
    },
];

export const Router = createBrowserRouter(routes);
