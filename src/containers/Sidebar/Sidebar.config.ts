import { ListAlt, PieChart } from '@mui/icons-material';

import { SidebarItem } from './Sidebar.types';

export const iconMap: Record<string, React.ElementType> = {
    piechart: PieChart,
    listAlt: ListAlt,
};
export const sidebarList: SidebarItem[] = [
    {
        title: 'Dashboard',
        url: '/',
        icon: 'piechart',
    },
    {
        title: 'My Projects',
        url: '/',
        icon: 'listAlt',
    },
];

export const myProjects = "My Projects"
