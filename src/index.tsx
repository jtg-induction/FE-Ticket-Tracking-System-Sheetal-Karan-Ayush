import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { CssBaseline } from '@mui/material';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
    <StrictMode>
        <CssBaseline />
        <h1>Ticket Tracking System</h1>
    </StrictMode>,
);
