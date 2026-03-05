import { useState } from 'react';

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
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
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
        const handleToggle = (key: string) => {
            setExpandedItems((prev) => {
                let newItems: string[];
                if (prev.includes(key)) {
                    newItems = prev.filter((value) => value !== key);
                } else {
                    newItems = [...prev, key];
                }
                return newItems;
            });
        };

        const isActive =
            location.pathname === `/${item.url}` ||
            location.pathname === item.url;

        const isChildActive = !!item.children?.some(
            (child) =>
                child.url &&
                (location.pathname === `/${child.url}` ||
                    location.pathname.startsWith(`/${child.url}`)),
        );

        const isRouteExpanded = isActive || isChildActive;
        const isManuallyExpanded = expandedItems.includes(item.url);

        const isExpanded = isRouteExpanded || isManuallyExpanded;

        if (hasChildren) {
            return (
                <SidebarItemList
                    key={item.title}
                    item={item}
                    depth={depth}
                    IconComponent={IconComponent}
                    isActive={false}
                    isExpanded={isExpanded}
                    hasChildren={true}
                    count={count}
                    onClick={() => handleToggle(item.url)}
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
                isExpanded={false}
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
