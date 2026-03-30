import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { SnackbarProvider } from '@components';
import { useUserBasicDetails } from '@features/user/useUserBasicDetails';
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

const AuthInitializer = () => {
    const accessToken = localStorage.getItem('access_token');
    useUserBasicDetails(!!accessToken);
    return null;
};

createRoot(rootElement).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <AuthInitializer />
                <RouterProvider router={Router} />
                <SnackbarProvider />
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>,
);
