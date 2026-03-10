import { Box, BoxProps, styled } from '@mui/material';

export const SideBarStyled = styled(Box)<BoxProps>(({ theme }) => {
    const {
        typography: { pxToRem },
        palette,
        spacing
    } = theme;

    return {
        backgroundColor: palette.common.white,
        width: pxToRem(300),
        height: '100%',
        padding: spacing(2),
        [theme.breakpoints.up('sm')]: {
            width: pxToRem(250),
        },
    };
});
