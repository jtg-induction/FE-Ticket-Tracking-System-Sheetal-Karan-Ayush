import { Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material';

import { SideBarStyled } from './Sidebar.styles';
import { SideBarProps } from './Sidebar.types';

export const SideBar = ({ isMenuOpen, toggleDrawer }: SideBarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerVariant = isMobile ? 'temporary' : 'permanent';

    return (
        <Drawer
            variant={drawerVariant}
            open={isMobile ? isMenuOpen : true}
            onClose={toggleDrawer}
        >
            <Toolbar />
            <SideBarStyled component={'aside'}></SideBarStyled>;
        </Drawer>
    );
};
