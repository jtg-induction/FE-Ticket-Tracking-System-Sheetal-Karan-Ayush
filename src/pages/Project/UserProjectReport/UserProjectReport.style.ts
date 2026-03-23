import {
    Box,
    Button,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableRow,
    tableRowClasses,
    Typography,
} from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(2),
}));

export const UserInfoCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 10,
    backgroundColor: theme.palette.grey[50],
    border: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

export const SummaryCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
}));

export const StyledTableBody = styled(TableBody)(({ theme }) => ({
    [`& .${tableCellClasses.root}`]: { borderBottom: 'none' },
    [`& .${tableRowClasses.root}:nth-of-type(odd)`]: {
        backgroundColor: theme.palette.background.default,
    },
    [`& .${tableRowClasses.root}:nth-of-type(even)`]: {
        backgroundColor: theme.palette.grey[50],
    },
    [`& .${tableRowClasses.root}:hover`]: {
        backgroundColor: theme.palette.grey[200],
        transition: 'background-color 0.2s ease-in-out',
    },
}));

export const DesktopTableCell = styled(TableCell)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        display: 'none',
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius * 16,
}));

export const StyledTableContainer = styled(TableContainer)({
    overflowX: 'auto',
});

export const StyledTable = styled(Table)(({ theme }) => ({
    minWidth: theme.typography.pxToRem(900),
    [theme.breakpoints.down('lg')]: {
        minWidth: theme.typography.pxToRem(400),
    },
}));

// New styled components for the page layout
export const HeaderContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
}));

export const LoadMoreContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
}));

export const LoadMoreButton = styled(Button)({
    minWidth: '150px',
});

export const TitleCell = styled(TableCell)({
    width: '38%',
    whiteSpace: 'nowrap',
});

export const StatusCell = styled(TableCell)({
    width: '15%',
    whiteSpace: 'nowrap',
});

export const PriorityCell = styled(TableCell)({
    width: '15%',
    whiteSpace: 'nowrap',
});

export const DeadlineCell = styled(TableCell)({
    width: '20%',
    whiteSpace: 'nowrap',
});

export const TicketTitle = styled(Typography)({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '250px',
});
