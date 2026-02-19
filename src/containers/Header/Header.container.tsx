import { useEffect } from 'react';

import { Box, useMediaQuery, useTheme } from '@mui/material';

import { HamburgerButton, HeaderStyled } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ isMenuOpen, setMenuOpen }: HeaderProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    useEffect(() => {
        if (isDesktop) {
            setMenuOpen(true);
        } else {
            setMenuOpen(false);
        }
    }, [isDesktop, setMenuOpen]);

    return (
        <HeaderStyled component={'header'}>
            {!isDesktop && (
                <HamburgerButton
                    component={'button'}
                    isOpen={isMenuOpen}
                    onClick={() => setMenuOpen(!isMenuOpen)}
                >
                    <Box component="span"></Box>
                    <Box component="span"></Box>
                    <Box component="span"></Box>
                </HamburgerButton>
            )}
        </HeaderStyled>
    );
};
