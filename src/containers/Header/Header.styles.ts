import { Link } from 'react-router-dom';

import { AppBar, Box, BoxProps, styled } from '@mui/material';

import { HamburgerButtonProps } from './Header.types';

export const HeaderStyled = styled(AppBar)<BoxProps>(({ theme }) => {
    const { palette, typography, spacing } = theme;

    return {
        display: 'flex',
        justifyContent: 'center',
        padding: spacing(4),
        backgroundColor: palette.common.white,
        position: 'fixed',
        width: '100%',
        top: 0,
        height: typography.pxToRem(64),
        zIndex: theme.zIndex.drawer + 1,
    };
});

export const HamburgerButton = styled(Box)<HamburgerButtonProps & BoxProps>(({
    theme
}) => {
    const {
        typography: { pxToRem }
    } = theme;
    return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: pxToRem(32),
        height: pxToRem(32),
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
    };
});

export const StyledLeftBox = styled(Link)(({ theme }) => {
    const { spacing } = theme;

    return {
        display: 'flex',
        gap: spacing(4),
        alignItems: 'center',
        textDecoration: 'none',
    };
});

export const StyledToolbar = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

export const StyledRightBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));
