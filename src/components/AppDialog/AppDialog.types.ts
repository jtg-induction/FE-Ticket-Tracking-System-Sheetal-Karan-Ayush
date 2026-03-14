import { ReactNode } from 'react';

export type AppDialogProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    actions?: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
};
