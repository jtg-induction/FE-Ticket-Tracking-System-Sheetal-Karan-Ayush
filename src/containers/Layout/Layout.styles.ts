import { Box, styled } from '@mui/material';

import { CONTAINER_MAX_WIDTH } from '@constant';

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
        maxWidth: pxToRem(CONTAINER_MAX_WIDTH),
        marginInline: 'auto',
    };
});
