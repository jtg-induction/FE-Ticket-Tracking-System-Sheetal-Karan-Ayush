import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import { StyledDialogButton } from './DialogBox.style';
import { DialogBoxProps } from './DialogBox.type';

export const DialogBox = ({
    open,
    title,
    children,
    onClose,
    onSubmit,
    submitText = 'Save',
    cancelText = 'Cancel',
    maxWidth = 'sm',
    isSubmitting = false,
    isSubmitDisabled=false,
}: DialogBoxProps) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent dividers>{children}</DialogContent>

        <DialogActions>
            <StyledDialogButton onClick={onClose} variant="outlined">
                {cancelText}
            </StyledDialogButton>

            {onSubmit && (
                <StyledDialogButton onClick={onSubmit} variant="contained" disabled={isSubmitDisabled}>
                    {isSubmitting ? (
                        <CircularProgress size={22} color="inherit" />
                    ) : (
                        submitText
                    )}
                </StyledDialogButton>
            )}
        </DialogActions>
    </Dialog>
);
