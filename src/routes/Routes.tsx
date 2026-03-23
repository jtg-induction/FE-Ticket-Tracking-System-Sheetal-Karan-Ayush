import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { DashboardLayout } from '@containers';
import {
    Login,
    PageNotFound,
    ProjectCreationPage,
    ProjectDashboardPage,
    Register,
} from '@pages';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <DashboardLayout />,

        children: [
            {
                path: 'project/create',
                element: <ProjectCreationPage />,
            },
            {
                path: 'project/:projectKey',
                element: <ProjectDashboardPage />,
            },
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
