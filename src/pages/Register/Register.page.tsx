import { NavLink } from 'react-router-dom';

import { Typography, useMediaQuery, useTheme } from '@mui/material';

import { HeroCard, Logo } from '@components';

import {
    StyledContent,
    StyledRegisterCard,
    StyledStackWrapper,
    StyledWrapper,
} from './Register.styles';
import { RegisterForm } from '@containers';

export const Register = () => {
    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <StyledWrapper>
            <StyledStackWrapper direction={'row'}>
                <StyledRegisterCard>
                    <Logo />

                    <StyledContent>
                        <Typography variant="h2"> Welcome !</Typography>
                        <Typography variant="body1">
                            Register to track your projects easily and keep a
                            record of tickets and bugs. Get role based
                            dashboards to easily monitor and visualize things.
                        </Typography>
                    </StyledContent>

                    <RegisterForm />

                    <Typography textAlign={'center'}>
                        Have an account? <NavLink to="/login">Login</NavLink>
                    </Typography>
                </StyledRegisterCard>

                {isDesktop && <HeroCard />}
            </StyledStackWrapper>
        </StyledWrapper>
    );
};
