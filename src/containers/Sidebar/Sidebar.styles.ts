import { Box, BoxProps, styled } from '@mui/material';

export const SideBarStyled = styled(Box)<BoxProps>(({ theme }) => {
    const {
        typography: { pxToRem },
        palette,
    } = theme;

    return {
        backgroundColor: palette.common.white,
        width: pxToRem(300),
        height: '100%',
        margin: 'auto',
        [theme.breakpoints.up('sm')]: {
            width: pxToRem(250),
        },
    };
});
