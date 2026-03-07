import { BugReport } from '@mui/icons-material';
import { Avatar, Typography } from '@mui/material';
import { StyledHeading } from './Logo.styles';

export const Logo = () => {
    return (
        <StyledHeading>
            <Avatar alt="TaskVault" sx={{ bgcolor: 'primary.main' }}>
                <BugReport />
            </Avatar>
            <Typography variant="h2" color="primary">
                TaskVault
            </Typography>
        </StyledHeading>
    );
};
