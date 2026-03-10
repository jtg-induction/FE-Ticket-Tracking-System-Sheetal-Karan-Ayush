export type SideBarProps = {
    isMenuOpen: boolean;
    toggleDrawer: () => void;
};

export type SidebarItem = {
    title: string;
    url: string;
    icon?: string;
    children?: SidebarItem[];
    count?: number;
};
