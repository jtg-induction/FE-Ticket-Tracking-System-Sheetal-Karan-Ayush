import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import { BugReport, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Avatar,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import { HeroCard } from '@components';
import { useLoginMutation } from '@features/auth';

import {
    StyledContent,
    StyledErrorTextField,
    StyledHeading,
    StyledLoginCard,
    StyledStackWrapper,
    StyledWrapper,
} from './Login.styles';
import { LoginInput, loginSchema } from '@features/auth/loginSchema';
import { useLoginStore } from '@features/auth/store/loginStore';
import z from 'zod';

export const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const { email, password, ...actions } = useLoginStore();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const loginMutation = useLoginMutation();

    const validation = loginSchema.safeParse({ email, password });
    const fieldErrors = !validation.success ? z.flattenError(validation.error).fieldErrors : {};

    const isFormValid = validation.success;

    const shouldShowError = (fieldName: keyof LoginInput, value: string) => {
        const hasError = !!fieldErrors[fieldName];
        const hasStartedTyping = value.length > 0;
        return (hasStartedTyping || isSubmitted) && hasError;
    };


    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
            return;
        }

        loginMutation.mutate(validation.data, {
            onSuccess: (data) => {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                void navigate('/');
            },
            onError: (error: any) => {
                console.error("Login failed:", error.message);
            },
        });
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
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                actions.setEmail((e.target.value).toLowerCase());
                                if (loginMutation.isError) {
                                    loginMutation.reset();
                                }
                            }}
                            error={shouldShowError('email', email)}
                            helperText={shouldShowError('email', email) ? fieldErrors.email?.[0] : ''}
                        />

                        <StyledErrorTextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                actions.setPassword(e.target.value);
                                if (loginMutation.isError) {
                                    loginMutation.reset();
                                }
                            }}
                            error={shouldShowError('password', password)}
                            helperText={shouldShowError('password', password) ? fieldErrors.password?.[0] : ''}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={(e) => e.preventDefault()}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />

                        {loginMutation.isError && (
                            <Typography variant="subtitle2" color="error.contrastText">
                                {loginMutation.error.message}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!isFormValid || loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Loging In...' : 'Login'}
                        </Button>

                    </Stack>

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
