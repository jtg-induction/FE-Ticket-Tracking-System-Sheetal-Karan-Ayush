import { signupUser } from 'api/authApi'

import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from './authStore'

export const useSignupMutation = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: signupUser,
        onSuccess: (data) => {
            setAuth(data);
        },
    });
}
