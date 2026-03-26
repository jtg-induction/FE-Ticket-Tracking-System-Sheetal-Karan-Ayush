import { styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, tableRowClasses } from "@mui/material";

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

export const StyledTableContainer = styled(TableContainer)(() => ({
    overflowX: 'auto',
}));

export const StyledTable = styled(Table)(({ theme }) => ({
    minWidth: theme.typography.pxToRem(900),
    [theme.breakpoints.down('lg')]: {
        minWidth: theme.typography.pxToRem(400),
    },
}));
