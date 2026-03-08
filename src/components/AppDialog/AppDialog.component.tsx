import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';

import { AppDialogProps } from './AppDialog.types';

export const AppDialog = ({
    open,
    onClose,
    title,
    children,
    maxWidth = 'sm',
    fullWidth = true,
    actions,
}: AppDialogProps) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
    >
        {title && (
            <DialogTitle
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                {title}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        )}
        <DialogContent dividers>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
);
