import { verifyOtp } from '@api/auth'
import { useMutation } from '@tanstack/react-query'


export const useVerifyMutation = () => useMutation({
    mutationFn: verifyOtp,
})
