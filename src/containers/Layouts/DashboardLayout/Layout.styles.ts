import { Box, styled } from '@mui/material';

export const LayoutStyled = styled(Box)(({ theme }) => {
    const { palette } = theme;

    return {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: palette.background.default,
        height: '100vh',
    };
});

export const ContentWrapper = styled(Box)({
    display: 'flex',
    height: '100%',
});

export const StyledMainContent = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem },
    } = theme;

    return {
        flex: '1',
        maxWidth: pxToRem(2000),
        marginInline: 'auto',
        padding: pxToRem(16),
        [theme.breakpoints.up('sm')]: {
            width:`calc(100vw - ${pxToRem(250)})`,
            marginLeft: pxToRem(250),
        },
    };
});