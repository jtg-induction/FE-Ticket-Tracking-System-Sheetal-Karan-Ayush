import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import { DownloadProjectReportDialog, Layout } from '@containers';
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
                        path: 'user',
                        element: <UserReportPage />,
                    },
                    {
                        index: true,
                        element: <Navigate to="project/create" />,
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
                    // just adding route temporarily else it would be shown in dialog box in project dashboard page itself
                    {
                        path: 'project/:projectKey/reports/download',
                        element: <DownloadProjectReportDialog />,
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
