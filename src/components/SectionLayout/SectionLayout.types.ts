import { ReactNode } from 'react';

export type SectionLayoutProps = {
    title?: string;
    subtitle?: string;
    headerAction?: ReactNode;
    children: ReactNode;
};
