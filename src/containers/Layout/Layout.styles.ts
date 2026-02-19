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

    // const HEADER_HEIGHT = ;
    return {
        flex: '1',
        maxWidth: pxToRem(2000),
        marginInline: 'auto',
        // marginTop: pxToRem(HEADER_HEIGHT),
    };
});
