import { useState } from 'react';

import { Outlet } from 'react-router-dom';

import { Header, SideBar } from '@containers';

import {
    ContentWrapper,
    LayoutStyled,
    StyledMainContent,
} from './Layout.styles';

export const Layout = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleDrawer = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <LayoutStyled>
            <Header isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
            <ContentWrapper>
                <SideBar isMenuOpen={isMenuOpen} toggleDrawer={toggleDrawer} />
                <StyledMainContent>
                    <Outlet />
                </StyledMainContent>
            </ContentWrapper>
        </LayoutStyled>
    );
};
