import { signupUser } from '@api';
import { useMutation } from '@tanstack/react-query';

export const useSignupMutation = () =>
    useMutation({
        mutationFn: signupUser,
    });
