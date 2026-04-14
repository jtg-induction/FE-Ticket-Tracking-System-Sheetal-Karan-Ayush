import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import { CreateSessionForm, Layout, ProjectSessionsList, SessionDetails } from '@containers';
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
import { PokerBoard } from '@pages/PokerBoardLive/PokerBoardLive.page';

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
                        element: <Navigate to="user" replace />,
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
                        path: 'projects/:projectKey/sessions',
                        element: <ProjectSessionsList />
                    },
                    {
                        path: 'project/:projectKey/user',
                        element: <UserReportPage />,
                    },
                    {
                        path: 'sessions/create',
                        element: <CreateSessionForm />
                    },
                    {
                        path: 'sessions/:sessionId',
                        element: <SessionDetails />
                    },
                    {
                        path: 'sessions/:sessionId/board',
                        element: <PokerBoard />
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
