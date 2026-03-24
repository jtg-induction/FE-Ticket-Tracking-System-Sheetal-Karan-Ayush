import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';

import { AppDialogProps } from './AppDialog.types';

/**
 * A reusable dialog component that displays a customizable dialog with optional title, content, and actions.
 *
 * This component uses Material-UI's `Dialog` component to render a modal dialog. It can display a title, children content, and custom actions.
 * The dialog can be controlled with the `open` and `onClose` props.
 *
 * @param open - A boolean indicating whether the dialog is open (`true`) or closed (`false`).
 * @param onClose - A callback function to handle closing the dialog.
 * @param title - The title of the dialog, which will be displayed at the top. If not provided, the title section will be omitted.
 * @param children - The content to be displayed inside the dialog's body. This can be any React elements.
 * @param maxWidth - The maximum width of the dialog. Default is `"sm"`. Can be set to any valid Material-UI `maxWidth` value (e.g., `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`).
 * @param fullWidth - A boolean that determines if the dialog should take up the full width available. Default is `true`.
 * @param actions - Custom actions (buttons or other components) to be displayed at the bottom of the dialog.
 *
 * @returns A `Dialog` component that renders the dialog with the given props.
 */

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
