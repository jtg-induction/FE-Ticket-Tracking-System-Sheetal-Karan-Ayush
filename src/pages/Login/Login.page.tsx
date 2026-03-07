import { Typography, useMediaQuery, useTheme } from '@mui/material';

import { HeroCard, Logo } from '@components';

import {
    StyledContent,
    StyledLoginCard,
    StyledStackWrapper,
    StyledWrapper,
} from './Login.styles';
import { LoginForm } from '@containers';
import { NavLink } from 'react-router-dom';

export const Login = () => {
    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <StyledWrapper>
            <StyledStackWrapper direction={'row'}>
                <StyledLoginCard>
                    <Logo />

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
