import { Box, Container, Stack, styled } from '@mui/material';

export const StyledWrapper = styled(Container)({
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
});

export const StyledContent = styled(Box)(({ theme }) => {
    const {
        spacing
    } = theme;
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing(4),
    };
});

export const StyledStackWrapper = styled(Stack)(({ theme }) => {
    const {
        typography: { pxToRem },
        shadow,
    } = theme;
    return {
        maxWidth: pxToRem(1000),
        height: pxToRem(800),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        boxShadow: shadow.md,
    };
});

export const StyledRegisterCard = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem },
        spacing
    } = theme;
    return {
        padding: spacing(6),
        maxWidth: pxToRem(500),
        display: 'flex',
        flexDirection: 'column',
        gap: spacing(4),
    };
});
