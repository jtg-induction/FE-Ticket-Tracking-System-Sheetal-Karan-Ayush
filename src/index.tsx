import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@theme';

import { Router } from './routes';

const rootElement = document.getElementById('root') as HTMLElement;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: true,
            staleTime: 1000 * 30,
        },
        mutations: {
            retry: 0,
        },
    },
});

createRoot(rootElement).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={Router} />
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>,
);
