import { loginUser } from '@api';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from './store';

export const useLoginMutation = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data);
        },
    });
};
