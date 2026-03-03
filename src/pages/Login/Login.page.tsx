import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { BugReport } from '@mui/icons-material';
import {
    Avatar,
    Button,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import { HeroCard } from '@components';

import {
    StyledContent,
    StyledErrorTextField,
    StyledHeading,
    StyledLoginCard,
    StyledStackWrapper,
    StyledWrapper,
} from './Login.styles';

export const Login = () => {
    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const [email, setEmail] = useState('');
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (value.length > 0) {
            setIsInvalidEmail(!e.target.validity.valid);
        } else {
            setIsInvalidEmail(false);
        }
    };

    const [password, setPassword] = useState('');
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isInvalidPassword =
        password.length > 0 && !passwordRegex.test(password);

    const isFormValid =
        email.length > 0 &&
        password.length > 0 &&
        !isInvalidEmail &&
        !isInvalidPassword;

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!isFormValid) {
            // console.log('Submission blocked: Fix validation errors first.');
            return;
        }

        //call backend
        // console.log('Form Submitted Data:', { email, password });
    };

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

                    <Stack component="form" spacing={4} onSubmit={handleSubmit}>
                        <StyledErrorTextField
                            required
                            name="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            error={isInvalidEmail}
                            helperText={
                                isInvalidEmail
                                    ? 'Enter a valid email address'
                                    : ''
                            }
                        />

                        <StyledErrorTextField
                            required
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => setPassword(e.target.value)}
                            error={isInvalidPassword}
                            helperText={
                                isInvalidPassword
                                    ? 'Password must contain at least 8 characters(atleast one small letter, one capital letter, one number and atleast one special character)'
                                    : ''
                            }
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            Login
                        </Button>
                    </Stack>

                    <Typography textAlign={'center'}>
                        {"Don't have an account?" }<NavLink to="/register">Register</NavLink>
                    </Typography>
                </StyledLoginCard>
                {isDesktop && <HeroCard />}
            </StyledStackWrapper>
        </StyledWrapper>
    );
};
