import { styled, TextField } from "@mui/material";

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
