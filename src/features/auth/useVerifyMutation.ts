import { VerifyOtp } from 'api/authApi'

import { useMutation } from '@tanstack/react-query'


export const useVerifyMutation = () => useMutation({
    mutationFn: VerifyOtp,
})
