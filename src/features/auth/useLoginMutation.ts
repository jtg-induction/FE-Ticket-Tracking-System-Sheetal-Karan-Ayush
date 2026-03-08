import { loginUser } from 'api/authApi';

import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from './authStore';

export const useLoginMutation = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data);
        },
    });
};
