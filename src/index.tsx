import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';

import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';

import { useAuthStore } from '@features/auth';
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
            staleTime: 1000 * 60,
            refetchInterval: 1000 * 60
        },
        mutations: {
            retry: 0,
        },
    },
});

const AuthInitializer = () => {
    const isInitializing = useAuthStore((state) => state.isInitializing);
    const { pathname } = window.location;
    const isAuthPage = pathname === '/login' || pathname === '/register';

    useUserBasicDetails(!isAuthPage);

    if (isInitializing && !isAuthPage) {
        return <CircularProgress />;
    }

    return <RouterProvider router={Router} />;
};

createRoot(rootElement).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <AuthInitializer />
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>,
);
