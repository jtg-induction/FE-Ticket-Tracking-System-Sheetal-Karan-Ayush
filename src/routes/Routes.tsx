import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { Layout } from '@containers';
import { Login, PageNotFound, Register } from '@pages';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,

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
