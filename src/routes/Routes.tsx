import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { Layout } from '@containers';
import {
    Login,
    PageNotFound,
    ProjectCreationPage,
    ProjectDashboardPage,
    Register,
} from '@pages';

import { ProtectedRoute } from './ProtectedRoute';


const routes: RouteObject[] = [
    {
        element: <ProtectedRoute />, 
        children: [
            {
                path: '/',
                element: <Layout />,
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
        ],
    },
    // Public routes stay outside
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
