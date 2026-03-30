export type SnackbarSeverity = 'success' | 'error' | 'info';

export type SnackbarState = {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
    autoHideDuration: number;
    anchorOrigin: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'center' | 'right';
    };
    showSnackbar: (
        message: string,
        severity: SnackbarSeverity,
        options?: Partial<
            Pick<SnackbarState, 'autoHideDuration' | 'anchorOrigin'>
        >,
    ) => void;
    hideSnackbar: () => void;
}
