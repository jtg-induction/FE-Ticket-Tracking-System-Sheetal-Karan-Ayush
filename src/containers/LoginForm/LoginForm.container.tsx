import { Button, Stack } from '@mui/material';

import { StyledErrorTextField } from './LoginForm.styles';

import { useState } from 'react';
import { REGEX } from '@constant';

export const LoginForm = () => {
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

    const isFormValid =
        email.length > 0 &&
        password.length > 0 &&
        !isInvalidEmail &&
        !isInvalidPassword;

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            return;
        }
        // TODO: send data to backend
    };

    return (
        <Stack component="form" spacing={4} onSubmit={handleSubmit}>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                }
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
    );
};
