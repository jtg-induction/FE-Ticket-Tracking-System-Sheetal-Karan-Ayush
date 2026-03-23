import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledDialogButton = styled(Button)(({theme}) => ({
    minWidth: theme.typography.pxToRem(90),
}));
