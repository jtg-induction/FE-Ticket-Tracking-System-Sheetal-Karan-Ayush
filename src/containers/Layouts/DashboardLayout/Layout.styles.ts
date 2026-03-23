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
    flexGrow: 1,
    height: `calc(100vh - 70px)`,
    overflow: 'hidden',
});

export const StyledMainContent = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem }, breakpoints
    } = theme;
    const HEADER_HEIGHT = 64;
    const SIDEBAR_WIDTH = 250;
    return {
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        flex: '1',
        maxWidth: pxToRem(2000),
        marginInline: 'auto',
        marginLeft: pxToRem(SIDEBAR_WIDTH),
        marginTop: pxToRem(HEADER_HEIGHT),
        [breakpoints.down('sm')]: {
            marginLeft: 0,
        },
    };
});
