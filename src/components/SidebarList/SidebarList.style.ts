import {
    Accordion,
    accordionClasses,
    AccordionDetails,
    AccordionSummary,
    accordionSummaryClasses,
    Badge,
    badgeClasses,
    ListItem,
    ListItemButton,
    styled,
} from '@mui/material';

import { StyledListItemButtonProps } from './SidebarList.types';
export const StyledAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: 'transparent',
    '&:before': {
        display: 'none',
    },
    [`&.${accordionClasses.expanded}`]: { margin: 0 },
    borderRadius: theme.shape.borderRadius * 4,
}));

export const StyledAccordionSummary = styled(AccordionSummary, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<StyledListItemButtonProps>(({ theme, isActive }) => ({
    minHeight: theme.typography.pxToRem(40),
    padding: theme.spacing(1, 2),
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    [theme.breakpoints.up('xl')]: {
        padding: theme.spacing(1, 6),
    },
    [`&.${accordionSummaryClasses.expanded}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(2),
        padding: theme.spacing(1, 2),
        minHeight: theme.typography.pxToRem(36),
        borderRadius: theme.shape.borderRadius * 4,
        [theme.breakpoints.up('xl')]: {
            padding: theme.spacing(1, 6),
        },
    },

    [`& .${accordionSummaryClasses.content}`]: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(3),
        margin: 0,
        padding: theme.spacing(1, 0),
        minHeight: theme.typography.pxToRem(36),
        borderRadius: theme.shape.borderRadius * 4,
        [`&.${accordionSummaryClasses.expanded}`]: {
            margin: 0,
            padding: theme.spacing(1, 0),
            minHeight: theme.typography.pxToRem(36),
        },
    },
}));

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    marginLeft: theme.spacing(6),
    color: theme.palette.text.secondary,
    [theme.breakpoints.up('xl')]: {
        marginLeft: theme.spacing(6),
    },
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    alignItems: 'start',
    color: theme.palette.grey[900],
    [theme.breakpoints.up('xl')]: {
        padding: theme.spacing(0, 2),
    },
}));

export const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<StyledListItemButtonProps>(({ theme, isActive }) => ({
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    padding: theme.spacing(2, 2),
    gap: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    [theme.breakpoints.up('xl')]: {
        padding: theme.spacing(2, 4),
    },
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
    [`& .${badgeClasses.badge}`]: {
        marginRight: theme.spacing(4),
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
        fontSize: theme.typography.caption.fontSize,
        fontWeight: 400,
    },
}));
