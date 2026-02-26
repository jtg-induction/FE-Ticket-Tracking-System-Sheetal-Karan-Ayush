import { Box, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const FiltersWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
}));

export const FiltersContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),

    [theme.breakpoints.up('md')]: {
        alignItems: 'center',
    },
}));

export const FilterField = styled(TextField)(({ theme }) => ({
    flex: '1 1 100%',

    [theme.breakpoints.up('sm')]: {
        flex: '1 1 45%',
    },

    [theme.breakpoints.up('md')]: {
        flex: '1 1 auto',
        minWidth: 180,
    },
}));

export const SmallFilterField = styled(TextField)(({ theme }) => ({
    flex: '1 1 100%',

    [theme.breakpoints.up('sm')]: {
        flex: '1 1 45%',
    },

    [theme.breakpoints.up('md')]: {
        flex: '0 0 140px',
    },
}));

export const ResetButton = styled(Button)(({ theme }) => ({
    height: 40,
    flex: '1 1 100%',

    [theme.breakpoints.up('sm')]: {
        flex: '1 1 auto',
    },

    [theme.breakpoints.up('md')]: {
        flex: '0 0 auto',
    },
}));

export const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    flex: '1 1 100%',

    [theme.breakpoints.up('sm')]: {
        flex: '1 1 45%',
    },

    [theme.breakpoints.up('md')]: {
        flex: '0 0 200px', 
    },
}));