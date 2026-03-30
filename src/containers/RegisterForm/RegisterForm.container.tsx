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

import { VerifyOtpDialog } from '@containers/VerifyOtp';
import { useSignupMutation, useVerifyMutation } from '@features/auth';
import { useAuthStore } from '@features/auth';
import { RegisterInput, registerSchema } from '@features/auth/registerShema';
import { useRegisterStore } from '@features/auth/store/registerStore';

import {
    StyledErrorTextField,
} from './RegisterForm.styles';

export const RegisterForm = () => {
    const navigate = useNavigate();

    const [otpOpen, setOtpOpen] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);


    const { name, email, password, confirmPassword, ...actions } = useRegisterStore();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const setAuth = useAuthStore((s) => s.setAuth);

    const signupMutation = useSignupMutation();
    const verifyMutation = useVerifyMutation();


    const validation = registerSchema.safeParse({ name, email, password, confirmPassword });
    const fieldErrors = !validation.success ? validation.error.flatten().fieldErrors : {};

    const isFormValid = validation.success;

    const shouldShowError = (fieldName: keyof RegisterInput, value: string) => {
        const hasError = !!fieldErrors[fieldName];
        const hasStartedTyping = value.length > 0;
        return (hasStartedTyping || isSubmitted) && hasError;
    };


    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!validation.success) {
            return;
        }

        signupMutation.mutate(validation.data, {
            onSuccess: () => {
                setOtpOpen(true);
            }
        });
    };

    const handleVerify = (otp: number) => {
        verifyMutation.mutate({ email, otp }, {
            onSuccess: (data) => {
                setAuth(data);
                setOtpOpen(false);
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                void navigate('/project/create');
            }
        });
    };

    return (

        <>

            <Stack component="form" spacing={4} onSubmit={handleSubmit}>
                <StyledErrorTextField
                    label="Name"
                    value={name}
                    onChange={(e) => actions.setName(e.target.value)}
                    error={shouldShowError('name', name)}
                    helperText={shouldShowError('name', name) ? fieldErrors.name?.[0] : ''}
                />

                <StyledErrorTextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => {
                            actions.setEmail((e.target.value).toLowerCase())
                            if (signupMutation.error) {
                                signupMutation.reset();
                            }
                        }}
                    error={shouldShowError('email', email)}
                    helperText={shouldShowError('email', email) ? fieldErrors.email?.[0] : ''}
                />

                <StyledErrorTextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => actions.setPassword(e.target.value)}
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

                <StyledErrorTextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => actions.setConfirmPassword(e.target.value)}
                    error={shouldShowError('confirmPassword', confirmPassword)}
                    helperText={shouldShowError('confirmPassword', confirmPassword) ? fieldErrors.confirmPassword?.[0] : ''}
                />

                {signupMutation.isError && (
                    <Typography variant="subtitle2" color="error.contrastText">
                        {signupMutation.error.message}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    type="submit"
                    disabled={!isFormValid || signupMutation.isPending}
                >
                    {signupMutation.isPending ? 'Registering...' : 'Register'}
                </Button>

            </Stack>

            <VerifyOtpDialog
                open={otpOpen}
                handleVerify={handleVerify}
                setOpen={setOtpOpen}
                errorMsg={verifyMutation.error?.message || ''}
                userMail={email}
            />
        </>

    );
};
