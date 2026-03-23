import { Box, styled } from '@mui/material';

export const StyledHeroCard = styled(Box)(({ theme }) => {
    const {
        typography: { pxToRem },
        palette,
        spacing
    } = theme;
    return {
        padding: spacing(6),
        height: '100%',
        background: palette.gradients.primary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing(6),
        maxWidth: pxToRem(450),
    };
});
