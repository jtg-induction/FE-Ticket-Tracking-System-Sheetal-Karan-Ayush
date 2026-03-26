import { create } from 'zustand';

import { SnackbarState } from './snackbar.types';

export const useSnackbarStore = create<SnackbarState>((set) => ({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000,
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
    showSnackbar: (message, severity, options = {}) =>
        set({
            open: true,
            message,
            severity,
            autoHideDuration: options.autoHideDuration ?? 6000,
            anchorOrigin: options.anchorOrigin ?? {
                vertical: 'top',
                horizontal: 'center',
            },
        }),
    hideSnackbar: () => set({ open: false }),
}));
