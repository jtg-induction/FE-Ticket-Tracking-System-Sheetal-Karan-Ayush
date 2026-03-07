import { Box, styled } from '@mui/material';

export const StyledHeading = styled(Box)(({ theme }) => {
    const {
        spacing
    } = theme;
    return {
        display: 'flex',
        gap: spacing(3),
        alignItems: 'center',
        justifyContent: 'center',
    };
});
