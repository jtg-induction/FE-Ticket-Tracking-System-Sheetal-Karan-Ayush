import { ReactNode } from 'react';

export type DialogBoxProps = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    onSubmit?: () => void;
    submitText?: string;
    cancelText?: string;
    isSubmitting? : boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
};
