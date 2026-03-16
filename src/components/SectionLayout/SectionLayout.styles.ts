import { Box, styled } from '@mui/material';
export const StyledSectionBox = styled(Box)(({ theme }) => ({
    maxWidth: theme.typography.pxToRem(2000),
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
    width: '100%',
    borderRadius: theme.shape.borderRadius * 4,
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
        gap: theme.spacing(4),
    },
}));

export const StyledSectionHeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    gap: theme.spacing(2),
    alignItems: 'center',
}));

export const StyledSectionMainBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
}));
