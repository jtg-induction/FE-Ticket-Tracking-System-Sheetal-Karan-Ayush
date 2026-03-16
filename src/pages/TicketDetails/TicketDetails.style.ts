import { styled, TextField, Typography } from '@mui/material';

export const StyledLabel = styled(Typography)(({ theme }) => ({
    variant: 'body2',
    marginTop: theme.spacing(1),
    fontWeight: 500,
    color: theme.palette.text.primary,
}));

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
