import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { BugReport, Menu } from '@mui/icons-material';
import { Avatar, Typography, useMediaQuery, useTheme } from '@mui/material';

import { useAuthStore } from '@features/auth';

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
    const { user } = useAuthStore();
    const username = user?.name;
    const navigate = useNavigate();
    /**
     * Handles the selection of a product from the search results
     * @param product - The product object or null
     */
    useEffect(() => {
        if (isDesktop) {
            setMenuOpen(true);
        } else {
            setMenuOpen(false);
        }
    }, [isDesktop, setMenuOpen]);

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
                    <Avatar
                        alt="TaskVault"
                        sx={{ bgcolor: 'primary.main' }}
                        onClick={() => void navigate('/user')}
                    >
                        {username?.substring(0, 2).toUpperCase()}
                    </Avatar>
                </StyledRightBox>
            </StyledToolbar>
        </HeaderStyled>
    );
};
