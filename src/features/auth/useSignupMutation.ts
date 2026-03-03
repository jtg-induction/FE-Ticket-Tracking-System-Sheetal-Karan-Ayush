import { signupUser } from 'api/authApi'

import { useMutation } from '@tanstack/react-query'


export const useSignupMutation = () => useMutation({
    mutationFn: signupUser,
})
