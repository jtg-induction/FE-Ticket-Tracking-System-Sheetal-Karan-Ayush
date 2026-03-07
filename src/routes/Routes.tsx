import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { Layout } from '@containers';
import { PageNotFound } from '@pages';

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
];

export const Router = createBrowserRouter(routes);
