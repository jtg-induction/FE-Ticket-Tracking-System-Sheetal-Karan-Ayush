import { Add,ListAlt, PieChart } from '@mui/icons-material';

import { SidebarItem } from './Sidebar.types';

export const iconMap: Record<string, React.ElementType> = {
    piechart: PieChart,
    listAlt: ListAlt,
    addIcon: Add
};
export const sidebarList: SidebarItem[] = [
    {
        title: 'Dashboard',
        url: '/',
        icon: 'piechart',
    },
    {
        title: 'Create project',
        url: '/project/create',
        icon: 'addIcon',
    },
    {
        title: 'My Projects',
        url: '/',
        icon: 'listAlt',
    },
];
