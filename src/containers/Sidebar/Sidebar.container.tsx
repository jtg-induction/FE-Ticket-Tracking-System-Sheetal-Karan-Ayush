import { Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material';

import { SideBarStyled } from './Sidebar.styles';
import { SideBarProps } from './Sidebar.types';

export const SideBar = ({ isMenuOpen, toggleDrawer }: SideBarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerVariant = isMobile ? 'temporary' : 'permanent';

    const drawerContent = <SideBarStyled component={'aside'}></SideBarStyled>;

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
