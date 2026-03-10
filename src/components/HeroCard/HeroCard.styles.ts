import { Box, styled } from '@mui/material';

export const StyledHeroCard = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem },
        palette,
    } = theme;
    return {
        padding: pxToRem(24),
        height: '100%',
        background: palette.gradients.primary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: pxToRem(24),
        maxWidth: pxToRem(450),
    };
});
