import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { Layout } from '@containers';
import { CreateTicket, Login, PageNotFound, Register, TicketDetails } from '@pages';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,

        children: [
            {
                path: 'ticket/create',
                element: <CreateTicket />,
            },
            {
                path: 'ticket/details/:key',
                element: <TicketDetails />,
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
