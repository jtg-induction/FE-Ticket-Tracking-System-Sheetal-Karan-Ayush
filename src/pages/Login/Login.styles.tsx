import {
    Box,
    Container,
    Stack,
    styled,
    TextField,
} from '@mui/material';

export const StyledWrapper = styled(Container)({
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
});

export const StyledErrorTextField = styled(TextField)(({ theme }) => ({
        '& .MuiInputLabel-root.Mui-error': {
            color: theme.palette.error.contrastText,
        },
        '& .MuiFormHelperText-root.Mui-error': {
            color: theme.palette.error.contrastText,
        },
        '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.contrastText,
        },
    }));

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

export const StyledLoginCard = styled(Box)(({ theme }) => {
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
