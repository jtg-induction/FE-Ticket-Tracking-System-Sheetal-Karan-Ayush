import { Card, styled, TextField } from '@mui/material';

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

export const StyledWrapper = styled(Card)(({ theme }) => {
    const {
        typography: { pxToRem },
    } = theme;

    return {
        maxWidth: pxToRem(1024),
        margin: 'auto',
    };
});
