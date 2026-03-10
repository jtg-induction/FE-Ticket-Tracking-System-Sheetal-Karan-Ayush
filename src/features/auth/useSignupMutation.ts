import { signupUser } from '@api'
import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from './store'

export const useSignupMutation = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: signupUser,
        onSuccess: (data) => {
            setAuth(data);
        },
    });
}
