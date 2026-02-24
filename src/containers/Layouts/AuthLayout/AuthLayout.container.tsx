import { BugReport } from '@mui/icons-material';
import { Avatar, Typography, useMediaQuery, useTheme } from '@mui/material';

import {
    StyledContent,
    StyledHeading,
    StyledHeroCard,
    StyledLoginCard,
    StyledStackWrapper,
    StyledWrapper,
} from './AuthLayout.styles';
import type { AuthLayoutProps } from './AuthLayout.types';

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <StyledWrapper>
            <StyledStackWrapper direction={'row'}>
                <StyledLoginCard>
                    <StyledHeading>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <BugReport />
                        </Avatar>
                        <Typography variant="h2" color="primary">
                            {' '}
                            TaskVault{' '}
                        </Typography>
                    </StyledHeading>

                    <StyledContent>
                        <Typography variant="h2"> {title} </Typography>
                        <Typography variant="body1">
                            {' '}
                            {subtitle} to track your projects easily and keep a
                            record of tickets and bugs. Get role based
                            dashboards to easily monitor and visualize things.{' '}
                        </Typography>
                    </StyledContent>
                    {children}
                </StyledLoginCard>

                {isDesktop && (
                    <StyledHeroCard>
                        <Typography
                            variant="h1"
                            color={theme.palette.common.white}
                        >
                            {' '}
                            Simplify Support with TaskVault{' '}
                        </Typography>
                        <Typography
                            variant="h3"
                            color={theme.palette.common.white}
                        >
                            {' '}
                            Manage, prioritize, and resolve tickets faster with
                            a centralized system built for modern teams.
                        </Typography>
                    </StyledHeroCard>
                )}
            </StyledStackWrapper>
        </StyledWrapper>
    );
};
