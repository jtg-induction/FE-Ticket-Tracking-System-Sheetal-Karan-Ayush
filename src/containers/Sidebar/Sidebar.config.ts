import { Add, ListAlt, PieChart } from '@mui/icons-material';

import { SidebarItem } from './Sidebar.types';

export const iconMap: Record<string, React.ElementType> = {
    piechart: PieChart,
    listAlt: ListAlt,
    add: Add,
};
export const sidebarList: SidebarItem[] = [
    {
        title: 'Dashboard',
        url: '/',
        icon: 'piechart',
    },
    {
        title: 'Create Project',
        url: '/project/create',
        icon: 'add',
    },
    {
        title: 'My Projects',
        url: '/',
        icon: 'listAlt',
    },
];
