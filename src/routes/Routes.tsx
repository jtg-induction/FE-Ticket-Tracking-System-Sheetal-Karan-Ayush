import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { Layout } from '@containers';
import {
    CreateTicket,
    Login,
    PageNotFound,
    ProjectCreationPage,
    ProjectDashboardPage,
    Register,
    TicketDetails,
    UserReportPage,
} from '@pages';

import { ProtectedRoute } from './ProtectedRoutes';

const routes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Layout />,

                children: [
                    {
                        path: '/user',
                        element: <UserReportPage />,
                    },
                    {
                        path: 'project/create',
                        element: <ProjectCreationPage />,
                    },
                    {
                        path: 'project/:projectKey',
                        element: <ProjectDashboardPage />,
                    },
                    {
                        path: 'project/:projectKey/ticket/create',
                        element: <CreateTicket />,
                    },
                    {
                        path: 'project/:projectKey/ticket/:ticketKey',
                        element: <TicketDetails />,
                    },
                    {
                        path: 'project/:projectKey/user/:userId',
                        element: <UserReportPage />,
                    },
                    {
                        path: '*',
                        element: <PageNotFound />,
                    },
                ],
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
