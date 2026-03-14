import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

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
import { VerifyOtpDialog } from '@containers/VerifyOtp';
import { useSignupMutation, useVerifyMutation } from '@features/auth';
import { useAuthStore } from '@features/auth';

import {
    StyledContent,
    StyledErrorTextField,
    StyledHeading,
    StyledRegisterCard,
    StyledStackWrapper,
    StyledWrapper,
} from './Register.styles';

export const Register = () => {
    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const [name, setName] = useState('');
    const nameRegex = /^[A-Za-z][A-Za-z ]*$/;
    const isInvalidName = name.length > 0 && !nameRegex.test(name);

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

    const [confirmPassword, setConfirmPassword] = useState('');
    const [isInvalidConfirmPassword, setIsInvalidConfirmPassword] =
        useState(false);
    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (password.length > 0 && value.length > 0) {
            setIsInvalidConfirmPassword(value !== password);
        } else {
            setIsInvalidConfirmPassword(false);
        }
    };

    const isFormValid =
        name.length > 2 &&
        name.length < 256 &&
        email.length > 0 &&
        email.length < 256 &&
        password.length > 7 &&
        password.length < 256 &&
        confirmPassword.length > 7 &&
        !isInvalidName &&
        !isInvalidEmail &&
        !isInvalidPassword &&
        password === confirmPassword;

    const [otpOpen, setOtpOpen] = useState<boolean>(false);
    const signupMutation = useSignupMutation();
    const verifyMutation = useVerifyMutation();

    const setAuth = useAuthStore((s) => s.setAuth);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }
        signupMutation.mutate(
            { name, email, password, avatarId: 1 },
            { onSuccess: () => setOtpOpen(true) },
        );
    };
    const navigate = useNavigate();
    const handleVerify = (otp: number) => {
        verifyMutation.mutate(
            { name, email, password, avatarId: 1, otp },
            {
                onSuccess: (data) => {
                    setAuth(data);
                    setOtpOpen(false);
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    void navigate('/project/create');
                },
                onError: () => {
                    <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.error.contrastText }}
                    >
                        {verifyMutation.error?.message}
                    </Typography>;
                },
            },
        );
    };

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

                    <Stack component="form" spacing={4} onSubmit={handleSubmit}>
                        <StyledErrorTextField
                            required
                            name="name"
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={isInvalidName}
                            helperText={
                                isInvalidName
                                    ? 'Enter a valid name (letters only), with length ranging from 2 to 255'
                                    : ''
                            }
                        />
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
                            onChange={(e) => setPassword(e.target.value)}
                            error={isInvalidPassword}
                            helperText={
                                isInvalidPassword
                                    ? 'Password must contain at least 8 characters(atleast one small letter, one capital letter, one number and atleast one special character) and at max 255 characters'
                                    : ''
                            }
                        />

                        <StyledErrorTextField
                            required
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={isInvalidConfirmPassword}
                            helperText={
                                isInvalidConfirmPassword
                                    ? 'Confirm password and password must be same'
                                    : ''
                            }
                        />
                        {signupMutation.isError && (
                            <Typography
                                variant="subtitle2"
                                sx={{ color: theme.palette.error.contrastText }}
                            >
                                {signupMutation.error.message}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            Submit
                        </Button>
                    </Stack>
                    <VerifyOtpDialog
                        open={otpOpen}
                        handleVerify={handleVerify}
                        setOpen={setOtpOpen}
                        errorMsg={verifyMutation.error?.message || ''}
                    />
                    <Typography textAlign={'center'}>
                        Have an account? <NavLink to="/login">Login</NavLink>
                    </Typography>
                </StyledRegisterCard>
                {isDesktop && <HeroCard />}
            </StyledStackWrapper>
        </StyledWrapper>
    );
};
