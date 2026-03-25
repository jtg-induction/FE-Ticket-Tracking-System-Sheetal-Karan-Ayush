import { Box, BoxProps, styled } from '@mui/material';

export const CardBox = styled(Box)<BoxProps>(({ theme }) => {
    const {
        typography: { pxToRem },
        shadows,
        spacing,
    } = theme;

    return {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: `translate(-50%, -50%)`,
        maxWidth: pxToRem(724),
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: spacing(8),
        padding: spacing(4),
        display: 'flex',
        flexDirection: 'column',
        gap: spacing(4),
        boxShadow: shadows[5],
        borderRadius: spacing(4),
        [theme.breakpoints.down('sm')]: {
            maxWidth: pxToRem(320),
        },
    };
});
