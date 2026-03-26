import { Delete, Edit } from "@mui/icons-material";
import { BadgeProps, Box, BoxProps, Button, Chip, styled } from "@mui/material";

interface StatusBadgeProps extends BadgeProps {
    ownerState: {
        archived: boolean;
    };
}

export const StyledHeader = styled(Box)<BoxProps>(({ theme }) => {
    const { palette, spacing } = theme;

    return {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: spacing(4),
        gap: spacing(2),
        backgroundColor: palette.common.white,
        width: '100%',
        zIndex: theme.zIndex.drawer + 1,
    };
});

export const StyledLeftBox = styled(Box)(({ theme }) => {
    const { spacing } = theme;

    return {
        maxWidth: '60%',
        display: 'flex',
        gap: spacing(4),
        alignItems: 'center',
        textDecoration: 'none',

        [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
        },
    };
});
export const StyledUpperBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'start',
        gap: theme.spacing(4),
    },
}));

export const StyledLowerBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
}));
export const StyledRightBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    justifyContent: 'space-between',
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    padding: theme.spacing(2, 4),
    fontWeight: 900,
}));

export const IconBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
}));

export const EditIcon = styled(Edit)(({ theme }) => ({
    cursor: 'pointer',
    color: theme.palette.primary.main,
    transition: '0.2s ease',

    '&:hover': {
        color: theme.palette.text.secondary,
    },
}));

export const DeleteIcon = styled(Delete)(({ theme }) => ({
    cursor: 'pointer',
    transition: '0.2s ease',
    color: theme.palette.error.contrastText,

    '&:hover': {
        color: theme.palette.error.main,
    },
}));

export const StatusBadge = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'ownerState',
})<StatusBadgeProps>(({ theme, ownerState }) => ({
    height: 24,
    fontWeight: 500,
    fontSize: 12,
    textTransform: 'uppercase',
    backgroundColor: ownerState.archived
        ? theme.palette.error.contrastText
        : theme.palette.success.contrastText,
    color: ownerState.archived
        ? theme.palette.grey[100]
        : theme.palette.common.white,
}));
