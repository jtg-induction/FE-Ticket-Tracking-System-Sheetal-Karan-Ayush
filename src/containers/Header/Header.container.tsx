import { useEffect } from 'react';

import { Box, useMediaQuery, useTheme } from '@mui/material';

import { HamburgerButton, HeaderStyled } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ isMenuOpen, setMenuOpen }: HeaderProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        if (isMobile) {
            setMenuOpen(false);
        } else {
            setMenuOpen(true);
        }
    }, [isMobile, setMenuOpen]);

    return (
        <HeaderStyled component={'header'}>
            {isMobile && (
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
