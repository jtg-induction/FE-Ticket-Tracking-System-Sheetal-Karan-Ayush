import { Box, BoxProps, styled } from '@mui/material';

import { HamburgerButtonProps } from './Header.types';

export const HeaderStyled = styled(Box)<BoxProps>(({ theme }) => {
    const { palette } = theme;

    return {
        backgroundColor: palette.common.white,
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: theme.zIndex.drawer + 1,
    };
});

export const HamburgerButton = styled(Box)<HamburgerButtonProps & BoxProps>(({
    theme,
    isOpen,
}) => {
    const {
        typography: { pxToRem },
        palette,
    } = theme;
    return {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: pxToRem(28),
        height: pxToRem(28),
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',

        '& span': {
            display: 'block',
            width: pxToRem(24),
            height: pxToRem(2),
            backgroundColor: palette.text.primary,
            transition: 'all 0.3s ease-in-out',
            position: 'absolute',

            '&:nth-of-type(1)': {
                transform: isOpen
                    ? 'rotate(45deg)'
                    : `translateY(${pxToRem(-8)})`,
            },

            '&:nth-of-type(2)': {
                opacity: isOpen ? 0 : 1,
            },

            '&:nth-of-type(3)': {
                transform: isOpen
                    ? 'rotate(-45deg)'
                    : `translateY(${pxToRem(8)})`,
            },
        },
    };
});
