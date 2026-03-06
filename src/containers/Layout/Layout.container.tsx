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
                    <h1>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ullam aspernatur corporis magni minus recusandae dolore
                        molestias vero iste quas magnam ipsa, cumque provident
                        odio quidem ea obcaecati delectus in illo.
                    </h1>
                    <Outlet />
                </StyledMainContent>
            </ContentWrapper>
        </LayoutStyled>
    );
};
