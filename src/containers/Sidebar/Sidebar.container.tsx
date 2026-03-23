import { useNavigate } from 'react-router-dom';

import { Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material';

import { SidebarItemList } from '@components';
import { useGetMyProjects } from '@features/project';

import { iconMap, sidebarList } from './Sidebar.config';
import { SideBarStyled } from './Sidebar.styles';
import { SidebarItem, SideBarProps } from './Sidebar.types';

export const SideBar = ({ isMenuOpen, toggleDrawer }: SideBarProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { data: projects } = useGetMyProjects();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerVariant = isMobile ? 'temporary' : 'permanent';
    const projectChildren: SidebarItem[] =
        projects?.map((project) => ({
            title: project.title,
            url: `project/${project.jira_project_key}`,
            icon: 'listAlt',
        })) ?? [];

    const sidebarItems: SidebarItem[] = sidebarList.map((item) => {
        if (item.title === 'My Projects') {
            return {
                ...item,
                children: projectChildren,
                count: projectChildren.length,
            };
        }
        return item;
    });

    const renderSidebarItem = (item: SidebarItem, depth = 0) => {
        const IconComponent = iconMap[item.icon as string];
        const hasChildren = Boolean(item.children);
        const count = Number(item.count);
     

        const isActive =
            location.pathname === `/${item.url}` ||
            location.pathname === item.url;


        if (hasChildren) {
            return (
                <SidebarItemList
                    key={item.title}
                    item={item}
                    depth={depth}
                    IconComponent={IconComponent}
                    isActive={false}
                    hasChildren={true}
                    count={count}
                >
                    {item.children?.map((child) =>
                        renderSidebarItem(child, depth + 1),
                    )}
                </SidebarItemList>
            );
        }

        return (
            <SidebarItemList
                key={item.title}
                item={item}
                depth={depth}
                IconComponent={IconComponent}
                isActive={isActive}
                hasChildren={false}
                count={count}
                onClick={() => void navigate(`/${item.url}`)}
            />
        );
    };
    const drawerContent = (
        <SideBarStyled component={'aside'}>
            {sidebarItems.map((item) => renderSidebarItem(item))}
        </SideBarStyled>
    );

    return (
        <Drawer
            variant={drawerVariant}
            open={isMobile ? isMenuOpen : true}
            onClose={toggleDrawer}
        >
            <Toolbar />
            {drawerContent}
        </Drawer>
    );
};
