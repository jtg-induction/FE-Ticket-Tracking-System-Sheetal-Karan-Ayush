import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { DownloadProjectReportDialog, Layout } from '@containers';
import {
    CreateTicket,
    Login,
    PageNotFound,
    ProjectCreationPage,
    ProjectDashboardPage,
    Register,
    TicketDetails,
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
                        path: 'project/create',
                        element: <ProjectCreationPage />,
                    },
                    {
                        path: 'project/:projectKey',
                        element: <ProjectDashboardPage />,
                    },
                    {
                        path: 'project/:projectKey/tickets',
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
