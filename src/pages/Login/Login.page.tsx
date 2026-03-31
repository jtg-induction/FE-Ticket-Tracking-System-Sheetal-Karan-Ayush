import { NavLink } from 'react-router-dom';

import { BugReport } from '@mui/icons-material';
import {
    Avatar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import { HeroCard } from '@components';
import { LoginForm } from '@containers';

import {
    StyledContent,
    StyledHeading,
    StyledLoginCard,
    StyledStackWrapper,
    StyledWrapper,
} from './Login.styles';

export const Login = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <StyledWrapper>
            <StyledStackWrapper direction={'row'}>
                <StyledLoginCard>
                    <StyledHeading>
                        <Avatar
                            alt="TaskVault"
                            sx={{ bgcolor: 'primary.main' }}
                        >
                            <BugReport />
                        </Avatar>
                        <Typography variant="h2" color="primary">
                            TaskVault
                        </Typography>
                    </StyledHeading>

                    <StyledContent>
                        <Typography variant="h2"> Welcome Back !</Typography>
                        <Typography variant="body1">
                            Login to track your projects easily and keep a
                            record of tickets and bugs. Get role based
                            dashboards to easily monitor and visualize things.
                        </Typography>
                    </StyledContent>

                    <LoginForm />

                    <Typography textAlign={'center'}>
                        {"Don't have an account?"}
                        <NavLink to="/register">Register</NavLink>
                    </Typography>
                </StyledLoginCard>
                {isDesktop && <HeroCard />}
            </StyledStackWrapper>
        </StyledWrapper>
    );
};
