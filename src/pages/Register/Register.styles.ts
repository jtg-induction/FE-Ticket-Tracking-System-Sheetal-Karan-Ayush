import { Box, Container, Stack, styled, TextField } from '@mui/material';

export const StyledWrapper = styled(Container)({
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
});

export const StyledHeading = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem },
    } = theme;
    return {
        display: 'flex',
        gap: pxToRem(12),
        alignItems: 'center',
        justifyContent: 'center',
    };
});

export const StyledContent = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem },
    } = theme;
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: pxToRem(16),
    };
});

export const StyledStackWrapper = styled(Stack)(({ theme }) => {
    const {
        typography: { pxToRem },
    } = theme;
    return {
        maxWidth: pxToRem(1000),
        height: pxToRem(800),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    };
});

export const StyledRegisterCard = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem },
    } = theme;
    return {
        padding: pxToRem(24),
        maxWidth: pxToRem(500),
        display: 'flex',
        flexDirection: 'column',
        gap: pxToRem(16),
    };
});
