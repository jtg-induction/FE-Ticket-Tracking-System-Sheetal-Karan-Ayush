import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Button,
    IconButton,
    InputAdornment,
    Stack,
    Typography,
} from '@mui/material';

import { useLoginMutation } from '@features/auth';

import {
    StyledErrorTextField,
} from './LoginForm.styles';
import { LoginInput, loginSchema } from '@features/auth/loginSchema';
import { useLoginStore } from '@features/auth/store/loginStore';
import z from 'zod';

export const LoginForm = () => {
    const navigate = useNavigate();

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
    );
};
