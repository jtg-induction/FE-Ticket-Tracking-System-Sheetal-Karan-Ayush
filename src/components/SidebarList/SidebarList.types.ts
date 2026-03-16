import { ElementType, ReactNode } from 'react';

export type SidebarItem = {
    title: string;
    url: string;
    icon?: string;
    children?: SidebarItem[];
    count?: number;
};

export type SidebarItemListProps = {
    item: SidebarItem;
    depth: number;
    IconComponent?: ElementType;
    isActive: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    count: number;
    onClick?: () => void;
    children?: ReactNode;
};

export type StyledListItemButtonProps = {
    isActive?: boolean;
};
