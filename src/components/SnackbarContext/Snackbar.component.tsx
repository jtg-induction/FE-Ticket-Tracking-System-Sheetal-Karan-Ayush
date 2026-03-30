import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { Alert, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useSnackbarStore } from './useSnackbar';


export const SnackbarProvider = () => {
    const theme = useTheme();
    const {
        open,
        message,
        severity,
        autoHideDuration,
        anchorOrigin,
        hideSnackbar,
    } = useSnackbarStore();

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') return;
        hideSnackbar();
    };

    const getIcon = () => {
        switch (severity) {
            case 'success':
                return (
                    <CheckCircleIcon
                        sx={{ color: theme.palette.success.contrastText }}
                    />
                );
            case 'error':
                return (
                    <ErrorIcon
                        sx={{ color: theme.palette.error.contrastText }}
                    />
                );
            default:
                return (
                    <InfoIcon sx={{ color: theme.palette.info.contrastText }} />
                );
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            sx={{ zIndex: 1500 }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                icon={getIcon()}
                sx={{
                    width: '100%',
                    fontWeight: 'bold',
                    backgroundColor:
                        severity === 'success'
                            ? theme.palette.success.main
                            : severity === 'error'
                              ? theme.palette.error.main
                              : theme.palette.info.main,
                    color:
                        severity === 'success'
                            ? theme.palette.success.contrastText
                            : severity === 'error'
                              ? theme.palette.error.contrastText
                              : theme.palette.info.contrastText,
                    borderLeft: `6px solid ${
                        severity === 'success'
                            ? theme.palette.success.contrastText
                            : severity === 'error'
                              ? theme.palette.error.contrastText
                              : theme.palette.info.contrastText
                    }`,
                    boxShadow: theme.shadows[3],
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};
