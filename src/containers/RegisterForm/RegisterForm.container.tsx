import { Button, Stack } from '@mui/material';
import { StyledErrorTextField } from './RegisterForm.styles';
import { useState } from 'react';
import { REGEX } from '@constant';

export const RegisterForm = () => {
    const [name, setName] = useState('');
    const isInvalidName = name.length > 0 && !REGEX.NAME.test(name);

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
    const isInvalidPassword =
        password.length > 0 && !REGEX.PASSWORD.test(password);

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
        name.length > 0 &&
        email.length > 0 &&
        password.length > 0 &&
        confirmPassword.length > 0 &&
        !isInvalidName &&
        !isInvalidEmail &&
        !isInvalidPassword &&
        password === confirmPassword;

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }
        //TODO: call backend
    };

    return (
        <Stack component="form" spacing={4} onSubmit={handleSubmit}>
            <StyledErrorTextField
                required
                name="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={isInvalidName}
                helperText={
                    isInvalidName ? 'Enter a valid name (letters only)' : ''
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
                helperText={isInvalidEmail ? 'Enter a valid email address' : ''}
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
                        ? 'Password must contain at least 8 characters(atleast one small letter, one capital letter, one number and atleast one special character)'
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

            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormValid}
            >
                Submit
            </Button>
        </Stack>
    );
};
