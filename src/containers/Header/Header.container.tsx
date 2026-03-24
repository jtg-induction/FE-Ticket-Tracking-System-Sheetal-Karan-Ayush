import { useEffect } from 'react';

import { BugReport, Menu } from '@mui/icons-material';
import { Avatar, Typography, useMediaQuery, useTheme } from '@mui/material';

import {
    HamburgerButton,
    HeaderStyled,
    StyledLeftBox,
    StyledRightBox,
    StyledToolbar,
} from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ isMenuOpen, setMenuOpen }: HeaderProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    /**
     * Handles the selection of a product from the search results
     * @param product - The product object or null
     */
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        if (isMobile) {
            setMenuOpen(false);
        } else {
            setMenuOpen(true);
        }
    }, [isMobile, setMenuOpen]);

    return (
        <HeaderStyled component={'header'} elevation={1}>
            <StyledToolbar>
                <StyledLeftBox to={'/'}>
                    {isDesktop && (
                        <>
                            <Avatar
                                alt="TaskVault"
                                sx={{ bgcolor: 'primary.main' }}
                            >
                                <BugReport />
                            </Avatar>
                            <Typography
                                variant="h2"
                                color={theme.palette.grey[900]}
                            >
                                TaskVault
                            </Typography>
                        </>
                    )}
                    {!isDesktop && (
                        <HamburgerButton
                            component={'button'}
                            isOpen={isMenuOpen}
                            onClick={() => setMenuOpen(!isMenuOpen)}
                        >
                            <Menu fontSize="large" />
                        </HamburgerButton>
                    )}
                </StyledLeftBox>
                <StyledRightBox>
                    <Avatar alt="TaskVault"></Avatar>
                </StyledRightBox>
            </StyledToolbar>
        </HeaderStyled>
    );
};
