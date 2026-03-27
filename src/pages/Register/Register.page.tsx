import { NavLink } from 'react-router-dom';

import { BugReport } from '@mui/icons-material';
import {
    Avatar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import { HeroCard } from '@components';

import {
    StyledContent,
    StyledHeading,
    StyledRegisterCard,
    StyledStackWrapper,
    StyledWrapper,
} from './Register.styles';

import { RegisterForm } from '@containers/RegisterForm';

export const Register = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <StyledWrapper>
            <StyledStackWrapper direction={'row'}>
                <StyledRegisterCard>
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
